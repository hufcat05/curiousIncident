const NeoPixel = require('./NeoPixel');

const SERVER1 = 'tcp://172.16.56.31:800';
const SERVER2 = 'tcp://172.16.56.32:800';
const SERVER3 = 'tcp://172.16.56.33:800';

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

        await this.neopixel1.setPixelCount(0, 276);
        await this.neopixel1.setPixelCount(1, 276);
        await this.neopixel1.setPixelCount(2, 247);
        await this.neopixel2.setPixelCount(0, 276);
        await this.neopixel2.setPixelCount(1, 138);
        await this.neopixel2.setPixelCount(2, 220);
        await this.neopixel2.setPixelCount(3, 220);
        await this.neopixel3.setPixelCount(0, 220);
        await this.neopixel3.setPixelCount(1, 219);
        await this.neopixel3.setPixelCount(2, 220);
        await this.neopixel3.setPixelCount(3, 220);

        await NeoPixel.wait(500);

        //Turn all relays on in each controller
        for(let i = 0; i < 4; i++ ) {
            this.neopixel1.toggleRelayOn(i);    
            this.neopixel2.toggleRelayOn(i);
            this.neopixel3.toggleRelayOn(i);
        }

        //Turn all strips off
        for(let i = 0; i < 4; i++) {
            neopixelA.off(i);
            neopixelB.off(i);
            neopixelC.off(i);
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

        //===== COLUMN A =====
        //A1
        sectionMap.a1a = this.buildSection(this.neopixel1, stripA, 138, 164);
        sectionMap.a1b = this.buildSection(this.neopixel3, stripD, 192, 219);
        sectionMap.a1c = this.buildSection(this.neopixel1, stripA, 111, 137);
        sectionMap.a1d = a2b;
        
        //A2
        sectionMap.a2a = this.buildSection(this.neopixel1, stripA, 165, 192);
        sectionMap.a2b = this.buildSection(this.neopixel3, stripC, 192, 219);
        sectionMap.a2c = this.buildSection(this.neopixel1, stripA, 83, 110);
        sectionMap.a2d = a3b;
        
        //A3
        sectionMap.a3a = this.buildSection(this.neopixel1, stripA, 193, 220);
        sectionMap.a3b = this.buildSection(this.neopixel3, stripB, 192, 218);
        sectionMap.a3c = this.buildSection(this.neopixel1, stripA, 55, 82);
        sectionMap.a3d = a4b;

        //A4
        sectionMap.a4a = this.buildSection(this.neopixel1, stripA, 221, 247);
        sectionMap.a4b = this.buildSection(this.neopixel3, stripA, 192, 219);
        sectionMap.a4c = this.buildSection(this.neopixel1, stripA, 28, 54);
        sectionMap.a4d = a5b;

        //A5
        sectionMap.a5a = this.buildSection(this.neopixel1, stripA, 248, 275);
        sectionMap.a5b = this.buildSection(this.neopixel2, stripD, 192, 219);
        sectionMap.a5c = this.buildSection(this.neopixel1, stripA, 0, 27);
        sectionMap.a5d = this.buildSection(this.neopixel2, stripC, 192, 219);


        //===== COLUMN B =====
        //B1
        sectionMap.b1a = a1c;
        sectionMap.b1b = this.buildSection(this.neopixel3, stripD, 165, 191);
        sectionMap.b1c = c1a;
        sectionMap.b1d = b2b;
        
        //B2
        sectionMap.b2a = a2c;
        sectionMap.b2b = this.buildSection(this.neopixel3, stripC, 165, 191);
        sectionMap.b2c = c2a;
        sectionMap.b2d = b3b;

        //B3
        sectionMap.b3a = a3c;
        sectionMap.b3b = this.buildSection(this.neopixel3, stripB, 165, 191);
        sectionMap.b3c = c3a;
        sectionMap.b3d = b4b;

        //B4
        sectionMap.b4a = a4c;
        sectionMap.b4b = this.buildSection(this.neopixel3, stripA, 165, 191);
        sectionMap.b4c = c4a;
        sectionMap.b4d = b5b;

        //B5
        sectionMap.b5a = a5c;
        sectionMap.b5b = this.buildSection(this.neopixel2, stripD, 165, 191);
        sectionMap.b5c = c5a;
        sectionMap.b5d = this.buildSection(this.neopixel2, stripC, 165, 191);


        //===== COLUMN C =====
        //C1
        sectionMap.c1a = this.buildSection(this.neopixel1, stripB, 138, 164);
        sectionMap.c1b = this.buildSection(this.neopixel3, stripD, 137, 164);
        sectionMap.c1c = this.buildSection(this.neopixel1, stripB, 111, 137);
        sectionMap.c1d = c2b;

        //C2
        sectionMap.c2a = this.buildSection(this.neopixel1, stripB, 165, 192);
        sectionMap.c2b = this.buildSection(this.neopixel3, stripC, 137, 164);
        sectionMap.c2c = this.buildSection(this.neopixel1, stripB, 83, 110);
        sectionMap.c2d = c3b;

        //C3
        sectionMap.c3a = this.buildSection(this.neopixel1, stripB, 193, 220);
        sectionMap.c3b = this.buildSection(this.neopixel3, stripB, 137, 164);
        sectionMap.c3c = this.buildSection(this.neopixel1, stripB, 55, 82);
        sectionMap.c3d = c4b;

        //C4
        sectionMap.c4a = this.buildSection(this.neopixel1, stripB, 221, 247);
        sectionMap.c4b = this.buildSection(this.neopixel3, stripA, 137, 164);
        sectionMap.c4c = this.buildSection(this.neopixel1, stripB, 28, 54);
        sectionMap.c4d = c5b;

        //C5
        sectionMap.c5a = this.buildSection(this.neopixel1, stripB, 248, 275);
        sectionMap.c5b = this.buildSection(this.neopixel2, stripD, 137, 164);
        sectionMap.c5c = this.buildSection(this.neopixel1, stripB, 0, 27);
        sectionMap.c5d = this.buildSection(this.neopixel2, stripC, 137, 164);


        //===== COLUMN D =====
        //D1
        sectionMap.d1a = c1c;
        sectionMap.d1b = this.buildSection(this.neopixel3, stripD, 110, 136);
        sectionMap.d1c = e1a;
        sectionMap.d1d = d2b;

        //D2
        sectionMap.d2a = c2c;
        sectionMap.d2b = this.buildSection(this.neopixel3, stripC, 110, 136);
        sectionMap.d2c = e2a;
        sectionMap.d2d = d3b;

        //D3
        sectionMap.d3a = c3c
        sectionMap.d3b = this.buildSection(this.neopixel3, stripB, 110, 136);
        //sectionMap.d3c = e3a; -- Doesn't exist!
        sectionMap.d3d = d4b;

        //D4
        sectionMap.d4a = c4c;
        sectionMap.d4b = this.buildSection(this.neopixel3, stripA, 110, 136);
        sectionMap.d4c = d4a;
        sectionMap.d4d = d5b;

        //D5
        sectionMap.d5a = c5c;
        sectionMap.d5b = this.buildSection(this.neopixel2, stripD, 110, 136);
        sectionMap.d5c = d5a;
        sectionMap.d5d = this.buildSection(this.neopixel2, stripC, 110, 136);


        //===== COLUMN E =====
        //E1
        sectionMap.e1a = this.buildSection(this.neopixel1, stripC, 82, 108);
        sectionMap.e1b = this.buildSection(this.neopixel3, stripD, 82, 109);
        sectionMap.e1c = this.buildSection(this.neopixel1, stripC, 109, 135);
        sectionMap.e1d = e2b;
        
        //E2
        sectionMap.e2a = this.buildSection(this.neopixel1, stripC, 55, 81);
        sectionMap.e2b = this.buildSection(this.neopixel3, stripC, 82, 109);
        sectionMap.e2c = this.buildSection(this.neopixel1, stripC, 136, 163);
        sectionMap.e2c = e3b;
        
        //E3
        //sectionMap.e3a -- Doesn't exist!
        sectionMap.e3b = this.buildSection(this.neopixel3, stripB, 82, 109);
        sectionMap.e3c = this.buildSection(this.neopixel1, stripC, 164, 191);
        sectionMap.e3d = e4b;
        
        //E4
        sectionMap.e4a = this.buildSection(this.neopixel1, stripC, 28, 54);
        sectionMap.e4b = this.buildSection(this.neopixel3, stripA, 82, 109);
        sectionMap.e4c = this.buildSection(this.neopixel1, stripC, 192, 218);
        sectionMap.e4d = e5b;
        
        //E5
        sectionMap.e5a = this.buildSection(this.neopixel1, stripC, 0, 27);
        sectionMap.e5b = this.buildSection(this.neopixel2, stripD, 82, 109);
        sectionMap.e5c = this.buildSection(this.neopixel1, stripC, 219, 246);
        sectionMap.e5d = this.buildSection(this.neopixel2, stripC, 82, 109);


        //===== COLUMN F =====
        //F1
        sectionMap.f1a = e1c;
        sectionMap.f1b = this.buildSection(this.neopixel3, stripD, 54, 81);
        sectionMap.f1c = g1a;
        sectionMap.f1d = f2b;

        //F2
        sectionMap.f2a = e2c;
        sectionMap.f2b = this.buildSection(this.neopixel3, stripC, 54, 81);
        sectionMap.f2c = g2a;
        sectionMap.f2d = f3b;

        //F3
        sectionMap.f3a = e3c;
        sectionMap.f3b = this.buildSection(this.neopixel3, stripB, 54, 81);
        sectionMap.f3c = g3a;
        sectionMap.f3d = f4b;

        //F4
        sectionMap.f4a = e4c;
        sectionMap.f4b = this.buildSection(this.neopixel3, stripA, 54, 81);
        sectionMap.f4c = g4a;
        sectionMap.f4d = f5b;

        //F5
        sectionMap.f5a = e5c;
        sectionMap.f5b = this.buildSection(this.neopixel2, stripD, 54, 81);
        sectionMap.f5c = g5a;
        sectionMap.f5d = this.buildSection(this.neopixel2, stripC, 54, 81);


        //===== COLUMN G =====
        //G1
        sectionMap.g1a = this.buildSection(this.neopixel2, stripA, 138, 164);
        sectionMap.g1b = this.buildSection(this.neopixel3, stripD, 27, 53);
        sectionMap.g1c = this.buildSection(this.neopixel2, stripA, 111, 137);
        sectionMap.g1d = g2b;

        //G2
        sectionMap.g2a = this.buildSection(this.neopixel2, stripA, 165, 192);
        sectionMap.g2b = this.buildSection(this.neopixel3, stripC, 27, 53);
        sectionMap.g2c = this.buildSection(this.neopixel2, stripA, 83, 110);
        sectionMap.g2d = g3b;

        //G3
        sectionMap.g3a = this.buildSection(this.neopixel2, stripA, 193, 220);
        sectionMap.g3b = this.buildSection(this.neopixel3, stripB, 27, 53);
        sectionMap.g3c = this.buildSection(this.neopixel2, stripA, 55, 82);
        sectionMap.g3d = g4b;

        //G4
        sectionMap.g4a = this.buildSection(this.neopixel2, stripA, 221, 247);
        sectionMap.g4b = this.buildSection(this.neopixel3, stripA, 27, 53);
        sectionMap.g4c = this.buildSection(this.neopixel2, stripA, 28, 54);
        sectionMap.g4d = g5b;

        //G5
        sectionMap.g5a = this.buildSection(this.neopixel2, stripA, 248, 275);
        sectionMap.g5b = this.buildSection(this.neopixel2, stripD, 27, 53);
        sectionMap.g5c = this.buildSection(this.neopixel2, stripA, 0, 27);
        sectionMap.g5d = this.buildSection(this.neopixel2, stripC, 27, 53);


        //===== COLUMN H =====
        //H1
        sectionMap.h1a = g1c;
        sectionMap.h1b = this.buildSection(this.neopixel3, stripD, 0, 26);
        sectionMap.h1c = this.buildSection(this.neopixel2, stripB, 0, 0);
        sectionMap.h1d = h2b;

        //H2
        sectionMap.h2a = g2c;
        sectionMap.h2b = this.buildSection(this.neopixel3, stripC, 0, 26);
        sectionMap.h2c = this.buildSection(this.neopixel2, stripB, 0, 0);
        sectionMap.h2d = h3b;

        //H3
        sectionMap.h3a = g3c;
        sectionMap.h3b = this.buildSection(this.neopixel3, stripB, 0, 26);
        sectionMap.h3c = this.buildSection(this.neopixel2, stripB, 55, 82);
        sectionMap.h3d = h4b;

        //H4
        sectionMap.h4a = g4c;
        sectionMap.h4b = this.buildSection(this.neopixel3, stripA, 0, 26);
        sectionMap.h4c = this.buildSection(this.neopixel2, stripB, 83, 110);
        sectionMap.h4d = h5b;

        //H5
        sectionMap.h5a = g5c;
        sectionMap.h5b = this.buildSection(this.neopixel2, stripD, 0, 26);
        sectionMap.h5c = this.buildSection(this.neopixel2, stripB, 111, 137);
        sectionMap.h5d = this.buildSection(this.neopixel2, stripC, 0, 26);

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