const NeoPixel = require('./NeoPixel');

class SimplifiedGlitterFloor {

    constructor(controller, starsPerStrip = 2, startingRed = 80, startingGreen = 50, startingBlue = 0) {
        this.controller = controller;
        this.glitterFloorRun = false;
        this.numPixels = 300;
        this.numStrips = 2; // Two strips
        this.starsPerStrip = starsPerStrip; // Configurable number of stars per strip
        this.startingRed = startingRed; // Configurable starting red value
        this.startingGreen = startingGreen; // Configurable starting green value
        this.startingBlue = startingBlue; // Configurable starting blue value
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

    async glitterFloor() {
        this.glitterFloorRun = true;
        const speed = 70;
        const finishWhite = 255;

        // Fade in the background color on both strips
        await this.fadeFill(
            {r: this.startingRed, g: this.startingGreen, b: this.startingBlue, brightness: 0},
            {r: this.startingRed, g: this.startingGreen, b: this.startingBlue, brightness: 1},
            1000
        );

        // Initialize stars for both strips
        var stripStars = [];

        // Create stars per strip based on configuration
        for (let stripIndex = 0; stripIndex < this.numStrips; stripIndex++) {
            var stars = [];
            for (var i = 0; i < this.starsPerStrip; i++) {
                var pixel = this.randomIntFromInterval(0, this.numPixels - 1);
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

        while (this.glitterFloorRun) {
            var pixelSet = [];

            // Process each strip
            stripStars.forEach((stripData) => {
                var stripIndex = stripData.strip;

                // Add new stars if we have less than the configured amount
                if (stripData.stars.length < this.starsPerStrip) {
                    var maxNumber = this.starsPerStrip - stripData.stars.length;
                    for (var i = 0; i < maxNumber; i++) {
                        var pixel = this.randomIntFromInterval(0, this.numPixels - 1);
                        stripData.stars.push({
                            pixel: pixel,
                            color: {r: this.startingRed, g: this.startingGreen, b: this.startingBlue},
                            ascending: true
                        });
                    }
                }

                // Process each star on this strip
                var removeStars = [];
                for (var j = 0; j < stripData.stars.length; j++) {
                    var star = stripData.stars[j];
                    var color = star.color;

                    if (star.ascending) {
                        // Fade up to white
                        color.r = this.incrementDecrementIfEquals(color.r, finishWhite, true, speed);
                        color.g = this.incrementDecrementIfEquals(color.g, finishWhite, true, speed);
                        color.b = this.incrementDecrementIfEquals(color.b, finishWhite, true, speed);

                        if (color.r === finishWhite && color.g === finishWhite && color.b === finishWhite) {
                            star.ascending = false;
                        }
                    } else {
                        // Fade down to starting color
                        color.r = this.incrementDecrementIfEquals(color.r, this.startingRed, false, speed);
                        color.g = this.incrementDecrementIfEquals(color.g, this.startingGreen, false, speed);
                        color.b = this.incrementDecrementIfEquals(color.b, this.startingBlue, false, speed);

                        if (color.r === this.startingRed && color.g === this.startingGreen && color.b === this.startingBlue) {
                            removeStars.push(j);
                        }
                    }

                    // Add pixel command for this star
                    pixelSet.push({
                        s: stripIndex,
                        p: star.pixel,
                        r: color.r,
                        g: color.g,
                        b: color.b
                    });
                }

                // Remove completed stars
                removeStars.forEach((starIndex) => {
                    stripData.stars.splice(starIndex, 1);
                });
            });

            // Send the same commands to the controller
            this.controller.setPixels(pixelSet, false);
            await NeoPixel.wait(20);
        }
    }

    async fadeFill(colorStart, colorFinish, fadeTime) {
        const refreshSpeed = 50;
        const frames = fadeTime / refreshSpeed;
        const brightnessIncrement = (colorFinish.brightness - colorStart.brightness) / frames;
        const rIncrement = (colorFinish.r - colorStart.r) / frames;
        const gIncrement = (colorFinish.g - colorStart.g) / frames;
        const bIncrement = (colorFinish.b - colorStart.b) / frames;

        var currentColor = {...colorStart};

        // Manually set brightness start
        await this.fillStrips(currentColor);
        await NeoPixel.wait(refreshSpeed);

        for (var i = 1; i < frames - 1; i++) {
            currentColor.brightness = currentColor.brightness + brightnessIncrement;
            currentColor.r = currentColor.r + rIncrement;
            currentColor.g = currentColor.g + gIncrement;
            currentColor.b = currentColor.b + bIncrement;

            await this.fillStrips(currentColor);
            await NeoPixel.wait(refreshSpeed);
        }

        // Manually set brightness finish
        await this.fillStrips(colorFinish);
    }

    async fillStrips(color) {
        var stripColor = {
            r: Math.round(color.r * color.brightness),
            g: Math.round(color.g * color.brightness),
            b: Math.round(color.b * color.brightness)
        };

        // Fill both strips with the same color
        for (let stripIndex = 0; stripIndex < this.numStrips; stripIndex++) {
            this.controller.fill(stripIndex, stripColor);
        }
    }

    async stopGlitterFloor() {
        this.glitterFloorRun = false;
        setTimeout(() => {
            this.clearFloor();
        }, 10);
    }

    async clearFloor() {
        for (var i = 0; i < this.numStrips; i++) {
            this.controller.fill(i, {r: 0, g: 0, b: 0});
        }
    }
}

module.exports = SimplifiedGlitterFloor;
