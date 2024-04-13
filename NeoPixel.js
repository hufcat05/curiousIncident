const EventEmitter = require('events');
const debug = require('debug')('neopixel:Neopixel');
const TcpTransport = require('./TcpTransport');
const Protocol = require('./Protocol');
const WrongFeedback = require('./WrongFeedback');
const BadType = require('./BadType');

class NeoPixel extends EventEmitter {
  constructor (name) {
    super();

    this.name = name;
    this.transport = undefined;
    this.pixels = undefined;
    this.latestPixelState = undefined;
    this.cbs = [];
  }

  getLatestPixelState () {
    return this.latestPixelState;
  }

  getName() {
    return this.name;
  }

  //Method: connect
  //Description: Open connection to Node.js server as 'transport'
  async connect (urlOrTransport) {
    switch (typeof urlOrTransport) {
      case 'string':
        this.transport = new TcpTransport(Protocol.inboundFrameSize());
        break;

      case 'object':
        this.transport = urlOrTransport;
        break;

      default:
        throw new Error('Unsupported connection type');
    }

    this.transport.onFrame(this._handleFrame.bind(this));

    const [res] = await Promise.all([
      new Promise((resolve, reject) => this.cbs.push({
        time: Date.now(),
        ack: 'connect',
        resolve,
        reject
      })),
      this.transport.connect(urlOrTransport)
    ]);

    this.pixels = res.pixels; //extract pixel count from reply

    return { latency: res.latency, pixels: res.pixels };
  }

  //Method: disconnect
  //Description: Close 'transport' connection to Node.js server
  async disconnect () {
    await this.transport.disconnect();
  }

  //Method: setPixels
  //Description: Take 'arrayOfColors' and apply each element to the specified strip and pixel
  setPixels (arrayOfColors, reset = false) {
    //console.log(arrayOfColors);
    return new Promise((resolve, reject) => {
      const startTime = Date.now();

      //Check to make sure arrayOfColors is actually an array
      if (!Array.isArray(arrayOfColors)) return reject(new BadType('setPixels accepts only arrays'));

      //Determine which strips need reset to off prior to starting
      let stripReset = [false, false, false, false];
      let resetCount = 0;
      if (reset) {
        arrayOfColors.forEach((val) => {
          var strip = Number(val.s);

          if (!stripReset[strip]) {
            stripReset[strip] = true;
            resetCount++;
          }
        });
      }

      //Setup outbound frame buffer size based on:
      //  -number of strips requiring reset prior to setting pixels
      //  -number of pixel commands inarrayOfColors
      //  -final 'apply' command to push data to strips
      const buffer = Protocol.createOutboundFrame(resetCount + arrayOfColors.length + 1);
      let offset = 0;

      //Reset strips by adding 'off' commands to frame buffer where necessary
      for (let i = 0; i < stripReset.length; i++) {
      	if(stripReset[i]) {
      		Protocol.off(buffer, offset, i);
      		offset += Protocol.outboundFrameSize(); //increase frame buffer offset for next command
      	}
      }

      //For each pixel setting in arrayOfColors, add a set command to the outbound frame
      for (const { strip, s, pixel, p, red, r, green, g, blue, b } of arrayOfColors) {
        Protocol.set(
          buffer,
          offset,
          strip || s || 0,
          pixel || p || 0,
          red || r || 0,
          green || g || 0,
          blue || b || 0
        )
        offset += Protocol.outboundFrameSize(); //increase frame buffer offset for next command
      }

      Protocol.apply(buffer, offset); //Send apply command to Node.js server to push data to strip(s)

      this.cbs.push({ time: startTime, ack: 'apply', resolve, reject });
      this.transport.write(buffer);
      this.latestPixelState = arrayOfColors;
    })
  }

  //Method: fill
  //Description: fill 'strip' with 'color'
  fill (strip, color) {
    return new Promise((resolve, reject) => {
      //Setup outbound frame buffer size based on:
      //  -'fill' command to set strip pixel color
      //  -'apply' command to push data to strips
      const buffer = Protocol.createOutboundFrame(2);

      //destructure object 'color' into individual RGB component variables
      const { red, r, green, g, blue, b } = color;

      //add fill command to frame buffer
      Protocol.fill(
        buffer,
        0,
        strip,
        red || r || 0,
        green || g || 0,
        blue || b || 0
      );

      Protocol.apply(buffer, Protocol.outboundFrameSize()); //Send apply command to Node.js server to push data to strip(s)
      
      this.cbs.push({ time: Date.now(), ack: 'apply', resolve, reject });
      this.transport.write(buffer);
    })
  }

  //Method: off
  //Description: Set all pixels on 'strip' to OFF
  off (strip) {
    return new Promise((resolve, reject) => {
      //Setup outbound frame size based on:
      //  -fill command to set strip pixel color
      //  -'apply' command to push data to strips
      const buffer = Protocol.createOutboundFrame(2);
      
      //add 'off' command to frame buffer
      Protocol.off(buffer, 0, strip);

      //add 'apply' command to frame buffer
      Protocol.apply(buffer, Protocol.outboundFrameSize(), strip);

      this.cbs.push({ time: Date.now(), ack: 'apply', resolve, reject });
      this.transport.write(buffer);
    })
  }

  //Method: setPixelCount
  //Description: Update number of pixels on specified strip
  setPixelCount (strip = 0, count = 0) {
    return new Promise((resolve, reject) => {
      const buffer = Protocol.createOutboundFrame(1);
      Protocol.pixelCount(buffer, 0, strip, count);

      this.cbs.push({ time: Date.now(), ack: 'apply', resolve, reject });
      this.transport.write(buffer);
    })
  }

  //Method: toggleRelayOn
  //Description: Turn on specified relay output
  toggleRelayOn (relay = 1) {
    return new Promise((resolve, reject) => {
      const buffer = Protocol.createOutboundFrame(1);
      Protocol.relayOn(buffer, 0, relay);

      this.cbs.push({ time: Date.now(), ack: 'apply', resolve, reject });
      this.transport.write(buffer);
    })
  }

  //Method: toggleRelayOff
  //Description: Turn off specified relay output
  toggleRelayOff (relay = 1) {
    return new Promise((resolve, reject) => {
      const buffer = Protocol.createOutboundFrame(1);
      Protocol.relayOff(buffer, 0, relay);

      this.cbs.push({ time: Date.now(), ack: 'apply', resolve, reject });
      this.transport.write(buffer);
    })
  }

  _handleFrame (frame) {
    const decodedFrame = Protocol.decodeFrame(frame);
    const { ack: receivedAck } = decodedFrame;
    debug('incomingFrame', decodedFrame);
    const { time, ack: expectedAck, resolve, reject } = this.cbs.shift();
    const latency = Date.now() - time;
    debug('latency %d ms', latency);
    if (receivedAck === expectedAck) {
      resolve({
        latency,
        ...(receivedAck === 'connect' && { pixels: decodedFrame.pixels })
      });
    } else {
      debug('WrongFeedback received: %s, expected: %s', receivedAck, expectedAck);
      reject(new WrongFeedback());
    }
  }

  static wait (ms) {
    return new Promise(resolve => {
      return setTimeout(resolve, Math.max(ms, 0));
    })
  }
}

module.exports = NeoPixel;