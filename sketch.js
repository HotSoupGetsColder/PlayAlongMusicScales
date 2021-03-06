let osc, env, midiValue, step, currentOctave, playingScale, playingPickup, pickupIndex;

let scaleArray = [57, 59, 61, 62, 64, 66, 68, 69];
let majorScaleSteps = [2, 2, 1, 2, 2, 2, 1];
let noteTypes = [1, 2, 4, 8, 16];
let octSel = [1, 2, 3, 4];
let oscTypes = ['sine', 'triangle', 'sawtooth', 'square'];

let octaves = 1;
let tempo = 120; //in BPM
let note = 4; // 8 = eighth, 4 = quarter, etc.
let baseNote = 57;
let scaleUp = true;
let reverseScale = false;
let loopScale = false;
let playPickup = true;
let pickupCount = 4;
let playMet = true;

let ipMax = 13;  // ip = input placement
let ipSpacing = 25;
let ipStart = 30;
let ipX = 55;
let ip = new Array(ipMax);
for (var i = 0; i < ipMax; i++) {
  ip[i] = ipStart + i * ipSpacing;
}

let frameRate = 60;
let w = 200;
let h = ip[ipMax - 1] + ipSpacing;

let ea = 0.1;
let ed = 0.1;
let es = 0.8;
let er = 0.8;
let al = 1;
let alMax = 0.2;

let oscType = 'sine';

let timeLastNote = 0;
let timeLastSixNote = 0;
let sixNotesPlayed;
let triggerScale;

//////////////////////////////////////////////////////
// Functions
//////////////////////////////////////////////////////

function preload() {
  cowBell = loadSound('sounds/cowBell.mp3');
}

function startScale() {
  midiValue = baseNote;
  step = 0;
  currentOctave = 1;
  playingScale = true;
  scaleUp = true;
}

function stopScale() {
  playingScale = false;
}

function pressPlay() {
  startScale();
  sixNotesPlayed = 0;
  triggerScale = false;
  if (playPickup) {
    playingPickup = true;
    pickupIndex = 1;
    print('start pickup');
  } else {
    playingPickup = false;
    print("don't start pickup");
  }
}

function playNote() {
  let freqValue = midiToFreq(midiValue);
  osc.freq(freqValue);
  osc.start();
  let secPerNote = (60 / tempo) * (4 / note);
  env.setRange(alMax * al, 0);
  env.setADSR(ea * secPerNote, ed * secPerNote, es, er * secPerNote);
  env.play(osc);
  print('Played' + ' ' + step + ' ' + currentOctave + ' ' + midiValue);
}

function updateScale() {
  if (scaleUp) {
    midiValue = midiValue + majorScaleSteps[step];
    step++;
    if (step >= majorScaleSteps.length) {
      currentOctave++;
      step = 0;
    }
  } else {
    midiValue = midiValue - majorScaleSteps[step];
    step--;
    if (step < 0) {
      currentOctave--;
      step = majorScaleSteps.length - 1;
    }
  }
}

function checkEnd() {
  if (scaleUp) {
    if (currentOctave > octaves) {
      if (step > 0) {
        if (reverseScale) {
          midiValue = midiValue - majorScaleSteps[0];
          step = majorScaleSteps.length - 1
          currentOctave = octaves;
          scaleUp = false;
        } else {
          endScale();
        }
      }
    }
  } else {
      if (currentOctave < 1) {
        if (step <= majorScaleSteps.length - 2) {
          endScale();
        }
      }
    }
}

function endScale() {
  playingScale = false;
  if (loopScale) {
    startScale();
  }
}

//////////////////////////////////////////////////////
// Button Functions
//////////////////////////////////////////////////////

function changeNoteType() {
  note = inpNoteType.value();
  print('Changed note to ' + note);
}

function changeVolume() {
  al = volSlider.value();
  print('Attack level changed to ' + al);
}

function changeOctaves() {
  octaves = inpOct.value();
  print('Octaves changed to ' + octaves);
}

function changeTempo() {
  tempo = int(inpTemp.value());
  print('Tempo changed to ' + tempo);
}

function changeBaseNote() {
  baseNote = int(inpBaseNote.value());
  print('Base note changed to ' + baseNote);
}

function changeOscType() {
  oscType = inpOscType.value();
  osc.setType(oscType);
  print('Osc. type changed to ' + oscType);
}

function toggleScale() {
  osc.freq(0, 0.1);
  osc.start();
  if (!playingScale) {
    pressPlay();
  } else {
    stopScale();
  }
}

function changeRevScale() {
  reverseScale = boolean(inpRev.value());
  print('Reverse scale --> ' + reverseScale);
}

function changeLoopScale() {
  loopScale = boolean(inpLoop.value());
  print('Loop scale --> ' + loopScale);
}

function changePU() {
  playPickup = boolean(inpPU.value());
  print('Play pickup --> ' + playPickup);
}

function changePUCount() {
  pickupCount = int(inpPUCount.value());
  print('Pickup count --> ' + pickupCount);
}

function changePlayMet() {
  playMet = boolean(inpPlayMet.value());
  print('Play metrinome --> ' + playMet);
}

//////////////////////////////////////////////////////
// Create Buttons
//////////////////////////////////////////////////////


function createInterface() {
  button = createButton('start / stop');
  button.position(ipX, ip[1]);
  button.mousePressed(toggleScale);

  volSlider = createSlider(0.05, 1, 0.5, 0.05);
  volSlider.position(ipX, ip[2]);
  volSlider.changed(changeVolume);

  inpNoteType = createSelect();
  inpNoteType.position(ipX, ip[4]);
  for (var i = 0; i < noteTypes.length; i++) {
    inpNoteType.option("1/" + str(noteTypes[i]),noteTypes[i]);
  }
  inpNoteType.selected(note);
  inpNoteType.changed(changeNoteType);

  inpOct = createSelect();
  inpOct.position(ipX, ip[5]);
  for (var i = 0; i < octSel.length; i++) {
    inpOct.option(octSel[i]);
  }
  inpOct.selected(octaves);
  inpOct.changed(changeOctaves);

  inpTemp = createInput(str(tempo));
  inpTemp.position(ipX + 3, ip[3]);
  inpTemp.size(25);
  inpTemp.changed(changeTempo);

  inpBaseNote = createInput(str(baseNote));
  inpBaseNote.position(ipX + 3, ip[6]);
  inpBaseNote.size(20);
  inpBaseNote.changed(changeBaseNote);

  inpOscType = createSelect();
  inpOscType.position(ipX, ip[7]);
  for (var i = 0; i < oscTypes.length; i++) {
    inpOscType.option(oscTypes[i]);
  }
  inpOscType.selected(oscType);
  inpOscType.changed(changeOscType);

  inpRev = createSelect();
  inpRev.position(ipX, ip[8]);
  inpRev.option('reverse', true);
  inpRev.option("don't reverse", false);
  inpRev.selected(reverseScale);
  inpRev.changed(changeRevScale);

  inpLoop = createSelect();
  inpLoop.position(ipX, ip[9]);
  inpLoop.option('loop', true);
  inpLoop.option("don't loop", false);
  inpLoop.selected(loopScale);
  inpLoop.changed(changeLoopScale);

  inpPU = createSelect();
  inpPU.position(ipX, ip[10]);
  inpPU.option('play', true);
  inpPU.option("don't play", false);
  inpPU.selected(playPickup);
  inpPU.changed(changePU);

  inpPUCount = createInput(str(pickupCount));
  inpPUCount.position(ipX, ip[11]);
  inpPUCount.size(20);
  inpPUCount.changed(changePUCount);

  inpPlayMet = createSelect();
  inpPlayMet.position(ipX, ip[12]);
  inpPlayMet.option('play metronome', true);
  inpPlayMet.option("don't play", false);
  inpPlayMet.selected(playMet);
  inpPlayMet.changed(changePlayMet);
}

function loadLabels() {
  textSize(12);
  textAlign(RIGHT, TOP);
  let labelX = ipX - 5;
  let labelYShift = + 4;
  text('', labelX, ip[1] + labelYShift);
  text('Volume', labelX, ip[2] + labelYShift - 3);
  text('Tempo', labelX, ip[3] + labelYShift);
  text('Note', labelX, ip[4] + labelYShift);
  text('Octaves', labelX, ip[5] + labelYShift);
  text('Base', labelX, ip[6] + labelYShift);
    text('def=A4', labelX + 75, ip[6] + labelYShift);
    let chartLink = createA('http://computermusicresource.com/midikeys.html', 'note chart');
    chartLink.position(labelX + 80, ip[6] + labelYShift - 3.5);
  text('Wave', labelX, ip[7] + labelYShift);
  text('Reverse', labelX, ip[8] + labelYShift);
  text('Loop', labelX, ip[9] + labelYShift);
  text('Pickup', labelX, ip[10] + labelYShift);
  text('PU #', labelX, ip[11] + labelYShift);
  text('Met.', labelX, ip[12] + labelYShift);


  let ghLink = createA('https://github.com/HotSoupGetsColder/PlayAlongMusicScales', 'Github link');
  ghLink.position((w / 2) - (ghLink.width / 2) - 5, h + 5);
}

//////////////////////////////////////////////////////
// Main Code
//////////////////////////////////////////////////////

function setup() {
  createCanvas(w, h);
  colorMode(HSB);
  background(40, 80, 255);
  textFont('Helvetica');
  textSize(30);
  textAlign(CENTER, CENTER);
  text('Major Scales', w/2, 30);

  createInterface();
  loadLabels();

  osc = new p5.Oscillator(oscType);
  env = new p5.Envelope();
}

function draw() {
  // put drawing code here
  let timePassed = (frameCount / frameRate) + (deltaTime / 1000); //Time passed in seconds

  let secPerSixNote = (60 / tempo) * (4 / 16);
  if (timePassed - timeLastSixNote > secPerSixNote) {
    timeLastSixNote = timePassed;
    sixNotesPlayed++;

    if (playingScale) {
      if (sixNotesPlayed % 4 == 1) {
        if (triggerScale) {
          playingPickup = false;
        }
        if (playingPickup) {
          cowBell.play(undefined, undefined, 0.1);
          pickupIndex++;
          if (pickupIndex > pickupCount) {
            triggerScale = true;
          }
        } else if (playMet) {
          cowBell.play(undefined, undefined, 0.02);
        }
      }
      if (sixNotesPlayed % (16 / note) == 1 || note == 16) {
        if (!playingPickup) {
          playNote();
          updateScale();
          checkEnd();
        }
      }
    }
  }
}
