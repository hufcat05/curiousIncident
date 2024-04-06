const NeoPixel = require('./NeoPixel');

const SERVERA = 'tcp://172.16.56.31:800'
const SERVERB = 'tcp://172.16.56.32:800'
const SERVERC = 'tcp://172.16.56.33:800'
const PAUSE = parseInt(process.env['PAUSE']) || 50
const numPixels = 300;

const neopixelA = new NeoPixel();
const neopixelB = new NeoPixel();
const neopixelC = new NeoPixel();

(async () => {
    try {
    //Connect to each controller
    await neopixelA.connect(SERVERA);
    await neopixelB.connect(SERVERB);
    await neopixelC.connect(SERVERC);

    //Set pixel counts for each strip on each controller
    for(let i = 0; i < 4; i++) {
        neopixelA.setPixelCount(i, numPixels);
        neopixelB.setPixelCount(i, numPixels);
        neopixelC.setPixelCount(i, numPixels);
    }
    neopixelA.setPixelCount(0, 276);

    await NeoPixel.wait(50);

    //Turn all relays on in each controller
    for(let i = 0; i < 4; i++ ) {
        neopixelA.toggleRelayOn(i);    
        neopixelB.toggleRelayOn(i);
        neopixelC.toggleRelayOn(i);
    }

    await NeoPixel.wait(50);

    //Turn all strips off
    for(let i = 0; i < 4; i++) {
        neopixelA.off(i);
        neopixelB.off(i);
        neopixelC.off(i);
    }

    await NeoPixel.wait(50);

    let redA, blueA, greenA;
    for(let i = 0; i < numPixels; i++){
        if(i % 5 == 0) {
            red = 100;
            green = 100;
            blue = 100;
        } else {
            red = 0;
            green = 0;
            blue = 30;
        }
        
        for (let j = 0; j < 4; j++) {
            neopixelA.setPixels([{ s: j, p: i, r: red, g: green, b: blue }], false);
            neopixelB.setPixels([{ s: j, p: i, r: red, g: green, b: blue }], false);
            neopixelC.setPixels([{ s: j, p: i, r: red, g: green, b: blue }], false);
        }

        await NeoPixel.wait(20);
    }

    // for (let i = 248; i <= 275; i++) {
    //     neopixelA.setPixels([{ s: 0, p: i, r: 255, g: 255, b: 255 }], false);
    //     await NeoPixel.wait(10);
    // }

    // await NeoPixel.wait(2000);

    // //Turn all strips off
    // for(let i = 0; i < 4; i++) {
    //     neopixelA.off(i);
    //     neopixelB.off(i);
    //     neopixelC.off(i);
    // }

    // await NeoPixel.wait(1000);

    // //Turn all relays off
    // for(let i = 0; i < 4; i++ ) {
    //     neopixelA.toggleRelayOff(i);    
    //     neopixelB.toggleRelayOff(i);
    //     neopixelC.toggleRelayOff(i);
    // }

    // await NeoPixel.wait(1000);

    //Disconnect from controllers
    neopixelA.disconnect();
    neopixelB.disconnect();
    neopixelC.disconnect();
} catch (e) {
    console.error(`Error occurred: [${e.code}] ${e.message}`)
    process.exit(1)
    }
})()

//Generate rainbow of colors across specified number of pixels
function rainbowEffect(numPixels) {
    const colors = [];

    // Calculate the step size for transitioning through the hue
    const hueStep = 360 / numPixels;

    // Iterate over each pixel
    for (let i = 0; i < numPixels; i++) {
        // Calculate the hue for the current pixel
        const hue = i * hueStep;

        // Convert HSV to RGB
        const { r, g, b } = HSLToRGB(hue, 100, 50);
        // console.info(`Pixel: ${i}, Red: ${r}, Green: ${g}, Blue: ${b}`);

        // Add the RGB values to the colors array
        colors.push({ p: i, r: r, g: g, b: b });
    }

    return colors;
}

//Convert HSL color to RGB color
function HSLToRGB(h, s, l) {
    // Convert hue to the range [0, 360]
    h = (h % 360 + 360) % 360;
  
    // Convert saturation and lightness to fractions of 1
    s /= 100;
    l /= 100;

    // Calculate chroma
    const chroma = (1 - Math.abs(2 * l - 1)) * s;
    const x = chroma * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - chroma / 2;

    let r, g, b;

    if (h >= 0 && h < 60) {
        r = chroma;
        g = x;
        b = 0;
    } else if (h >= 60 && h < 120) {
        r = x;
        g = chroma;
        b = 0;
    } else if (h >= 120 && h < 180) {
        r = 0;
        g = chroma;
        b = x;
    } else if (h >= 180 && h < 240) {
        r = 0;
        g = x;
        b = chroma;
    } else if (h >= 240 && h < 300) {
        r = x;
        g = 0;
        b = chroma;
    } else if (h >= 300 && h < 360) {
        r = chroma;
        g = 0;
        b = x;
    }

    // Adjust RGB values and convert to [0, 255]
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return { r: r, g: g, b: b };
}