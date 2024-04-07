const NeoPixel = require('./NeoPixel');

const SERVER1 = 'tcp://172.16.56.31:800'
const SERVER2 = 'tcp://172.16.56.32:800'
const SERVER3 = 'tcp://172.16.56.33:800'

const stripA = "0";
const stripB = "1";
const stripC = "2";
const stripD = "3";

class PixelMap {
    sections = {};
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
        console.log("turning strips off");
        for(let i = 0; i < 4; i++) {
            this.neopixel1.off(i);
            this.neopixel2.off(i);
            this.neopixel3.off(i);
        }
    }

    getPixelMap() {
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

    initializeSections() {
        var sectionMap = {};

        //===== COLUMN A =====
        //A1
        sectionMap.a1a = this.buildSection(this.neopixel1, stripA, 138, 164);
        sectionMap.a1b = this.buildSection(this.neopixel3, stripD, 192, 219);
        sectionMap.a1c = this.buildSection(this.neopixel1, stripA, 111, 137);
        sectionMap.a1d = this.buildSection(this.neopixel3, stripC, 192, 219);
        
        //A2
        sectionMap.a2a = this.buildSection(this.neopixel1, stripA, 165, 192);
        sectionMap.a2b = sectionMap.a1d;
        sectionMap.a2c = this.buildSection(this.neopixel1, stripA, 83, 110);
        sectionMap.a2d = this.buildSection(this.neopixel3, stripB, 192, 218);
        
        //A3
        sectionMap.a3a = this.buildSection(this.neopixel1, stripA, 193, 220);
        sectionMap.a3b = sectionMap.a2d;
        sectionMap.a3c = this.buildSection(this.neopixel1, stripA, 55, 82);
        sectionMap.a3d = this.buildSection(this.neopixel3, stripA, 192, 219);

        //A4
        sectionMap.a4a = this.buildSection(this.neopixel1, stripA, 221, 247);
        sectionMap.a4b = sectionMap.a3d;
        sectionMap.a4c = this.buildSection(this.neopixel1, stripA, 28, 54);
        sectionMap.a4d = this.buildSection(this.neopixel2, stripD, 192, 219);

        //A5
        sectionMap.a5a = this.buildSection(this.neopixel1, stripA, 248, 275);
        sectionMap.a5b = sectionMap.a4d;
        sectionMap.a5c = this.buildSection(this.neopixel1, stripA, 0, 27);
        sectionMap.a5d = this.buildSection(this.neopixel2, stripC, 192, 219);


        //===== COLUMN B =====
        //B1
        sectionMap.b1a = sectionMap.a1c;
        sectionMap.b1b = this.buildSection(this.neopixel3, stripD, 165, 191);
        sectionMap.b1c = this.buildSection(this.neopixel1, stripB, 138, 164);
        sectionMap.b1d = this.buildSection(this.neopixel3, stripC, 165, 191);
        
        //B2
        sectionMap.b2a = sectionMap.a2c;
        sectionMap.b2b = sectionMap.b1d;
        sectionMap.b2c = this.buildSection(this.neopixel1, stripB, 165, 192);
        sectionMap.b2d = this.buildSection(this.neopixel3, stripB, 165, 191);

        //B3
        sectionMap.b3a = sectionMap.a3c;
        sectionMap.b3b = sectionMap.b2d;
        sectionMap.b3c = this.buildSection(this.neopixel1, stripB, 193, 220);
        sectionMap.b3d = this.buildSection(this.neopixel3, stripA, 165, 191);

        //B4
        sectionMap.b4a = sectionMap.a4c;
        sectionMap.b4b = sectionMap.b3d;
        sectionMap.b4c = this.buildSection(this.neopixel1, stripB, 221, 247);
        sectionMap.b4d = this.buildSection(this.neopixel2, stripD, 165, 191);

        //B5
        sectionMap.b5a = sectionMap.a5c;
        sectionMap.b5b = sectionMap.b4d;
        sectionMap.b5c = this.buildSection(this.neopixel1, stripB, 248, 275);
        sectionMap.b5d = this.buildSection(this.neopixel2, stripC, 165, 191);


        //===== COLUMN C =====
        //C1
        sectionMap.c1a = sectionMap.b1c;
        sectionMap.c1b = this.buildSection(this.neopixel3, stripD, 137, 164);
        sectionMap.c1c = this.buildSection(this.neopixel1, stripB, 111, 137);
        sectionMap.c1d = this.buildSection(this.neopixel3, stripC, 137, 164);

        //C2
        sectionMap.c2a = sectionMap.b2c;
        sectionMap.c2b = sectionMap.c1d;
        sectionMap.c2c = this.buildSection(this.neopixel1, stripB, 83, 110);
        sectionMap.c2d = this.buildSection(this.neopixel3, stripB, 137, 164);

        //C3
        sectionMap.c3a = sectionMap.b3c;
        sectionMap.c3b = sectionMap.c2d;
        sectionMap.c3c = this.buildSection(this.neopixel1, stripB, 55, 82);
        sectionMap.c3d = this.buildSection(this.neopixel3, stripA, 137, 164);

        //C4
        sectionMap.c4a = sectionMap.b4c;
        sectionMap.c4b = sectionMap.c3d;
        sectionMap.c4c = this.buildSection(this.neopixel1, stripB, 28, 54);
        sectionMap.c4d = this.buildSection(this.neopixel2, stripD, 137, 164);

        //C5
        sectionMap.c5a = sectionMap.b5c;
        sectionMap.c5b = sectionMap.c4d;
        sectionMap.c5c = this.buildSection(this.neopixel1, stripB, 0, 27);
        sectionMap.c5d = this.buildSection(this.neopixel2, stripC, 137, 164);


        //===== COLUMN D =====
        //D1
        sectionMap.d1a = sectionMap.c1c;
        sectionMap.d1b = this.buildSection(this.neopixel3, stripD, 110, 136);
        sectionMap.d1c = this.buildSection(this.neopixel1, stripC, 82, 108);
        sectionMap.d1d = this.buildSection(this.neopixel3, stripC, 110, 136);

        //D2
        sectionMap.d2a = sectionMap.c2c;
        sectionMap.d2b = sectionMap.d1d;
        sectionMap.d2c = this.buildSection(this.neopixel1, stripC, 55, 81);
        sectionMap.d2d = this.buildSection(this.neopixel3, stripB, 110, 136);

        //D3
        sectionMap.d3a = sectionMap.c3c
        sectionMap.d3b = sectionMap.d2d;
        sectionMap.d3c = {controller: {setPixels: () => {}}, strip: "0", pixels: []};
        sectionMap.d3d = this.buildSection(this.neopixel3, stripA, 110, 136);

        //D4
        sectionMap.d4a = sectionMap.c4c;
        sectionMap.d4b = sectionMap.d3d;
        sectionMap.d4c = this.buildSection(this.neopixel1, stripC, 28, 54);
        sectionMap.d4d = this.buildSection(this.neopixel2, stripD, 110, 136);

        //D5
        sectionMap.d5a = sectionMap.c5c;
        sectionMap.d5b = sectionMap.d4d;
        sectionMap.d5c = this.buildSection(this.neopixel1, stripC, 0, 27);
        sectionMap.d5d = this.buildSection(this.neopixel2, stripC, 110, 136);


        //===== COLUMN E =====
        //E1
        sectionMap.e1a = sectionMap.d1c;
        sectionMap.e1b = this.buildSection(this.neopixel3, stripD, 82, 109);
        sectionMap.e1c = this.buildSection(this.neopixel1, stripC, 109, 135);
        sectionMap.e1d = this.buildSection(this.neopixel3, stripC, 82, 109);
        
        //E2
        sectionMap.e2a = sectionMap.d2c;
        sectionMap.e2b = sectionMap.e1d;
        sectionMap.e2c = this.buildSection(this.neopixel1, stripC, 136, 163);
        sectionMap.e2d = this.buildSection(this.neopixel3, stripB, 82, 109);
        
        //E3
        sectionMap.e3a = {controller: {setPixels: () => {}}, strip: "0", pixels: []};
        sectionMap.e3b = sectionMap.e2d;
        sectionMap.e3c = this.buildSection(this.neopixel1, stripC, 164, 191);
        sectionMap.e3d = this.buildSection(this.neopixel3, stripA, 82, 109);
        
        //E4
        sectionMap.e4a = sectionMap.d4c;
        sectionMap.e4b = sectionMap.e3d;
        sectionMap.e4c = this.buildSection(this.neopixel1, stripC, 192, 218);
        sectionMap.e4d = this.buildSection(this.neopixel2, stripD, 82, 109);
        
        //E5
        sectionMap.e5a = sectionMap.d5c;
        sectionMap.e5b = sectionMap.e4d;
        sectionMap.e5c = this.buildSection(this.neopixel1, stripC, 219, 246);
        sectionMap.e5d = this.buildSection(this.neopixel2, stripC, 82, 109);


        //===== COLUMN F =====
        //F1
        sectionMap.f1a = sectionMap.e1c;
        sectionMap.f1b = this.buildSection(this.neopixel3, stripD, 54, 81);
        sectionMap.f1c = this.buildSection(this.neopixel2, stripA, 138, 164);
        sectionMap.f1d = this.buildSection(this.neopixel3, stripC, 54, 81);

        //F2
        sectionMap.f2a = sectionMap.e2c;
        sectionMap.f2b = sectionMap.f1d;
        sectionMap.f2c = this.buildSection(this.neopixel2, stripA, 165, 192);
        sectionMap.f2d = this.buildSection(this.neopixel3, stripB, 54, 81);

        //F3
        sectionMap.f3a = sectionMap.e3c;
        sectionMap.f3b = sectionMap.f2d;
        sectionMap.f3c = this.buildSection(this.neopixel2, stripA, 193, 220);
        sectionMap.f3d = this.buildSection(this.neopixel3, stripA, 54, 81);

        //F4
        sectionMap.f4a = sectionMap.e4c;
        sectionMap.f4b = sectionMap.f3d;
        sectionMap.f4c = this.buildSection(this.neopixel2, stripA, 221, 247);
        sectionMap.f4d = this.buildSection(this.neopixel2, stripD, 54, 81);

        //F5
        sectionMap.f5a = sectionMap.e5c;
        sectionMap.f5b = sectionMap.f4d;
        sectionMap.f5c = this.buildSection(this.neopixel2, stripA, 248, 275);
        sectionMap.f5d = this.buildSection(this.neopixel2, stripC, 54, 81);


        //===== COLUMN G =====
        //G1
        sectionMap.g1a = sectionMap.f1c;
        sectionMap.g1b = this.buildSection(this.neopixel3, stripD, 27, 53);
        sectionMap.g1c = this.buildSection(this.neopixel2, stripA, 111, 137);
        sectionMap.g1d = this.buildSection(this.neopixel3, stripC, 27, 53);

        //G2
        sectionMap.g2a = sectionMap.f2c;
        sectionMap.g2b = sectionMap.g1d;
        sectionMap.g2c = this.buildSection(this.neopixel2, stripA, 83, 110);
        sectionMap.g2d = this.buildSection(this.neopixel3, stripB, 27, 53);

        //G3
        sectionMap.g3a = sectionMap.f3c;
        sectionMap.g3b = sectionMap.g2d;
        sectionMap.g3c = this.buildSection(this.neopixel2, stripA, 55, 82);
        sectionMap.g3d = this.buildSection(this.neopixel3, stripA, 27, 53);

        //G4
        sectionMap.g4a = sectionMap.f4c;
        sectionMap.g4b = sectionMap.g3d;
        sectionMap.g4c = this.buildSection(this.neopixel2, stripA, 28, 54);
        sectionMap.g4d = this.buildSection(this.neopixel2, stripD, 27, 53);

        //G5
        sectionMap.g5a = sectionMap.f5c;
        sectionMap.g5b = sectionMap.g4d;
        sectionMap.g5c = this.buildSection(this.neopixel2, stripA, 0, 27);
        sectionMap.g5d = this.buildSection(this.neopixel2, stripC, 27, 53);


        //===== COLUMN H =====
        //H1
        sectionMap.h1a = sectionMap.g1c;
        sectionMap.h1b = this.buildSection(this.neopixel3, stripD, 0, 26);
        sectionMap.h1c = this.buildSection(this.neopixel2, stripB, 111, 137);
        sectionMap.h1d = this.buildSection(this.neopixel3, stripC, 0, 26);

        //H2
        sectionMap.h2a = sectionMap.g2c;
        sectionMap.h2b = sectionMap.h1d;
        sectionMap.h2c = this.buildSection(this.neopixel2, stripB, 83, 110);
        sectionMap.h2d = this.buildSection(this.neopixel3, stripB, 0, 26);

        //H3
        sectionMap.h3a = sectionMap.g3c;
        sectionMap.h3b = sectionMap.h2d;
        sectionMap.h3c = this.buildSection(this.neopixel2, stripB, 55, 82);
        sectionMap.h3d = this.buildSection(this.neopixel3, stripA, 0, 26);

        //H4
        sectionMap.h4a = sectionMap.g4c;
        sectionMap.h4b = sectionMap.h3d;
        sectionMap.h4c = this.buildSection(this.neopixel2, stripB, 28, 54);
        sectionMap.h4d = this.buildSection(this.neopixel2, stripD, 0, 26);

        //H5
        sectionMap.h5a = sectionMap.g5c;
        sectionMap.h5b = sectionMap.h4d;
        sectionMap.h5c = this.buildSection(this.neopixel2, stripB, 0, 27);
        sectionMap.h5d = this.buildSection(this.neopixel2, stripC, 0, 26);

        return sectionMap;
    }

    buildA() {
        return {
            1: {A: this.sections.a1a, B: this.sections.a1b, C: this.sections.a1c, D: this.sections.a1d},
            2: {A: this.sections.a2a, B: this.sections.a2b, C: this.sections.a2c, D: this.sections.a2d},
            3: {A: this.sections.a3a, B: this.sections.a3b, C: this.sections.a3c, D: this.sections.a3d},
            4: {A: this.sections.a4a, B: this.sections.a4b, C: this.sections.a4c, D: this.sections.a4d},
            5: {A: this.sections.a5a, B: this.sections.a5b, C: this.sections.a5c, D: this.sections.a5d}
        };
    }

    buildB() {
        return {
            1: {A: this.sections.b1a, B: this.sections.b1b, C: this.sections.b1c, D: this.sections.b1d},
            2: {A: this.sections.b2a, B: this.sections.b2b, C: this.sections.b2c, D: this.sections.b2d},
            3: {A: this.sections.b3a, B: this.sections.b3b, C: this.sections.b3c, D: this.sections.b3d},
            4: {A: this.sections.b4a, B: this.sections.b4b, C: this.sections.b4c, D: this.sections.b4d},
            5: {A: this.sections.b5a, B: this.sections.b5b, C: this.sections.b5c, D: this.sections.b5d}
        };
    }

    buildC() {
        return {
            1: {A: this.sections.c1a, B: this.sections.c1b, C: this.sections.c1c, D: this.sections.c1d},
            2: {A: this.sections.c2a, B: this.sections.c2b, C: this.sections.c2c, D: this.sections.c2d},
            3: {A: this.sections.c3a, B: this.sections.c3b, C: this.sections.c3c, D: this.sections.c3d},
            4: {A: this.sections.c4a, B: this.sections.c4b, C: this.sections.c4c, D: this.sections.c4d},
            5: {A: this.sections.c5a, B: this.sections.c5b, C: this.sections.c5c, D: this.sections.c5d}
        };
    }

    buildD() {
        return {
            1: {A: this.sections.d1a, B: this.sections.d1b, C: this.sections.d1c, D: this.sections.d1d},
            2: {A: this.sections.d2a, B: this.sections.d2b, C: this.sections.d2c, D: this.sections.d2d},
            3: {A: this.sections.d3a, B: this.sections.d3b, C: this.sections.d3c, D: this.sections.d3d},
            4: {A: this.sections.d4a, B: this.sections.d4b, C: this.sections.d4c, D: this.sections.d4d},
            5: {A: this.sections.d5a, B: this.sections.d5b, C: this.sections.d5c, D: this.sections.d5d}
        };
    }

    buildE() {
        return {
            1: {A: this.sections.e1a, B: this.sections.e1b, C: this.sections.e1c, D: this.sections.e1d},
            2: {A: this.sections.e2a, B: this.sections.e2b, C: this.sections.e2c, D: this.sections.e2d},
            3: {A: this.sections.e3a, B: this.sections.e3b, C: this.sections.e3c, D: this.sections.e3d},
            4: {A: this.sections.e4a, B: this.sections.e4b, C: this.sections.e4c, D: this.sections.e4d},
            5: {A: this.sections.e5a, B: this.sections.e5b, C: this.sections.e5c, D: this.sections.e5d}
        };
    }
    
    buildF() {
        return {
            1: {A: this.sections.f1a, B: this.sections.f1b, C: this.sections.f1c, D: this.sections.f1d},
            2: {A: this.sections.f2a, B: this.sections.f2b, C: this.sections.f2c, D: this.sections.f2d},
            3: {A: this.sections.f3a, B: this.sections.f3b, C: this.sections.f3c, D: this.sections.f3d},
            4: {A: this.sections.f4a, B: this.sections.f4b, C: this.sections.f4c, D: this.sections.f4d},
            5: {A: this.sections.f5a, B: this.sections.f5b, C: this.sections.f5c, D: this.sections.f5d}
        };
    }
    
    buildG() {
        return {
            1: {A: this.sections.g1a, B: this.sections.g1b, C: this.sections.g1c, D: this.sections.g1d},
            2: {A: this.sections.g2a, B: this.sections.g2b, C: this.sections.g2c, D: this.sections.g2d},
            3: {A: this.sections.g3a, B: this.sections.g3b, C: this.sections.g3c, D: this.sections.g3d},
            4: {A: this.sections.g4a, B: this.sections.g4b, C: this.sections.g4c, D: this.sections.g4d},
            5: {A: this.sections.g5a, B: this.sections.g5b, C: this.sections.g5c, D: this.sections.g5d}
        };
    }
    
    buildH() {
        return {
            1: {A: this.sections.h1a, B: this.sections.h1b, C: this.sections.h1c, D: this.sections.h1d},
            2: {A: this.sections.h2a, B: this.sections.h2b, C: this.sections.h2c, D: this.sections.h2d},
            3: {A: this.sections.h3a, B: this.sections.h3b, C: this.sections.h3c, D: this.sections.h3d},
            4: {A: this.sections.h4a, B: this.sections.h4b, C: this.sections.h4c, D: this.sections.h4d},
            5: {A: this.sections.h5a, B: this.sections.h5b, C: this.sections.h5c, D: this.sections.h5d}
        };
    }

    buildSection(controller, strip, pixelMin, pixelMax){
        var pixels = [];

        for (var i = pixelMin; i <= pixelMax; i++){
            pixels.push(i);
        }

        return {controller, strip, pixels};
    }
}

module.exports = PixelMap;