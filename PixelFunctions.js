const NeoPixel = require('./NeoPixel');
const PixelMap = require('./PixelMap');

const refreshSpeed = 50;

class PixelFunctions {

    constructor () {
        this.pixelMap = new PixelMap();
    }
    
    async lightSections(sections, color, reset) {
        var map = this.pixelMap.getPixelMap();
        var controllerMap = {};

       sections.forEach((section) => {
            var mappedSection = map[section[0]][section[1]][section[2]];
            var controllerName = mappedSection.controller.getName();
            
            if (!controllerMap[controllerName]) {
                controllerMap[controllerName] = {};
                controllerMap[controllerName].pixelSet = [];
                controllerMap[controllerName].controller = mappedSection.controller;
            }
            
            mappedSection.pixels.forEach((pixel) => {
                controllerMap[controllerName].pixelSet.push({
                    s: mappedSection.strip, 
                    p: pixel, 
                    r: Math.round(color.r * color.brightness), 
                    g: Math.round(color.g * color.brightness), 
                    b: Math.round(color.b * color.brightness)});
            });
        });

        for (const [key, value] of Object.entries(controllerMap)) {
            this.sendPixelValues(value.controller, value.pixelSet, reset);
        }
    }

    async sendPixelValues(controller, pixelSet, reset) {
        controller.setPixels(pixelSet, reset);
    }

    async sendFill(controller, strip, color) {
        controller.fill(strip, color);
    }

    async fadeSections(sections, colorStart, colorFinish, fadeTime, reset) {
        const frames = fadeTime / refreshSpeed;
        const brightnessIncrement = (colorFinish.brightness - colorStart.brightness) / frames;
        const rIncrement = (colorFinish.r - colorStart.r) / frames;
        const gIncrement = (colorFinish.g - colorStart.g) / frames;
        const bIncrement = (colorFinish.b - colorStart.b) / frames;

        var currentColor = colorStart;

        //Manually set brightness start
        await this.lightSections(sections, currentColor, reset);
        await NeoPixel.wait(refreshSpeed);

        for (var i = 1; i < frames - 1; i++) {
            currentColor.brightness = currentColor.brightness + brightnessIncrement;
            currentColor.r = currentColor.r + rIncrement;
            currentColor.g = currentColor.g + gIncrement;
            currentColor.b = currentColor.b + bIncrement; 

            await this.lightSections(sections, currentColor, reset);
            await NeoPixel.wait(refreshSpeed);
        }

        //Manually set brightness finish
        await this.lightSections(sections, colorFinish, reset);
    }

    async fillSections(color) {
        var controllers = this.pixelMap.getControllers();
        var strips = this.pixelMap.getStrips();

        var stripColor = {
            r: Math.round(color.r * color.brightness), 
            g: Math.round(color.g * color.brightness), 
            b: Math.round(color.b * color.brightness)
        }

        controllers.forEach((controller) => {
            strips.forEach((strip) => {
                this.sendFill(controller, strip, stripColor);
            });
        })
    }

    async fadeFill(colorStart, colorFinish, fadeTime) {
        const frames = fadeTime / refreshSpeed;
        const brightnessIncrement = (colorFinish.brightness - colorStart.brightness) / frames;
        const rIncrement = (colorFinish.r - colorStart.r) / frames;
        const gIncrement = (colorFinish.g - colorStart.g) / frames;
        const bIncrement = (colorFinish.b - colorStart.b) / frames;

        var currentColor = colorStart;

        //Manually set brightness start
        await this.fillSections(currentColor);
        await NeoPixel.wait(refreshSpeed);

        for (var i = 1; i < frames - 1; i++) {
            currentColor.brightness = currentColor.brightness + brightnessIncrement;
            currentColor.r = currentColor.r + rIncrement;
            currentColor.g = currentColor.g + gIncrement;
            currentColor.b = currentColor.b + bIncrement; 

            await this.fillSections(currentColor);
            await NeoPixel.wait(refreshSpeed);
        }

        //Manually set brightness finish
        await this.fillSections(colorFinish);
    }

    async confetti() {
        const map = this.pixelMap.getPixelMap();

        var E2Route1 = [];
        var E2Route2 = [];
        var E3Route1 = [];
        var E3Route2 = [];
        var E4Route1 = [];
        var E4Route2 = [];

        E2Route1.push({pixelSet: map.A[1].D, invert: true});
        E2Route1.push({pixelSet: map.B[1].D, invert: true});
        E2Route1.push({pixelSet: map.C[1].D, invert: true});
        E2Route1.push({pixelSet: map.C[1].C, invert: false});

        E2Route2.push({pixelSet: map.A[2].D, invert: true});
        E2Route2.push({pixelSet: map.A[3].C, invert: true});
        E2Route2.push({pixelSet: map.B[3].D, invert: true});
        E2Route2.push({pixelSet: map.B[4].C, invert: false});

        E3Route1.push({pixelSet: map.H[1].B, invert: false});
        E3Route1.push({pixelSet: map.G[1].B, invert: false});
        E3Route1.push({pixelSet: map.G[1].A, invert: false});
        E3Route1.push({pixelSet: map.F[1].D, invert: false});

        E3Route2.push({pixelSet: map.H[1].D, invert: false});
        E3Route2.push({pixelSet: map.H[2].A, invert: true});
        E3Route2.push({pixelSet: map.G[2].D, invert: false});
        E3Route2.push({pixelSet: map.F[2].D, invert: false});
        
        E4Route1.push({pixelSet: map.H[5].D, invert: false});
        E4Route1.push({pixelSet: map.G[5].C, invert: false});
        E4Route1.push({pixelSet: map.G[4].C, invert: false});
        E4Route1.push({pixelSet: map.G[3].C, invert: false});

        E4Route2.push({pixelSet: map.H[5].B, invert: false});
        E4Route2.push({pixelSet: map.H[4].A, invert: false});
        E4Route2.push({pixelSet: map.G[4].B, invert: false});
        E4Route2.push({pixelSet: map.F[4].B, invert: false});

        //set 2
        var E2Route3 = [
            {pixelSet: map.A[1].D, invert: false},
            {pixelSet: map.B[1].D, invert: false},
            {pixelSet: map.B[2].C, invert: false},
            {pixelSet: map.B[3].C, invert: false}
        ];

        var E2Route4 = [
            {pixelSet: map.A[2].D, invert: false},
            {pixelSet: map.B[2].D, invert: true},
            {pixelSet: map.C[2].D, invert: true},
            {pixelSet: map.C[2].C, invert: false}
        ];

        var E2Route5 = [
            {pixelSet: map.A[3].D, invert: true},
            {pixelSet: map.B[3].D, invert: false},
            {pixelSet: map.C[3].D, invert: true},
            {pixelSet: map.C[4].C, invert: true}
        ];

        var E3Route3 = [
            {pixelSet: map.H[1].C, invert: true},
            {pixelSet: map.H[2].C, invert: true},
            {pixelSet: map.H[3].C, invert: true},
            {pixelSet: map.H[3].D, invert: false}
        ];

        var E3Route4 = [
            {pixelSet: map.H[1].B, invert: false},
            {pixelSet: map.G[1].B, invert: false},
            {pixelSet: map.G[1].A, invert: true},
            {pixelSet: map.G[2].A, invert: false}
        ];

        var E4Route3 = [
            {pixelSet: map.H[4].D, invert: false},
            {pixelSet: map.G[4].D, invert: false},
            {pixelSet: map.F[4].D, invert: false},
            {pixelSet: map.F[5].A, invert: false}
        ];

        var E4Route4 = [
            {pixelSet: map.H[5].D, invert: false},
            {pixelSet: map.G[5].D, invert: false},
            {pixelSet: map.G[5].A, invert: true},
            {pixelSet: map.G[4].A, invert: true}
        ];

        //set 3
        var E2Route6 = [
            {pixelSet: map.A[1].A, invert: true},
            {pixelSet: map.A[2].A, invert: true},
            {pixelSet: map.A[3].A, invert: true},
            {pixelSet: map.A[3].D, invert: true}
        ];

        var E2Route7 = [
            {pixelSet: map.A[3].D, invert: true},
            {pixelSet: map.B[3].A, invert: false},
            {pixelSet: map.B[2].A, invert: false},
            {pixelSet: map.B[2].B, invert: true}
        ];

        var E3Route5 = [
            {pixelSet: map.H[1].D, invert: false},
            {pixelSet: map.G[1].D, invert: false},
            {pixelSet: map.G[1].A, invert: true},
            {pixelSet: map.G[2].A, invert: true}
        ];

        var E3Route6 = [
            {pixelSet: map.H[2].D, invert: false},
            {pixelSet: map.H[3].A, invert: true},
            {pixelSet: map.F[3].D, invert: false},
            {pixelSet: map.F[3].A, invert: false}
        ];

        var E4Route5 = [
            {pixelSet: map.H[5].D, invert: false},
            {pixelSet: map.G[5].D, invert: false},
            {pixelSet: map.F[5].D, invert: false},
            {pixelSet: map.F[5].A, invert: false}
        ];

        var E4Route6 = [
            {pixelSet: map.H[5].B, invert: false},
            {pixelSet: map.G[5].B, invert: false},
            {pixelSet: map.F[5].B, invert: false}
        ];

        var E4Route7 = [
            {pixelSet: map.H[4].B, invert: false},
            {pixelSet: map.G[4].B, invert: false},
            {pixelSet: map.F[4].B, invert: false}
        ]

        var routeSet = [
            {route: E2Route1, color: {r: 255, g: 0, b: 0, brightness: 1}, start: 0},
            {route: E2Route2, color: {r: 0, g: 255, b: 0, brightness: 1}, start: 0},
            {route: E3Route1, color: {r: 255, g: 0, b: 0, brightness: 1}, start: 0},
            {route: E3Route2, color: {r: 168, g: 100, b: 253, brightness: 1}, start: 0},
            {route: E4Route1, color: {r: 255, g: 80, b: 90, brightness: 1}, start: 0},
            {route: E4Route2, color: {r: 120, g: 255, b: 68, brightness: 1}, start: 0},

            //second set
            {route: E2Route3, color: {r: 255, g: 153, b: 0, brightness: 1}, start: 2},
            {route: E2Route4, color: {r: 255, g: 0, b: 255, brightness: 1}, start: 2},
            {route: E2Route5, color: {r: 0, g: 255, b: 255, brightness: 1}, start: 2},
            {route: E3Route3, color: {r: 255, g: 255, b: 255, brightness: 1}, start: 2},
            {route: E3Route4, color: {r: 0, g: 0, b: 255, brightness: 1}, start: 2},
            {route: E4Route3, color: {r: 168, g: 100, b: 0, brightness: 1}, start: 2},
            {route: E4Route4, color: {r: 255, g: 0, b: 0, brightness: 1}, start: 2},

            //third set
            {route: E2Route6, color: {r: 255, g: 80, b: 90, brightness: 1}, start: 3},
            {route: E2Route7, color: {r: 0, g: 255, b: 0, brightness: 1}, start: 3},
            {route: E3Route5, color: {r: 0, g: 0, b: 255, brightness: 1}, start: 3},
            {route: E3Route6, color: {r:255, g: 65, b: 0, brightness: 1}, start: 3},
            {route: E4Route5, color: {r:255, g: 30, b: 255, brightness: 1}, start: 3},
            {route: E4Route6, color: {r: 0, g: 255, b: 255, brightness: 1}, start: 3},
            {route: E4Route7, color: {r: 255, g: 255, b: 255, brightness: 1}, start: 3}
        ];

        
        this.runRouteFrames(this.calculateRouteFrames(routeSet, true));
    }

    async runRouteFrames(frameArray){
        for (var i = 0; i < frameArray.length; i++) {
            for (const [key, value] of Object.entries(frameArray[i])) {
                this.sendPixelValues(value.controller, value.pixelSet, false);
            }
            await NeoPixel.wait(10);
        }
        this.pixelMap.getControllers().forEach((controller) => {
            for (var i = 0; i < 4; i++){
                this.sendFill(controller, i, {r: 0, g: 0, b: 0});
            }
        });
    }

    calculateRouteFrames(routeSet, reset) {
        var routeFrames = [];
        var largestStartValue = 0;
        routeSet.forEach((value) => {
            value.route.forEach((route) => {
                if (route.invert) {
                    route.pixelSet.pixels = route.pixelSet.pixels.reverse();
                }
            });

            largestStartValue = value.start > largestStartValue ? value.start : largestStartValue;
        });

        var largestRouteSize = 0;
        routeSet.forEach((value) => {
            if (value.start === largestStartValue) {
                largestRouteSize = value.route.length > largestRouteSize ? value.route.length : largestRouteSize;
            }
        });

        largestRouteSize += largestStartValue;

        for (var j = 0; j < largestRouteSize; j++) {
            for (var i = 0; i < 40; i++){
                var controllerMap = {};
                var newPixels = false;
                routeSet.forEach((value) => {

                    if ((j - value.start) < value.route.length && j >= value.start) {
                        var route = value.route[j - value.start];
                        var controllerName = route.pixelSet.controller.getName();

                        if (!controllerMap[controllerName]) {
                            controllerMap[controllerName] = {};
                            controllerMap[controllerName].pixelSet = [];
                            controllerMap[controllerName].controller = route.pixelSet.controller;
                        }

                        if (i < route.pixelSet.pixels.length) {
                            newPixels = true;

                            controllerMap[controllerName].pixelSet.push({
                                s: route.pixelSet.strip,
                                p: route.pixelSet.pixels[i],
                                r: Math.round(value.color.r * value.color.brightness), 
                                g: Math.round(value.color.g * value.color.brightness), 
                                b: Math.round(value.color.b * value.color.brightness)
                            });

                            if (i > 0 && reset) {
                                controllerMap[controllerName].pixelSet.push({
                                    s: route.pixelSet.strip,
                                    p: route.pixelSet.pixels[i-1],
                                    r: 0,
                                    g: 0,
                                    b: 0
                                });
                            }

                            if (i === 0 && j > 0 && reset && j !== value.start) {
                                var prevController = value.route[j - value.start - 1].pixelSet.controller.getName();

                                if (!controllerMap[prevController]) {
                                    controllerMap[prevController] = {};
                                    controllerMap[prevController].pixelSet = [];
                                    controllerMap[prevController].controller = value.route[j - value.start - 1].pixelSet.controller;
                                }
                                
                                controllerMap[prevController].pixelSet.push({
                                    s: value.route[j - value.start - 1].pixelSet.strip,
                                    p: value.route[j - value.start - 1].pixelSet.pixels[value.route[j - value.start - 1].pixelSet.pixels.length-1],
                                    r: 0,
                                    g: 0,
                                    b: 0
                                });
                            }
                        }
                    }
                });
                if (newPixels) {
                    routeFrames.push(controllerMap);
                }
            }
        }

        return routeFrames;
    }

    async chaosFloor(time) {
        var controllers = this.pixelMap.getControllers();
        var numPixels = 276;
 
        var currTime = new Date().getMilliseconds();

        while (new Date().getMilliseconds() < currTime+time) {
        
            //Sweep colors across each strip, every other strip in the opposite direction, only one pixel on at a time
            for(let i = 0; i < numPixels; i++){
                controllers[0].setPixels([
                    { s: 0, p: i, r: 255, g: 0, b: 0 },
                    { s: 1, p: (numPixels - i - 1), r: 0, g: 255, b: 0 },
                    { s: 2, p: i, r: 0, g: 0, b: 255 },
                    { s: 3, p: (numPixels - i - 1), r: 255, g: 255, b: 255 }
                ], true);

                controllers[1].setPixels([
                    { s: 0, p: i, r: 255, g: 255, b: 0 },
                    { s: 1, p: (numPixels - i - 1), r: 255, g: 0, b: 255 },
                    { s: 2, p: i, r: 0, g: 255, b: 255 },
                    { s: 3, p: (numPixels - i - 1), r: 255, g: 100, b: 255 }
                ], true);

                controllers[2].setPixels([
                    { s: 0, p: i, r: 255, g: 255, b: 0 },
                    { s: 1, p: (numPixels - i - 1), r: 255, g: 0, b: 255 },
                    { s: 2, p: i, r: 0, g: 255, b: 255 },
                    { s: 3, p: (numPixels - i - 1), r: 255, g: 100, b: 255 }
                ], true);
                await NeoPixel.wait(20);
            }
        }
    }

    async shutdown () {
        this.pixelMap.shutdownControllers();
    }

}

module.exports = PixelFunctions;