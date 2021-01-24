let osc, env, midiValue, step, currentOctave, playingScale, inpNoteType;

let scaleArray = [57, 59, 61, 62, 64, 66, 68, 69];
let majorScaleSteps = [2, 2, 1, 2, 2, 2, 1];
let noteTypes = [1, 2, 4, 8, 16];

let octaves = 1;
let tempo = 240; //in BPM
let note = 8; // 8 = eighth, 4 = quarter, etc.

let frameRate = 60;
let w = 200;
let h = 50;

let ea = 0.1;
let ed = 0.1;
let es = 0.8;
let er = 0.8;

var button;

function startScale(){
  midiValue = 57;
  step = 0;
  currentOctave = 1;
  playingScale = true;
}

function playNote() {
  env.mult(0.1 * volSlider.value());
  let freqValue = midiToFreq(midiValue);
  osc.freq(freqValue);
  osc.start();
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

function changeNoteType() {
  note = inpNoteType.value();
  let secPerNote = (60 / tempo) * (4 / note);
  env.setADSR(ea * secPerNote, ed * secPerNote, es, er * secPerNote);
  env.setRange(1, 0);
}

function setup() {
  createCanvas(w, h);
  background(100, 255, 255);
  textSize(20);
  textAlign(CENTER, CENTER);
  text('A Major Scale', w/2, h/2);

  button = createButton('start/stop');
  button.mousePressed(startScale);
  volSlider = createSlider(0, 1, 0.5, 0.05);

  inpNoteType = createSelect();
  inpNoteType.position(0, 90);
  for (var i = 0; i < noteTypes.length; i++) {
    inpNoteType.option(noteTypes[i]);
  }
  inpNoteType.selected(4);
  inpNoteType.changed(changeNoteType);

  osc = new p5.Oscillator('sine');
  env = new p5.Envelope();

  changeNoteType();
}

function draw() {
  // put drawing code here
  if (frameCount % ((60 / tempo) * (4 / note) * frameRate) === 0 || frameCount === 1) {
    if (playingScale) {
      playNote();
      updateScale();
      checkEnd();
    }
  }
}
