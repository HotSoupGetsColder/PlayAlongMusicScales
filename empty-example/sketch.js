let osc, env, midiValue, step, currentOctave;

let scaleArray = [57, 59, 61, 62, 64, 66, 68, 69];
let majorScaleSteps = [2, 2, 1, 2, 2, 2, 1];

let aMStart = 57;
let octaves = 2;
// let totalIndex = 0;
// let note = 0;
let tempo = 300; //in BPM

let frameRate = 60;
let w = 200;
let h = 200;

function setup() {
  createCanvas(w, h);
  background(100, 255, 255);
  textSize(20);
  textAlign(CENTER, CENTER);
  text('A Major Scale', w/2, h/2);

  let secPerBeat = 60 / tempo;

  osc = new p5.Oscillator('sine');

  env = new p5.Envelope();
  env.setADSR(0.1, 0.1, 0.8, secPerBeat);
  env.setRange(1, 0);
  osc.start();

  midiValue = 57;
  step = 0;
  currentOctave = 1;
}

function draw() {
  // put drawing code here
  if (frameCount % (60 / tempo * frameRate) === 0 || frameCount === 1) {
    let freqValue = midiToFreq(midiValue);
    osc.freq(freqValue);
    env.play(osc);

    midiValue = midiValue + majorScaleSteps[step];
    step++;
    if (step >= majorScaleSteps.length) {
      currentOctave++;
      if (currentOctave <= octaves){
        step = 0;
      }
    }


    // if (totalIndex === 0) {
    //   midiValue = aMStart;
    //   note = 0;
    // }
    // midiValue = midiValue + majorScaleSteps[note];
    // let freqValue = midiToFreq(midiValue);
    // osc.freq(freqValue);
    //
    // print(note + ' ' + midiValue + ' ' + freqValue);
    //
    // env.play(osc, 0, 0.05);
    // note = (note + 1) % majorScaleSteps.length;
    // totalIndex = (totalIndex + 1) % (majorScaleSteps.length * octaves);
  }
}
