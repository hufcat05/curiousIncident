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
                controllerMap[controllerName].pixelSet.push({s: mappedSection.strip, 
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
        await this.fillSections(currentColor);
    }

    async shutdown () {
        this.pixelMap.shutdownControllers();
    }

}

module.exports = PixelFunctions;