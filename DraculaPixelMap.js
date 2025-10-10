const NeoPixel = require('./NeoPixel');

const SERVER1 = 'tcp://172.16.96.31:800'
const SERVER2 = 'tcp://172.16.96.32:800'

class DraculaPixelMap {
    constructor () {
        this.neopixel1 = new NeoPixel("neopixel1");
        this.neopixel2 = new NeoPixel("neopixel2");

        this.setupControllers();
    }

    async shutdownControllers() {
        console.log("turning strips off");
        this.neopixel1.off(0);
        this.neopixel1.off(2);
       // this.neopixel2.off(0);

        await NeoPixel.wait(500);

        //Turn all relays off in each controller
        this.neopixel1.toggleRelayOff(0);  
        this.neopixel1.toggleRelayOff(2);  
      //  this.neopixel2.toggleRelayOff(0);

        this.neopixel1.disconnect();
       // this.neopixel2.disconnect();
    }

    async setupControllers() {
        //Connect to each controller
        await this.neopixel1.connect(SERVER1);
       // await this.neopixel2.connect(SERVER2);

        await this.neopixel1.setPixelCount(0, 300);
        await this.neopixel1.setPixelCount(2, 300);
      //  await this.neopixel2.setPixelCount(0, 300);

        await NeoPixel.wait(500);

        //Turn server 1 relay
        this.neopixel1.toggleRelayOn(0);  
        this.neopixel1.toggleRelayOn(2); 
        //this.neopixel2.toggleRelayOn(0); 

        //Turn all strips off
        console.log("turning strips off");
        this.neopixel1.off(0);
        this.neopixel1.off(2);
        //this.neopixel2.off(0);
    }

    getControllers() {
        return [this.neopixel1, this.neopixel2];
    }
}

module.exports = DraculaPixelMap;