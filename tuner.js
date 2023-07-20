let cnv;
let analyser, audioContext;
let autoCorrelateValue = -1;
let note = "";
let previousValueToDisplay = 0;
let smoothingCount = 0;
let smoothingThreshold = 5;
let smoothingCountThreshold = 5;
let a4 = 440;
let buf = new Float32Array(1024);
let MIN_SAMPLES = 0;
let GOOD_ENOUGH_CORRELATION = 0.9;
let colorText 
let colorTriangle
let cnvWidth = 0
let cnvHeight = 0
let cnvRtaio = 3
let diff = -999
var tunerSketch = function(p) {

 p.setup = function() {
  
  if(p.windowWidth > p.windowHeight){
  cnvWidth = p.windowWidth * 0.98
  cnvHeight = cnvWidth / cnvRtaio
  }
  else{
  cnvWidth = p.windowWidth *0.98
  cnvHeight = p.windowWidth / cnvRtaio
  }
  cnv = p.createCanvas(cnvWidth, cnvHeight);
  let x = (p.windowWidth - p.width) / 2;
  let y = 50;
  cnv.position(x, y);
  parametres(p);
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
        tune(p);
      })
      .catch(function (err) {
        alert("err mic " + err);
      });
  }
}

 p.draw = function (){
  p.background(255, 255, 255);
  button = p.createButton('<i class="fa-solid fa-microphone">');
  button.position(p.width / 2 - 20, p.height + 45 );
  button.class("round-button")
  button.mousePressed(p.setup);

   if(note == "--")colorText = p.color(217,217,217)
   else colorText = p.color(0,0,0)
   colorTriangle = p.color(217,217,217)
  p.noStroke()
  
  p.fill(colorText);
  p.textFont('Inter bolds');
  p.textSize(p.width * 0.20);
  p.text(note, p.width * 0.435, p.height * 0.72);
  p.fill(217,217,217);

  if(diff >= 0 )
  p.fill(35,135,36)//grün


//triange
  let x1 = p.width * 0.46;
  let y1 = p.height * 0.01;
  let x2 = p.width * 0.54;
  let y2 = p.height * 0.01;
  let x3 = p.width * 0.5;
  let y3 = p.height * 0.19;
  p.triangle(x1, y1, x2, y2, x3, y3);
 //linke Rheie
 p.fill(217,217,217);
let num = 1
if( diff >= -5)p.fill(35,135,36)//grün
  p.ellipse(p.width * 0.514 - (p.width / 20 *(num)),(p.height * 0.16) + p.height * 0.02 * fibonacci(num++), p.width * 0.035 + fibonacci(num))
  if( diff >= -10)p.fill(35,135,36)//grün
  p.ellipse(p.width * 0.514 - (p.width / 20 *(num)),(p.height * 0.16) + p.height * 0.02 * fibonacci(num++), p.width * 0.035 + fibonacci(num))
  if(diff >= -15)p.fill(255,190,0)//Gelb
  p.ellipse(p.width * 0.514 - (p.width / 20 *(num)),(p.height * 0.16) + p.height * 0.02 * fibonacci(num++), p.width * 0.035 + fibonacci(num))
  if(diff >= -20)p.fill(255,190,0)//Gelb
  p.ellipse(p.width * 0.514 - (p.width / 20 *(num)),(p.height * 0.16) + p.height * 0.02 * fibonacci(num++), p.width * 0.035 + fibonacci(num))
  if( diff >= -25)p.fill(255,190,0)//Gelb
  p.ellipse(p.width * 0.514 - (p.width / 20 *(num)),(p.height * 0.16) + p.height * 0.02 * fibonacci(num++), p.width * 0.035 + fibonacci(num))
  if( diff >= -30)p.fill(210,34,34)//Rot
  p.ellipse(p.width * 0.514 - (p.width / 20 *(num)),(p.height * 0.16) + p.height * 0.02 * fibonacci(num++), p.width * 0.035 + fibonacci(num))
  if( diff >= -35)p.fill(210,34,34)//Rot
  p.ellipse(p.width * 0.514 - (p.width / 20 *(num)),(p.height * 0.16) + p.height * 0.02 * fibonacci(num++), p.width * 0.035 + fibonacci(num))
  if(diff <= -40 && diff > -50)p.fill(210,34,34)//Rot
  p.ellipse(p.width * 0.514 - (p.width / 20 *(num)),(p.height * 0.16) + p.height * 0.02 * fibonacci(num++), p.width * 0.035 + fibonacci(num))
//rechte Rheie
p.fill(217,217,217);

if( diff >= 40 && diff < 50)p.fill(210,34,34)//Rot
p.ellipse(p.width * 0.486 + (p.width / 20 *(--num)),(p.height * 0.16) + p.height * 0.02 * fibonacci(num), p.width * 0.035 + fibonacci(num+1))
if( diff >= 35)p.fill(210,34,34)//Rot
p.ellipse(p.width * 0.486 + (p.width / 20 *(--num)),(p.height * 0.16) + p.height * 0.02 * fibonacci(num), p.width * 0.035 + fibonacci(num+1))
if( diff >= 30)p.fill(210,34,34)//Rot
p.ellipse(p.width * 0.486 + (p.width / 20 *(--num)),(p.height * 0.16) + p.height * 0.02 * fibonacci(num), p.width * 0.035 + fibonacci(num+1))
if( diff >= 25)p.fill(255,190,0)//Gelb
p.ellipse(p.width * 0.486 + (p.width / 20 *(--num)),(p.height * 0.16) + p.height * 0.02 * fibonacci(num), p.width * 0.035 + fibonacci(num+1))
if( diff >= 20)p.fill(255,190,0)//Gelb
p.ellipse(p.width * 0.486 + (p.width / 20 *(--num)),(p.height * 0.16) + p.height * 0.02 * fibonacci(num), p.width * 0.035 + fibonacci(num+1))
if( diff >= 15)p.fill(255,190,0)//Gelb
p.ellipse(p.width * 0.486 + (p.width / 20 *(--num)),(p.height * 0.16) + p.height * 0.02 * fibonacci(num), p.width * 0.035 + fibonacci(num+1))
if( diff >= 10)p.fill(35,135,36)//grün
p.ellipse(p.width * 0.486 + (p.width / 20 *(--num)),(p.height * 0.16) + p.height * 0.02 * fibonacci(num), p.width * 0.035 + fibonacci(num+1))
if( diff >= 5)p.fill(35,135,36)//grün
p.ellipse(p.width * 0.486 + (p.width / 20 *(--num)),(p.height * 0.16) + p.height * 0.02 * fibonacci(num), p.width * 0.035 + fibonacci(num+1))
//console.log(diff)
  tune(p);
  if (autoCorrelateValue === -1) {
    colorText=p.color(217,217,217)
    note = "--";
    diff = -999
    return;
  }
}

function tune() {
  a4=parseInt(ref.value())
  drawNoteVisual = requestAnimationFrame(tune);
  let bufferLength = analyser.fftSize;
  let buffer = new Float32Array(bufferLength);
  analyser.getFloatTimeDomainData(buffer);
  let autoCorrelateValue = autoCorrelate(buffer, audioContext.sampleRate);
  // Handle rounding
  let valueToDisplay = autoCorrelateValue;
  let smoothingThreshold = 5;
  if (autoCorrelateValue === -1) {
    colorText=p.color(217,217,217)
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

function parametres(p) {

    ref = p.createInput("", "number");
    ref.position(cnvWidth / 2 - 200,cnvHeight+60);
    ref.value(a4);
    greeting = p.createElement('paragraph', 'A4 = ');
    greeting.position(cnvWidth / 2 - 240,cnvHeight+62);
    unity = p.createElement('paragraph', 'Hz ');
    unity.position(cnvWidth / 2 - 145,cnvHeight+62);
    ref.parent("#ref");
    ref.addClass("form-control");
    ref.style("p.width: 5em;");
    ref.attribute("min", "410");
    ref.attribute("max", "480");
    ref.attribute("p.width", "15px")
    ref.attribute("required");
    //ref.mouseOut(change_ref(parseInt(ref.value())));
  
}
function fibonacci(n) {
  if (n === 0) return 0;
  if (n === 1) return 1;
  // recursioin base
  return fibonacci(n - 2) + fibonacci(n - 1);
}
}



