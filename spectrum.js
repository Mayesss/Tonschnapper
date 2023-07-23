let formattedNote = ""

var spectrumSketch = function (p) {
  // Global variables
  var bufferLength;
  var dataArray;
var isSnapped = false
var shouldUpdate = false
  // Initial setup
  p.setup = function () {
    // Create the canvas

      cnvWidth = p.windowWidth * 0.98
      cnvHeight = cnvWidth / cnvRtaio
      
  
    cnv = p.createCanvas(cnvWidth, cnvHeight);
    let x = (p.windowWidth - p.width) / 2;
    let y = 60;
    cnv.position(x, y);

    //mic
    let source;
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.minDecibels = -100;
    analyser.maxDecibels = -10;
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.85;
    bufferLength = analyser.fftSize;
    dataArray = new Uint8Array(bufferLength);
    snappedArray = new Uint8Array(bufferLength); // Initialize snappedArray

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
        })
        .catch(function (err) {
          alert("err mic " + err);
        });
    }
  };

  // Execute the sketch
  p.draw = function () {
    // mic button
    p.background(255, 255, 255);
    micButton = p.createButton('<i class="fa-solid fa-microphone">');
    micButton.position(p.width / 2 - 20, p.height + 45);
    micButton.class("round-button");
    micButton.mousePressed(p.setup);

    //snapButton
        // Create the button to toggle snapping
        var snapButton = p.createButton("Schnappen");
        snapButton.position(p.width / 2 - 200, p.height + 60);
        snapButton.mousePressed(function () {
          isSnapped = !isSnapped;
          shouldUpdate = !shouldUpdate // Toggle the snapping state
        });
    // Get frequency data
    analyser.getByteFrequencyData(dataArray);
    const dominantPeakIndex = findDominantPeakIndex(dataArray);
            // Convert the index to the corresponding frequency
            const sampleRate = audioContext.sampleRate;
            const binWidth = sampleRate / analyser.fftSize;
            const dominantFrequency = dominantPeakIndex * binWidth;
            note = noteFromPitch(dominantFrequency).note ;
            diff = noteFromPitch(dominantFrequency).cents
/*             console.log("Dominant Frequency:", dominantFrequency);
console.log(dominantPeakIndex) */
    // Clean the canvas
    p.background(255);
     formattedNote = note;

     if (diff < -5 ){
     const numMinus = Math.floor(diff / 5);
    // Add "-" symbols on the left
    for (let i = 0; i < Math.abs(numMinus); i++) {
      formattedNote = "-" + formattedNote;
    }}else if (diff > 5){
      const numPlus = Math.floor(diff / 5);

    // Add "+" symbols on the right
    for (let i = 0; i < numPlus; i++) {
      formattedNote = formattedNote + "+";
    }
  }
//console.log(note)
p.fill(255,255,255)
p.textFont('Inter bolds');
p.textSize(p.width * 0.02);
p.text(formattedNote, p.width * 0.5, p.height * 0.10 );
p.fill(217,217,217);
p.textSize(11);

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

    //snap
    if (isSnapped) {
   
      // Visualization for the snapped spectrum
      var barWidth = p.width / bufferLength;
      p.fill(0);
      p.stroke(0);
      p.strokeWeight(2);
      for (var i = 2; i < bufferLength + 2; i++) {
        var logIndex = p.log(i + 1) / p.log(bufferLength); // Map index to a logarithmic scale
        var barHeight = snappedArray[i];
        p.rect(logIndex * p.width, p.height - 20, barWidth, -barHeight);
      }
           // Visualization for the live spectrum
           var barWidth = p.width / bufferLength;
           for (var i = 2; i < bufferLength + 2; i++) {
             var logIndex = p.log(i + 1) / p.log(bufferLength); // Map index to a logarithmic scale
             var barHeight = dataArray[i];

             p.stroke(255, barHeight, 255,150)
             p.fill(0, barHeight, 0,100); // Green color with 200 alpha (transparency)
             p.rect(logIndex * p.width, p.height - 20, barWidth, -barHeight);
           }
    } else {
      // Visualization for the live spectrum
      var barWidth = p.width / bufferLength;
      for (var i = 2; i < bufferLength + 2; i++) {
        var logIndex = p.log(i + 1) / p.log(bufferLength); // Map index to a logarithmic scale
        var barHeight = dataArray[i] ;
        p.fill(0, barHeight, 0, 100); // Green color with 200 alpha (transparency)
        p.rect(logIndex * p.width, p.height - 20, barWidth, -barHeight);
      }
    }


    // Draw the underline with frequencies
    p.stroke(0);
    p.strokeWeight(2);
    for (var freq = 20; freq <= 20000; freq *= 10) {
      var logFreq = p.log(freq / 20) / p.log(20000 / 20); // Map frequency to a logarithmic scale
      var x = (logFreq * p.width ) +80;
      p.fill(217,217,217)
      p.line(x, p.height-20, x, p.height -18);
      p.textAlign(p.CENTER, p.TOP);
      p.text(freq + " Hz", x, p.height - 15);
    }

    // Draw the vertical line for dB levels
    var dBLevel = analyser.maxDecibels;
    var dBStep = (analyser.maxDecibels - analyser.minDecibels) / 10;
    var ydB = p.map(dBLevel, analyser.minDecibels, analyser.maxDecibels, p.height, 0);
    p.stroke(0);

    p.line(0, ydB, 0, ydB);
    p.fill(217,217,217)
    // Draw labels for dB levels
    p.textSize(8);
    p.textAlign(p.RIGHT -20, p.CENTER);
    for (var i = 0; i <= 10; i++) {
      var dBValue = analyser.maxDecibels - i * dBStep;
      var ydBValue = p.map(dBValue, analyser.minDecibels, analyser.maxDecibels, p.height, 0);
      p.text(dBValue.toFixed(1) + " dB", 30, ydBValue -20);
    }
  };
  function findDominantPeakIndex(array) {
    let maxIndex = 0;
    let maxValue = array[0];
    for (let i = 1; i < array.length; i++) {
      if (array[i] > maxValue) {
        maxIndex = i;
        maxValue = array[i];
      }
    }
    return maxIndex;
  }
  p.mousePressed = function () {
    if (isSnapped) {
      // Copy the live data (dataArray) to snappedArray when the button is pressed
      for (var i = 0; i < bufferLength; i++) {
        snappedArray[i] = dataArray[i];
      }
    }
  };
};
