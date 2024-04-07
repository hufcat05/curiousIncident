const NeoPixel = require('./NeoPixel');

class PixelFunctions {
    async lightSection(section, color) {
        var pixelSet = [];

        section.pixels.forEach((pixel) => {
            pixelSet.push({s: section.strip, p: pixel, r: color.r, g: color.g, b: color.b});
        });

        section.controller.setPixels(pixelSet);
    }

}

module.exports = PixelFunctions;