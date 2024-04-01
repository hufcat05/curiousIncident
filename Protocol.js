const SIZE_IN_FRAME = 4;

const SIZE_OUT_FRAME = 7;
//OUT Frame is made up of the following 7 bytes:
//Byte 0: Command being sent to the controller as defined by the const CMD items below
//Byte 1: 8-bit unsigned integer representing LED strip to which command applies (for ESP32, this is 0 - 3)
//Byte 2: 16-bit unsigned integer representing the pixel number to which command applies
//Byte 3: second byte of the above 16-bit pixel integer
//Byte 4: 8-bit unsigned integer representing intensity value of the RED component of the pixel
//Byte 5: 8-bit unsigned integer representing intensity value of the GREEN component of the pixel
//Byte 6: 8-bit unsigned integer representing intensity value of the BLUE component of the pixel

const CMD_APPLY = 0x01;     //Command to APPLY a set of pixel settings
const CMD_SET = 0x02;       //Command to send an individual pixel setting
const CMD_FILL = 0x03;      //Command to send a fill setting to a strip
const CMD_OFF = 0x04;       //Command to turn off a strip
const CMD_NUM_PIX = 0x05;   //Command to set the number of pixels on a strip
const CMD_RELAY_ON = 0x06;  //Command to activate a relay output
const CMD_RELAY_OFF = 0x07; //Command to deactivate a relay output

const RES_CONN_ACK = 0x01;
const RES_APPLY_ACK = 0x02;
const RES_INVALID = 0x99;

class Protocol {
  //Method: apply
  //Description: 
  static apply (buffer, offset) {
    buffer.writeUInt8(CMD_APPLY, offset);
    buffer.fill(0, offset + 1, offset + SIZE_OUT_FRAME);
    return buffer;
  }

  //Method: set
  //Description: set pixel 'led' on 'strip' to specified RGB color
  static set (buffer, offset, strip, led, red, green, blue) {
    buffer.writeUInt8(CMD_SET, offset);
    buffer.writeUInt8(strip, offset + 1);
    buffer.writeUInt16LE(led, offset + 2);
    buffer.writeUInt8(red, offset + 4);
    buffer.writeUInt8(green, offset + 5);
    buffer.writeUInt8(blue, offset + 6);
    return buffer;
  }

  //Method: fill
  //Description: fill all pixels on 'strip' with specified RGB color
  static fill (buffer, offset, strip, red, green, blue) {
    buffer.writeUInt8(CMD_FILL, offset);
    buffer.writeUInt8(strip, offset + 1);
    buffer.writeUInt8(0x00, offset + 2);
    buffer.writeUInt8(0x00, offset + 3);
    buffer.writeUInt8(red, offset + 4);
    buffer.writeUInt8(green, offset + 5);
    buffer.writeUInt8(blue, offset + 6);
    return buffer;
  }

  //Method: off
  //Description: turn off all pixels on 'strip'
  static off (buffer, offset, strip) {
    buffer.writeUInt8(CMD_OFF, offset);
    buffer.writeUInt8(strip, offset + 1);
    buffer.fill(0, offset + 2, offset + SIZE_OUT_FRAME);
    return buffer;
  }

  //Method: pixelCount
  //Description: Update number of pixels on 'strip' to 'count'
  static pixelCount (buffer, offset, strip, count) {
    buffer.writeUInt8(CMD_NUM_PIX);
    buffer.writeUint8(strip, offset + 1);
    buffer.writeUInt16LE(count, offset + 2); //Utilize 16-bit 'led' portion of packet for pixel count
    buffer.fill(0, 4, SIZE_OUT_FRAME);
    return buffer;
  }

  //Method: relayOn
  //Description: Toggle relay 'relay' ON
  static relayOn (buffer, offset, relay) {
    buffer.writeUInt8(CMD_RELAY_ON);
    buffer.writeUint8(relay, offset + 1);
    buffer.fill(0, 2, SIZE_OUT_FRAME);
    return buffer;
  }

  //Method: relayOff
  //Description: Toggle relay 'relay' OFF
  static relayOff (buffer, offset, relay) {
    buffer.writeUInt8(CMD_RELAY_OFF);
    buffer.writeUint8(relay, offset + 1);
    buffer.fill(0, 2, SIZE_OUT_FRAME);
    return buffer;
  }

  //Method: decodeFrame
  //Description: Decode incoming frame from Node.js server
  static decodeFrame (frame) {
    const msg = frame.readUInt8(0);
    switch (msg) {
      case RES_CONN_ACK:
        return { ack: 'connect', pixels: frame.readUInt16LE(1) };

      case RES_APPLY_ACK:
        return { ack: 'apply' };

      case RES_INVALID:
        return { ack: 'invalid' }; // just for testing purpose

      default:
        throw new Error('Unrecognized error');
    }
  }

  //Method: inboundFrameSize
  //Description: 
  static inboundFrameSize () {
    return SIZE_IN_FRAME;
  }

  //Method: outboundFrameSize
  //Description: 
  static outboundFrameSize () {
    return SIZE_OUT_FRAME;
  }

  //Method: createOutboundFrame
  //Description: 
  static createOutboundFrame (frames = 1) {
    return Buffer.alloc(Protocol.outboundFrameSize() * frames, 0);
  }
}

Protocol.CMD_SET = CMD_SET;
Protocol.CMD_APPLY = CMD_APPLY;
Protocol.CMD_FILL = CMD_FILL;
Protocol.CMD_OFF = CMD_OFF;
Protocol.CMD_NUM_PIX = CMD_NUM_PIX;
Protocol.CMD_RELAY_ON = CMD_RELAY_ON;
Protocol.CMD_RELAY_OFF = CMD_RELAY_OFF;

Protocol.RES_CONN_ACK = RES_CONN_ACK;
Protocol.RES_APPLY_ACK = RES_APPLY_ACK;
Protocol.RES_INVALID = RES_INVALID;

module.exports = Protocol