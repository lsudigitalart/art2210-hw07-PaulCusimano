// HW7 Paul Cusimano

// shows a different gif every time the bass drum hits
// and displays captions at specific times in the song
// spectrum on the bottom of the screen

let song;
let fft;
let gifs = [];
let currentGifIndex = 0;
let lastChangeTime = 0;
// the minimum time between changing gifs
let changeInterval = 1000;
let numgifs = 15;
let captions = [
    { text: "We choose to go to the moon", startTime: 10 },
    { text: "in this decade and do the other things.", startTime: 2000 },
    { text: "Not because they are easy", startTime: 5000 },
    { text: "But because they are hard.", startTime: 7000 },
    { text: "...Because that goal,", startTime: 9000 },
    { text: "because that challenge", startTime: 10000 },
    { text: "is one that we are willing to accept.", startTime: 12000 },
    { text: "One that we are unwilling to postpone.", startTime: 14000 },
    { text: "And one which we intend to win.", startTime: 18000 },
    { text: "", startTime: 22000 },
];
let currentCaption = "";
let songStarted = false;

function preload() {
    song = loadSound('moon.mp3');
    for (let i = 1; i <= numgifs; i++) { 
        gifs.push(loadImage(`gifs/gif_${i}.gif`));
    }
}

function setup() {
    createCanvas(800, 600);
    fft = new p5.FFT();
}

function draw() {
    if (!songStarted) {
        background(0);
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(32);
        text("Click to start", width / 2, height / 2);
        return;
    }

    // show the current GIF
    image(gifs[currentGifIndex], 0, 0, width, height);

    let spectrum = fft.analyze();
    noStroke();
    fill(200, 200, 200, 50); // Transparent grey color (RGBA)
    for (let i = 0; i < spectrum.length; i++) {
        let x = map(i, 0, spectrum.length, 0, width);
        let h = map(spectrum[i], 0, 255, 0, 100);
        ellipse(x, height - h / 2, 10, h);
        ellipse(width - x, height - h / 2, 10, h); 
    }

    // Get the energy levels of the bass
    let bassLevel = fft.getEnergy("bass");
    let bassSize = map(bassLevel, 0, 255, 0, 200);

    // fill(0, 255, 0);
    // ellipse(width / 4, height / 2, bassSize, bassSize);
    // fill(255);
    // textAlign(CENTER, CENTER);
    // textSize(16);
    // text("Bass", width / 4, height / 2);


    // change the background gif based on the drumbeat
    if (bassLevel > 210 && millis() - lastChangeTime > changeInterval) { 
        currentGifIndex = (currentGifIndex + 1) % gifs.length;
        lastChangeTime = millis();
    }

    // Captions
    let currentTime = song.currentTime() * 1000;
    for (let i = 0; i < captions.length; i++) {
        if (currentTime > captions[i].startTime) {
            currentCaption = captions[i].text;
        }
    }

    // display the current caption
    stroke(0);
    strokeWeight(4);
    fill(255, 255, 0);
    textAlign(CENTER, CENTER);
    textSize(32);
    textStyle(BOLD);
    text(currentCaption, width / 2, height - 50);
    
    //see if the song is over
    if (!song.isPlaying()) {
        songStarted = false;
        currentCaption = "";
    }
}

function mousePressed() {
    if (!songStarted) {
        userStartAudio().then(() => {
            song.play();
            songStarted = true;
        });
    }
}