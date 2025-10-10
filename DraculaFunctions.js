const NeoPixel = require('./NeoPixel');
const DraculaPixelMap = require('./DraculaPixelMap');

const refreshSpeed = 50;


class DraculaFunctions {
    constructor () {
        this.pixelMap = new DraculaPixelMap();
        this.glitterCoffinRun = false;
    }

    async lightFlatCoffin(color) {
        var flatController = this.pixelMap.getControllers()[1];
        await flatController.toggleRelayOn(0);
        flatController.off();

        var stripColor = {
            r: Math.round(color.r * color.brightness), 
            g: Math.round(color.g * color.brightness), 
            b: Math.round(color.b * color.brightness)
        }
        
        this.sendFill(flatController, 0, stripColor);
    }

    async offFlatCoffin() {
        var flatController = this.pixelMap.getControllers()[1];
        flatController.off();
        flatController.toggleRelayOff(0);
    }

    async fadeFill(colorStart, colorFinish, fadeTime, strip, controller) {
        const fillController = this.pixelMap.getControllers()[controller];
        const frames = fadeTime / refreshSpeed;
        const brightnessIncrement = (colorFinish.brightness - colorStart.brightness) / frames;
        const rIncrement = (colorFinish.r - colorStart.r) / frames;
        const gIncrement = (colorFinish.g - colorStart.g) / frames;
        const bIncrement = (colorFinish.b - colorStart.b) / frames;

        var currentColor = colorStart;

        //Manually set brightness start
        await this.sendFill(fillController, strip, currentColor);
        await NeoPixel.wait(refreshSpeed);

        for (var i = 1; i < frames - 1; i++) {
            currentColor.brightness = currentColor.brightness + brightnessIncrement;
            currentColor.r = currentColor.r + rIncrement;
            currentColor.g = currentColor.g + gIncrement;
            currentColor.b = currentColor.b + bIncrement; 

            await this.sendFill(fillController, strip, currentColor);
            await NeoPixel.wait(refreshSpeed);
        }

        //Manually set brightness finish
        await this.sendFill(fillController, strip, colorFinish);
    }

    async stopGlitterCoffin() {
        this.glitterCoffinRun = false;
        var controller = this.pixelMap.getControllers()[0];
        await this.sendFill(controller, 0, {r: 0, g: 0, b: 0, brightness: 0});
        await this.sendFill(controller, 2, {r: 0, g: 0, b: 0, brightness: 0});
    }

    async glitterCoffin(color0, color2) {
        this.glitterCoffinRun = true;
        var controller = this.pixelMap.getControllers()[0];
        const starsPerStrip = 30;
        const numPixels = 300;
        const speed = 90;
        const finishWhite = 255;

        // Map to store base colors for each strip
        const baseColors = {
            0: color0,
            2: color2
        };

        await this.sendFill(controller, 0, {r: color0.r, g: color0.g, b: color0.b, brightness: color0.brightness});
        await this.sendFill(controller, 2, {r: color2.r, g: color2.g, b: color2.b, brightness: color2.brightness});
        
        // Initialize stars for both strips
        var stripStars = [];

        // Create stars per strip based on configuration
        for (let stripIndex = 0; stripIndex < 2; stripIndex++) {
            var stars = [];
            for (var i = 0; i < starsPerStrip; i++) {
                var pixel = this.randomIntFromInterval(0, numPixels - 1);
                var RGBColor = this.randomIntFromInterval(0, 255);
                var ascendingInt = this.randomIntFromInterval(1, 2);
                var ascending = ascendingInt == 1 ? true : false;

                stars.push({
                    pixel: pixel,
                    color: {r: RGBColor, g: RGBColor, b: RGBColor},
                    ascending: ascending
                });
            }
            stripStars.push({strip: stripIndex, stars: stars});
        }

        while (this.glitterCoffinRun) {
            var pixelSet = [];

            // Process each strip
            stripStars.forEach((stripData) => {
                var stripIndex = stripData.strip;

                stripIndex = (stripIndex == 0) ? 0 : 2;

                // Get the base color for this strip
                const baseColor = baseColors[stripIndex];

                // Add new stars if we have less than the configured amount
                if (stripData.stars.length < starsPerStrip) {
                    var maxNumber = starsPerStrip - stripData.stars.length;
                    for (var i = 0; i < maxNumber; i++) {
                        var pixel = this.randomIntFromInterval(0, numPixels - 1);
                        stripData.stars.push({
                            pixel: pixel,
                            color: {r: baseColor.r, g: baseColor.g, b: baseColor.b},
                            ascending: true
                        });
                    }
                }

                // Process each star on this strip
                var removeStars = [];
                for (var j = 0; j < stripData.stars.length; j++) {
                    var star = stripData.stars[j];
                    var starColor = star.color;

                    if (star.ascending) {
                        // Fade up to white
                        starColor.r = this.incrementDecrementIfEquals(starColor.r, finishWhite, true, speed);
                        starColor.g = this.incrementDecrementIfEquals(starColor.g, finishWhite, true, speed);
                        starColor.b = this.incrementDecrementIfEquals(starColor.b, finishWhite, true, speed);

                        if (starColor.r === finishWhite && starColor.g === finishWhite && starColor.b === finishWhite) {
                            star.ascending = false;
                        }
                    } else {
                        // Fade down to base color for this strip
                        starColor.r = this.incrementDecrementIfEquals(starColor.r, baseColor.r, false, speed);
                        starColor.g = this.incrementDecrementIfEquals(starColor.g, baseColor.g, false, speed);
                        starColor.b = this.incrementDecrementIfEquals(starColor.b, baseColor.b, false, speed);

                        if (starColor.r === baseColor.r && starColor.g === baseColor.g && starColor.b === baseColor.b) {
                            removeStars.push(j);
                        }
                    }

                    // Add pixel command for this star
                    pixelSet.push({
                        s: stripIndex,
                        p: star.pixel,
                        r: starColor.r,
                        g: starColor.g,
                        b: starColor.b
                    });
                }

                // Remove completed stars
                removeStars.forEach((starIndex) => {
                    if (stripData.stars[starIndex]){
                        pixelSet.push({
                            s: stripIndex,
                            p: stripData.stars[starIndex].pixel,
                            r: baseColor.r,
                            g: baseColor.g,
                            b: baseColor.b
                        });
                    }
                    stripData.stars.splice(starIndex, 1);
                });
            });

            // Send the same commands to the controller
            controller.setPixels(pixelSet, false);
            await NeoPixel.wait(20);
        }
    }

    randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    incrementDecrementIfEquals(val, valMatch, increment, speed) {
        if (val != valMatch) {
            if (increment) {
                if (val + speed > valMatch) {
                    return valMatch;
                }
                return val + speed;
            } else {
                if (val - speed < valMatch) {
                    return valMatch;
                }
                return val - speed;
            }
        }
        return val;
    }

    async sendFill(controller, strip, color) {
        var stripColor = {
            r: Math.round(color.r * color.brightness), 
            g: Math.round(color.g * color.brightness), 
            b: Math.round(color.b * color.brightness)
        }
        controller.fill(strip, stripColor);
    }

    async shutdown () {
        this.pixelMap.shutdownControllers();
    }
}

module.exports = DraculaFunctions;