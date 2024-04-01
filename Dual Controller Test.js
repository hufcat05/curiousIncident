const NeoPixel = require('./NeoPixel');

const SERVERA = 'tcp://172.18.40.80:800'
const SERVERB = 'tcp://172.18.40.165:800'
const PAUSE = parseInt(process.env['PAUSE']) || 50

const neopixelA = new NeoPixel();
const neopixelB = new NeoPixel();

(async () => {
    try {
    let latencyA = 0;
    let latencyB = 0;
    
    // await NeoPixel.wait(5000);
    
    //Connect to each controller
    await neopixelA.connect(SERVERA);
    await neopixelB.connect(SERVERB);

    //Set pixel counts for each strip on each controller
    for(let i = 0; i < 4; i++) {
        neopixelA.setPixelCount(i, 150);
        neopixelB.setPixelCount(i, 150);    
    }

    await NeoPixel.wait(1000);

    //Turn all relays on in each controller
    for(let i = 0; i < 4; i++ ) {
        neopixelA.toggleRelayOn(i);    
        neopixelB.toggleRelayOn(i);
    }

    await NeoPixel.wait(1000);


    //COLOR FILL DEMO
    //Set up array of colors to use for filling strips
    let colors = [
        { r: 100, g: 100, b: 100 },
        { r: 255, g: 255, b: 255 },
        { r: 255, g: 0, b: 0 },
        { r: 0, g: 255, b: 0 },
        { r: 0, g: 0, b: 255 },
        { r: 255, g: 255, b: 0 },
        { r: 255, g: 0, b: 255 },
        { r: 0, g: 255, b: 255 },
        { r: 0, g: 0, b: 0 }
    ];

    //Fill strips with each color and pause for 1s on each color
    for(let i = 0; i < 9; i++) {
        for(let j = 0; j < 4; j++) {
            neopixelA.fill(j, colors[i]);
            neopixelB.fill(j, colors[i]);
        }
        await NeoPixel.wait(3000);
    }

    //Turn all strips off
    for(let i = 0; i < 4; i++) {
        neopixelA.off(i);
        neopixelB.off(i);
    }

    await NeoPixel.wait(1000);


    //Sweep colors across each strip, every other strip in the opposite direction
    for(let i = 0; i < 75; i++){
        neopixelA.setPixels([
            { s: 0, p: i, r: 255, g: 0, b: 0 },
            { s: 1, p: (74 - i), r: 0, g: 255, b: 0 },
            { s: 2, p: i, r: 0, g: 0, b: 255 },
            { s: 3, p: (74 - i), r: 255, g: 255, b: 255 }
        ], false);
        neopixelB.setPixels([
            { s: 0, p: i, r: 255, g: 255, b: 0 },
            { s: 1, p: (74 - i), r: 255, g: 0, b: 255 },
            { s: 2, p: i, r: 0, g: 255, b: 255 },
            { s: 3, p: (74 - i), r: 255, g: 100, b: 255 }
        ], false);
        await NeoPixel.wait(20);
    }

    await NeoPixel.wait(2000);

    //Turn all strips off
    for(let i = 0; i < 4; i++) {
        neopixelA.off(i);
        neopixelB.off(i);
    }

    await NeoPixel.wait(1000);


    //Sweep colors across each strip, every other strip in the opposite direction, only one pixel on at a time
    for(let i = 0; i < 75; i++){
        neopixelA.setPixels([
            { s: 0, p: i, r: 255, g: 0, b: 0 },
            { s: 1, p: (74 - i), r: 0, g: 255, b: 0 },
            { s: 2, p: i, r: 0, g: 0, b: 255 },
            { s: 3, p: (74 - i), r: 255, g: 255, b: 255 }
        ], true);
        neopixelB.setPixels([
            { s: 0, p: i, r: 255, g: 255, b: 0 },
            { s: 1, p: (74 - i), r: 255, g: 0, b: 255 },
            { s: 2, p: i, r: 0, g: 255, b: 255 },
            { s: 3, p: (74 - i), r: 255, g: 100, b: 255 }
        ], true);
        await NeoPixel.wait(20);
    }

    await NeoPixel.wait(2000);

    //Turn all strips off
    for(let i = 0; i < 4; i++) {
        neopixelA.off(i);
        neopixelB.off(i);
    }

    await NeoPixel.wait(1000);
    

    //Sweep the color wheel across each strip, every other strip in the opposite direction
    const rainbowColors = rainbowEffect(75);
    for (let i = 0; i < 75; i++) {
        neopixelA.setPixels([
            {s: 0, p: (75 - rainbowColors[i].p), r: rainbowColors[i].r, g: rainbowColors[i].g, b: rainbowColors[i].b},
            {s: 1, p: rainbowColors[i].p, r: rainbowColors[i].r, g: rainbowColors[i].g, b: rainbowColors[i].b},
            {s: 2, p: (75 - rainbowColors[i].p), r: rainbowColors[i].r, g: rainbowColors[i].g, b: rainbowColors[i].b},
            {s: 3, p: rainbowColors[i].p, r: rainbowColors[i].r, g: rainbowColors[i].g, b: rainbowColors[i].b}
        ], false);

        neopixelB.setPixels([
            {s: 0, p: (75 - rainbowColors[i].p), r: rainbowColors[i].r, g: rainbowColors[i].g, b: rainbowColors[i].b},
            {s: 1, p: rainbowColors[i].p, r: rainbowColors[i].r, g: rainbowColors[i].g, b: rainbowColors[i].b},
            {s: 2, p: (75 - rainbowColors[i].p), r: rainbowColors[i].r, g: rainbowColors[i].g, b: rainbowColors[i].b},
            {s: 3, p: rainbowColors[i].p, r: rainbowColors[i].r, g: rainbowColors[i].g, b: rainbowColors[i].b}
        ], false);

        await NeoPixel.wait(20);
    }

    await NeoPixel.wait(2000);

    //Turn all strips off
    for(let i = 0; i < 4; i++) {
        neopixelA.off(i);
        neopixelB.off(i);
    }

    await NeoPixel.wait(1000);

    //Set each pixel to a different color
    let redA, blueA, greenA;
    for(let i = 0; i < 75; i++){
        if((i + 0) % 3 == 0) {redA = 255; greenA = 0; blueA = 0;}
        if((i + 1) % 3 == 0) {redA = 0; greenA = 255; blueA = 0;}
        if((i + 2) % 3 == 0) {redA = 0; greenA = 0; blueA = 255;}

        if((i + 0) % 3 == 0) {redB = 255; greenB = 255; blueB = 0;}
        if((i + 1) % 3 == 0) {redB = 255; greenB = 0; blueB = 255;}
        if((i + 2) % 3 == 0) {redB = 0; greenB = 255; blueB = 255;}
        
        for (let j = 0; j < 4; j++) {
            neopixelA.setPixels([{ s: j, p: i, r: redA, g: greenA, b: blueA }], false);
            neopixelB.setPixels([{ s: j, p: (74 - i), r: redB, g: greenB, b: blueB }], false);
        }
        await NeoPixel.wait(20);
    }

    await NeoPixel.wait(2000);

    //Turn all strips off
    for(let i = 0; i < 4; i++) {
        neopixelA.off(i);
        neopixelB.off(i);
    }

    await NeoPixel.wait(1000);

    //Turn all relays off
    for(let i = 0; i < 4; i++ ) {
        ({ latency: latencyA } = await neopixelA.toggleRelayOff(i));    
        ({ latency: latencyB } = await neopixelB.toggleRelayOff(i));
    }

    await NeoPixel.wait(1000);

    //Disconnect from controllers
    neopixelA.disconnect();
    neopixelB.disconnect();
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