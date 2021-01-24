let osc, env, midiValue, step, currentOctave, playingScale;

let scaleArray = [57, 59, 61, 62, 64, 66, 68, 69];
let majorScaleSteps = [2, 2, 1, 2, 2, 2, 1];

let aMStart = 57;
let octaves = 5;
let tempo = 400; //in BPM

let frameRate = 60;
let w = 200;
let h = 200;

var button;

function startScale(){
  osc.start();
  midiValue = 57;
  step = 0;
  currentOctave = 1;
  playingScale = true;
}

// function nextOctave() {
//   currentOctave++;
//   if (currentOctave <= octaves){
//     step = 0;
//   }
// }

function playNote() {
  let freqValue = midiToFreq(midiValue);
  osc.freq(freqValue);
  env.play(osc);
  print('Played' + ' ' + step + ' ' + currentOctave + ' ' + midiValue);
}

function updateScale() {
  midiValue = midiValue + majorScaleSteps[step];
  step++;
  if (step >= majorScaleSteps.length) {
    currentOctave++;
    step = 0;
  }
}

function checkEnd() {
  if (currentOctave > octaves) {
    if (step > 0) {
      playingScale = false;
    }
  }
}

function setup() {
  createCanvas(w, h);
  background(100, 255, 255);
  textSize(20);
  textAlign(CENTER, CENTER);
  text('A Major Scale', w/2, h/2);

  button = createButton('start');
  button.mousePressed(startScale);

  osc = new p5.Oscillator('sine');
  env = new p5.Envelope();
  let secPerBeat = 60 / tempo;
  env.setADSR(0.1, 0.1, 0.8, secPerBeat);
  env.setRange(1, 0);
}

function draw() {
  // put drawing code here
  if (frameCount % (60 / tempo * frameRate) === 0 || frameCount === 1) {
    if (playingScale) {
      playNote();
      updateScale();
      checkEnd();
    }
  }
}
