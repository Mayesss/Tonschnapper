var cnv;
var btn;
var analyser, audioContext;
var autoCorrelateValue = -1;
var freq_data = [0];
var max_data = 100;
var note = "";
var previousValueToDisplay = 0;
var smoothingCount = 0;
var smoothingThreshold = 5;
var smoothingCountThreshold = 5;
var a4 = 440;
var buf = new Float32Array(1024);
var MIN_SAMPLES = 0;
var GOOD_ENOUGH_CORRELATION = 0.9;
var parameters = false;

function setup() {
  parametres();
  cnv = createCanvas(600, 320);
  var x = (windowWidth - width) / 2;
  var y = 50;
  cnv.position(x, y);
  var source;
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
    var constraints = { audio: true };
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
function windowResized() {
  resizeCanvas(windowWidth - 50, windowHeight - 20);
  var x = (windowWidth - width) / 2;
  var y = windowHeight + 150;
  cnv.position(x, y);
}

function draw() {
  background(255, 200, 255);
  fill(0, 102, 153);
  let x1 = width *0.43;
  let y1 = height*0.01;
  let x2 = width * 0.57;
  let y2 = height *0.01;
  let x3 = width *0.5;
  let y3 = height *0.2;
  
  triangle(x1, y1, x2, y2, x3, y3);
  textSize(width*0.20);
  text(note, width *0.44, height *0.650);

  ellipse(width * 0.4, height * 0.15, width * 0.07)
  ellipse(width * 0.3, height * 0.15, width * 0.07)
  ellipse(width * 0.2, height * 0.15, width * 0.07)
  ellipse(width * 0.1, height * 0.15, width * 0.07)


  tune();
  if (autoCorrelateValue === -1) {
    note = "-";
    return;
  }
  change_ref(parseInt(ref.value()));
}

function tune() {
  drawNoteVisual = requestAnimationFrame(tune);
  var bufferLength = analyser.fftSize;
  var buffer = new Float32Array(bufferLength);
  analyser.getFloatTimeDomainData(buffer);
  var autoCorrelateValue = autoCorrelate(buffer, audioContext.sampleRate);
  // Handle rounding
  var valueToDisplay = autoCorrelateValue;
  var smoothingThreshold = 10;
  if (autoCorrelateValue === -1) {
    note = "--";
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
  note = noteFromPitch(valueToDisplay);
  if (typeof valueToDisplay == "number") {
    valueToDisplay += " Hz";
  }
}
function noteFromPitch(freq) {
  var noteNum = 12 * (Math.log(freq / a4) / Math.log(2));
  var noteStrings = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];
  note = noteStrings[(Math.round(noteNum) + 69) % 12];
  return note;
}

function autoCorrelate(buf, sampleRate) {
  var SIZE = buf.length;
  var MAX_SAMPLES = Math.floor(SIZE / 2);
  var best_offset = -1;
  var best_correlation = 0;
  var rms = 0;
  var foundGoodCorrelation = false;
  var correlations = new Array(MAX_SAMPLES);
  for (var i = 0; i < SIZE; i++) {
    var val = buf[i];
    rms += val * val;
  }
  rms = Math.sqrt(rms / SIZE);
  if (rms < 0.01)
    // not enough signal
    return -1;

  var lastCorrelation = 1;
  for (var offset = MIN_SAMPLES; offset < MAX_SAMPLES; offset++) {
    var correlation = 0;

    for (var i = 0; i < MAX_SAMPLES; i++) {
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
      var shift =
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
  //	var best_frequency = sampleRate/best_offset;
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
