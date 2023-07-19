let cnv;
let btn;
let analyser, audioContext;
let autoCorrelateValue = -1;
let freq_data = [0];
let max_data = 100;
let note = "";
let previousValueToDisplay = 0;
let smoothingCount = 0;
let smoothingThreshold = 5;
let smoothingCountThreshold = 5;
let a4 = 440;
let buf = new Float32Array(1024);
let MIN_SAMPLES = 0;
let GOOD_ENOUGH_CORRELATION = 0.9;
let parameters = false;
let colorBigCercle 
let colorMiddleCercle 
let colorSmallCercle 
let colorText 
let colorTriangle
let accuracy 
let cents = 0
let cnvWidth = 0
let cnvHeight = 0
let cnvRtaio = 3
let diff = -999
function setup() {
  parametres();
  if(windowWidth > windowHeight){
  cnvWidth = windowWidth * 0.98
  cnvHeight = cnvWidth / cnvRtaio
  }
  else{
  cnvWidth = windowWidth *0.98
  cnvHeight = windowWidth / cnvRtaio
  }
  cnv = createCanvas(cnvWidth, cnvHeight);
  let x = (windowWidth - width) / 2;
  let y = 50;
  cnv.position(x, y);
  let source;
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioContext.createAnalyser();
  analyser.minDecibels = -100;
  analyser.maxDecibels = -10;
  analyser.smoothingTimeConstant = 0.85;
  if (!navigator?.mediaDevices?.getUserMedia) {
    // No audio allowed
    alert("Sorry, getUserMedia is required for the app.");
    return;
  } else {
    let constraints = { audio: true };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function (stream) {
        // Initialize the SourceNode
        source = audioContext.createMediaStreamSource(stream);
        // Connect the source node to the analyzer
        source.connect(analyser);
        tune();
      })
      .catch(function (err) {
        alert("err mic " + err);
      });
  }
}

function draw() {
  background(255, 255, 255);
   colorBigCercle = color(217,217,217)
   colorMiddleCercle = color(217,217,217)
   colorSmallCercle = color(217,217,217)

   if(note == "--")colorText = color(217,217,217)
   else colorText = color(0,0,0)
   colorTriangle = color(217,217,217)
  noStroke()
  
  fill(colorText);
  textSize(width * 0.26);
  text(note, width * 0.415, height * 0.79);
  fill(217,217,217);
  if(diff <5 && diff > -5)
  fill(35,135,36)//grün
//triange
  let x1 = width * 0.46;
  let y1 = height * 0.01;
  let x2 = width * 0.54;
  let y2 = height * 0.01;
  let x3 = width * 0.5;
  let y3 = height * 0.14;
  triangle(x1, y1, x2, y2, x3, y3);
 //linke Rheie
let num = 1
if( diff >= -5)fill(35,135,36)//grün
  ellipse(width * 0.514 - (width / 20 *(num)),(height * 0.11) + height * 0.02 * fibonacci(num++), width * 0.035 + fibonacci(num))
  if( diff > -10)fill(35,135,36)//grün
  ellipse(width * 0.514 - (width / 20 *(num)),(height * 0.11) + height * 0.02 * fibonacci(num++), width * 0.035 + fibonacci(num))
  if(diff > -15)fill(255,190,0)//Gelb
  ellipse(width * 0.514 - (width / 20 *(num)),(height * 0.11) + height * 0.02 * fibonacci(num++), width * 0.035 + fibonacci(num))
  if(diff > -20)fill(255,190,0)//Gelb
  ellipse(width * 0.514 - (width / 20 *(num)),(height * 0.11) + height * 0.02 * fibonacci(num++), width * 0.035 + fibonacci(num))
  if( diff > -25)fill(255,190,0)//Gelb
  ellipse(width * 0.514 - (width / 20 *(num)),(height * 0.11) + height * 0.02 * fibonacci(num++), width * 0.035 + fibonacci(num))
  if( diff > -30)fill(210,34,34)//Rot
  ellipse(width * 0.514 - (width / 20 *(num)),(height * 0.11) + height * 0.02 * fibonacci(num++), width * 0.035 + fibonacci(num))
  if( diff > -35)fill(210,34,34)//Rot
  ellipse(width * 0.514 - (width / 20 *(num)),(height * 0.11) + height * 0.02 * fibonacci(num++), width * 0.035 + fibonacci(num))
  if(diff <-40 && diff > -100)fill(210,34,34)//Rot
  ellipse(width * 0.514 - (width / 20 *(num)),(height * 0.11) + height * 0.02 * fibonacci(num++), width * 0.035 + fibonacci(num))
//rechte Rheie
fill(217,217,217);

if( diff > 39 && diff < 100)fill(210,34,34)//Rot
ellipse(width * 0.486 + (width / 20 *(--num)),(height * 0.11) + height * 0.02 * fibonacci(num), width * 0.035 + fibonacci(num+1))
if( diff > 35)fill(210,34,34)//Rot
ellipse(width * 0.486 + (width / 20 *(--num)),(height * 0.11) + height * 0.02 * fibonacci(num), width * 0.035 + fibonacci(num+1))
if( diff > 30)fill(210,34,34)//Rot
ellipse(width * 0.486 + (width / 20 *(--num)),(height * 0.11) + height * 0.02 * fibonacci(num), width * 0.035 + fibonacci(num+1))
if( diff > 25)fill(255,190,0)//Gelb
ellipse(width * 0.486 + (width / 20 *(--num)),(height * 0.11) + height * 0.02 * fibonacci(num), width * 0.035 + fibonacci(num+1))
if( diff > 20)fill(255,190,0)//Gelb
ellipse(width * 0.486 + (width / 20 *(--num)),(height * 0.11) + height * 0.02 * fibonacci(num), width * 0.035 + fibonacci(num+1))
if( diff > 15)fill(255,190,0)//Gelb
ellipse(width * 0.486 + (width / 20 *(--num)),(height * 0.11) + height * 0.02 * fibonacci(num), width * 0.035 + fibonacci(num+1))
if( diff > 10)fill(35,135,36)//grün
ellipse(width * 0.486 + (width / 20 *(--num)),(height * 0.11) + height * 0.02 * fibonacci(num), width * 0.035 + fibonacci(num+1))
if( diff >= 5)fill(35,135,36)//grün
ellipse(width * 0.486 + (width / 20 *(--num)),(height * 0.11) + height * 0.02 * fibonacci(num), width * 0.035 + fibonacci(num+1))
//console.log(diff)
  tune();
  if (autoCorrelateValue === -1) {
    colorText=color(217,217,217)
    note = "--";
    diff = -999
    return;
  }
  change_ref(parseInt(ref.value()));
}

function tune() {
  drawNoteVisual = requestAnimationFrame(tune);
  let bufferLength = analyser.fftSize;
  let buffer = new Float32Array(bufferLength);
  analyser.getFloatTimeDomainData(buffer);
  let autoCorrelateValue = autoCorrelate(buffer, audioContext.sampleRate);
  // Handle rounding
  let valueToDisplay = autoCorrelateValue;
  let smoothingThreshold = 10;
  if (autoCorrelateValue === -1) {
    colorText=color(217,217,217)
    note = "--";
    diff = -999
    return;
  }
  function noteIsSimilarEnough() {
    // Check threshold for number, or just difference for notes.
    if (typeof valueToDisplay == "number") {
      return (
        Math.abs(valueToDisplay - previousValueToDisplay) < smoothingThreshold
      );
    } else {
      return valueToDisplay === previousValueToDisplay;
    }
  }
  // Check if this value has been within the given range for n iterations
  if (noteIsSimilarEnough()) {
    if (smoothingCount < smoothingCountThreshold) {
      smoothingCount++;
      return;
    } else {
      previousValueToDisplay = valueToDisplay;
      smoothingCount = 0;
    }
  } else {
    previousValueToDisplay = valueToDisplay;
    smoothingCount = 0;
    return;
  }
  note = noteFromPitch(valueToDisplay).note  ;
  diff = noteFromPitch(valueToDisplay).cents
}
function noteFromPitch(freq) {
  // Danke an  PitchDetect: https://github.com/cwilso/PitchDetect/blob/master/js/pitchdetect.js
var noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "H"];
 
var noteNum = 12 * (Math.log(freq / a4) / Math.log(2));
  var noteIndex = Math.round(noteNum) + 69;
  var note = noteStrings[noteIndex % 12];
  var centsDiff = Math.floor(1200 * Math.log2(freq / (a4 * Math.pow(2, (noteIndex - 69) / 12))));

  return {
    note: note,
    cents: centsDiff
  };
}


function autoCorrelate(buf, sampleRate) {
  let SIZE = buf.length;
  let MAX_SAMPLES = Math.floor(SIZE / 2);
  let best_offset = -1;
  let best_correlation = 0;
  let rms = 0;
  let foundGoodCorrelation = false;
  let correlations = new Array(MAX_SAMPLES);
  for (let i = 0; i < SIZE; i++) {
    let val = buf[i];
    rms += val * val;
  }
  rms = Math.sqrt(rms / SIZE);
  if (rms < 0.01)
    // not enough signal
    return -1;

  let lastCorrelation = 1;
  for (let offset = MIN_SAMPLES; offset < MAX_SAMPLES; offset++) {
    let correlation = 0;

    for (let i = 0; i < MAX_SAMPLES; i++) {
      correlation += Math.abs(buf[i] - buf[i + offset]);
    }
    correlation = 1 - correlation / MAX_SAMPLES;
    correlations[offset] = correlation; // store it, for the tweaking we need to do below.
    if (
      correlation > GOOD_ENOUGH_CORRELATION &&
      correlation > lastCorrelation
    ) {
      foundGoodCorrelation = true;
      if (correlation > best_correlation) {
        best_correlation = correlation;
        best_offset = offset;
      }
    } else if (foundGoodCorrelation) {
      // short-circuit - we found a good correlation, then a bad one, so we'd just be seeing copies from here.
      // Now we need to tweak the offset - by interpolating between the values to the left and right of the
      // best offset, and shifting it a bit.  This is complex, and HACKY in this code (happy to take PRs!) -
      // we need to do a curve fit on correlations[] around best_offset in order to better determine precise
      // (anti-aliased) offset.

      // we know best_offset >=1,
      // since foundGoodCorrelation cannot go to true until the second pass (offset=1), and
      // we can't drop into this clause until the following pass (else if).
      let shift =
        (correlations[best_offset + 1] - correlations[best_offset - 1]) /
        correlations[best_offset];
      return sampleRate / (best_offset + 8 * shift);
    }
    lastCorrelation = correlation;
  }
  if (best_correlation > 0.01) {
    // console.log("f = " + sampleRate/best_offset + "Hz (rms: " + rms + " confidence: " + best_correlation + ")")
    return sampleRate / best_offset;
  }

  return -1;
  //	let best_frequency = sampleRate/best_offset;
}

function change_ref(v) {
  if (v <= 480 && v >= 410) {
    a4 = v;
  }
}

function parametres() {
  if (!parameters) {
    ref = createInput("", "number");
    ref.value(a4);
    ref.parent("#ref");
    ref.addClass("form-control");
    ref.style("width: 5em;");
    ref.attribute("min", "410");
    ref.attribute("max", "480");
    ref.attribute("required");
    //ref.mouseOut(change_ref(parseInt(ref.value())));
    parameters = true;
  }
}
function fibonacci(n) {
  if (n === 0) return 0;
  if (n === 1) return 1;
  // recursioin base
  return fibonacci(n - 2) + fibonacci(n - 1);
}
