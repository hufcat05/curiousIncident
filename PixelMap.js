const NeoPixel = require('./NeoPixel');

const SERVER1 = 'tcp://172.18.40.80:800';
const SERVER2 = 'tcp://172.18.40.165:800';
const SERVER3 = 'tcp://fixme';

const stripA = "A";
const stripB = "B";
const stripC = "C";
const stripD = "D";

class PixelMap {

    constructor () {
        this.neopixel1 = new NeoPixel();
        this.neopixel2 = new NeoPixel();
        this.neopixel3 = new NeoPixel();

        this.setupControllers();
        this.sections = this.initializeSections();
    }

    async setupControllers() {
      //Connect to each controller
      await this.neopixel1.connect(SERVER1);
      await this.neopixel2.connect(SERVER2);
      await this.neopixel3.connect(SERVER3);

      //Set pixel counts for each strip on each controller
      for(let i = 0; i < 4; i++) {
          this.neopixel1.setPixelCount(i, 150);
          this.neopixel2.setPixelCount(i, 150); 
          this.neopixel3.setPixelCount(1, 150);
      }

      await NeoPixel.wait(1000);

      //Turn all relays on in each controller
      for(let i = 0; i < 4; i++ ) {
          this.neopixel1.toggleRelayOn(i);    
          this.neopixel2.toggleRelayOn(i);
          this.neopixel3.toggleRelayOn(i);
      }
    }

    static getPixelMap() {
        var sections = this.initializeSections();
        return {
            A: this.buildA(),
            B: this.buildB(),
            C: this.buildC(),
            D: this.buildD(),
            E: this.buildE(),
            F: this.buildF(),
            G: this.buildG(),
            H: this.buildH()
        }
    }

    static initializeSections() {
        var sectionMap = {};
        //A1
        sectionMap.a1a = this.buildSection(this.neopixel1, stripA, 1, 27);
        sectionMap.a1b = this.buildSection(this.neopixel2, stripD, 191, 219);
        sectionMap.a1c = this.buildSection(this.neopixel1, stripA, 1, 27);
        sectionMap.a1d = this.buildSection(this.neopixel2, stripC, 191, 219);
        
        //A2
        sectionMap.a2a = this.buildSection(this.neopixel1, stripA, 28, 54);
        sectionMap.a2b = this.buildSection(this.neopixel3, stripA, 191, 219);
        sectionMap.a2c = this.buildSection(this.neopixel1, stripA, 28, 54);
        sectionMap.a2d = a1b;

        //A3
        sectionMap.a3a = this.buildSection(this.neopixel1, stripA, 55, 81);
        sectionMap.a3b = this.buildSection(this.neopixel3, stripB, 191, 219);
        sectionMap.a3c = this.buildSection(this.neopixel1, stripA, 55, 81);
        sectionMap.a3d = a2b;

        //A4
        sectionMap.a4a = this.buildSection(this.neopixel1, stripA, 82, 108);
        sectionMap.a4b = this.buildSection(this.neopixel3, stripC, 191, 219);
        sectionMap.a4c = this.buildSection(this.neopixel1, stripA, 82, 108);
        sectionMap.a4d = a3b;

        //A5
        sectionMap.a5a = this.buildSection(this.neopixel1, stripA, 109, 134);
        sectionMap.a5b = this.buildSection(this.neopixel3, stripD, 191, 219);
        sectionMap.a5c = this.buildSection(this.neopixel1, stripA, 109, 134);
        sectionMap.a5d = a4b;

        //B1
        sectionMap.b1a = a1c;
        sectionMap.b1b = this.buildSection(this.neopixel2, stripD, 164, 190);
        sectionMap.b1c = this.buildSection(this.neopixel1, stripB, 1, 27);
        sectionMap.b1d = this.buildSection(this.neopixel2, stripC, 164, 190);

        //B2
        sectionMap.b2a = a2c;
        sectionMap.b2b = this.buildSection(this.neopixel3, stripA, 164, 190);
        sectionMap.b2c = this.buildSection(this.neopixel1, stripB, 28, 54);
        sectionMap.b2d = b1d;

        return sectionMap;
    }

    static buildA() {
        return {
            1: {A: this.sections.a1a, B: this.sections.a1b, C: this.sections.a1c, D: this.sections.a1d},
            2: {A: this.sections.a2a, B: this.sections.a2b, C: this.sections.a2c, D: this.sections.a2d},
            3: {A: this.sections.a3a, B: this.sections.a3b, C: this.sections.a3c, D: this.sections.a3d},
            4: {A: this.sections.a4a, B: this.sections.a4b, C: this.sections.a4c, D: this.sections.a4d},
            5: {A: this.sections.a5a, B: this.sections.a5b, C: this.sections.a5c, D: this.sections.a5d}
        };
    }

    static buildB() {
        return {};
    }

    static buildC() {
        return {};
    }

    static buildD() {
        return {};
    }

    static buildE() {
        return {};
    }
    
    static buildF() {
        return {};
    }
    
    static buildG() {
        return {};
    }
    
    static buildH() {
        return {};
    }

    static buildSection(controller, strip, pixelMin, pixelMax){
        var pixels = [];

        for (var i = pixelMin; i <= pixelMax; i++){
            pixels.push(i);
        }

        return {controller, strip, pixels};
    }
}