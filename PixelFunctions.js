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
        var E2Route3 = [];

        E2Route1.push({pixelSet: map.A[1].D, invert: true, name: "1"});
        E2Route1.push({pixelSet: map.B[1].D, invert: true, name: "2"});
        E2Route1.push({pixelSet: map.B[1].C, invert: true, name: "3"});

       this.runRoute(E2Route1, {r: 255, g: 255, b: 255, brightness: 1});
    }

    runRoute(route, color) {
        route.forEach((section) => {
            var start = section.invert ? section.pixelSet.pixels.length : 0;
            var finish = section.invert ? 0 : section.pixelSet.pixels.length;
    
            if (start < finish) {
                for (var i = start; i < finish; i++) {
                    this.setRoutePixels(section, i, color);
        
                }
            } else {
                for (var i = start; i > finish; i--) {
                    this.setRoutePixels(section, i, color);
                    console.log(section.name);
                }
            }
        });
    }

    setRoutePixels(section, index, color) {
        section.pixelSet.controller.setPixels([{
            s: section.pixelSet.strip, 
            p: section.pixelSet.pixels[index],
            r: Math.round(color.r * color.brightness), 
            g: Math.round(color.g * color.brightness), 
            b: Math.round(color.b * color.brightness)}], true);
    }

    async shutdown () {
        this.pixelMap.shutdownControllers();
    }

}

module.exports = PixelFunctions;