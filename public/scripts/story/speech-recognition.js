define(function (require, exports, module) {

var setCursor = require('./set-cursor');

var root = window
  , firstCharOfSentence = /(^\S)|([\.\?!]\s+\S)/g
  , getElementsByClass = document.getElementsByClassName.bind(document)
  , transcript = ''
  , recognition, micIcon, transcriptElement, interimElement;

// Get the SpeechRecognition object, while handling browser prefixes
var SpeechRecognition =
  root.SpeechRecognition ||
  root.webkitSpeechRecognition ||
  root.mozSpeechRecognition ||
  root.msSpeechRecognition;

function capitalize(s) {
  return s.replace(firstCharOfSentence, function toUpperCase(m) { return m.toUpperCase(); });
}

function clearTranscript() {
  transcript = '';
}

function addSpeechToInput(event) {
  var interim = '';
  var i = event.resultIndex;
  var results = event.results[i];

  if (transcript.length > 0) {
    var lastChar = transcript[transcript.length - 1];
    if (lastChar == '.' || lastChar == '?' || lastChar == '!') {
      transcript += ' ';
    }
  }

  while (results) {
    // get the transcript for the sole "alternative" (default for num alternatives is 1)
    if (results.isFinal) {
      transcript += results[0].transcript;
    } else {
      interim += results[0].transcript;
    }

    results = event.results[++i];
  }

  transcriptElement.textContent = capitalize(transcript);

  interimElement.textContent = interim;
  transcriptElement.appendChild(interimElement);

  setCursor.call(transcriptElement);
}

function recognitionStarted() {
  micIcon.className += ' recording';
}

function recognitionEnded() {
  var index = micIcon.className.indexOf(' recording');
  if (index > -1) {
    micIcon.className = micIcon.className.substring(0, index);
  }
}

function recognitionError() {
  transcript = transcriptElement.textContent;
  micIcon.className = 'fa fa-microphone-slash fa-2x';
}

function stopRecognition() {
  // replace click event listener with one to turn recognition on
  micIcon.removeEventListener('click', stopRecognition);
  micIcon.addEventListener('click', startRecognition);

  recognition.stop();
}

function startRecognition() {
  // replace click event listener with one to turn recognition off
  micIcon.removeEventListener('click', startRecognition);
  micIcon.addEventListener('click', stopRecognition);

  recognition = new SpeechRecognition();
  recognition.onresult = addSpeechToInput;
  recognition.onstart = recognitionStarted;
  recognition.onend = recognitionEnded;
  recognition.onerror = recognitionError;
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.start();
}

function enableSpeechRecognition() {
  micIcon = getElementsByClass('fa-microphone')[0];
  transcriptElement = getElementsByClass('paragraph-input')[0];
  interimElement = document.createElement('span');
  interimElement.className = 'interim-text';

  if (!SpeechRecognition) {
    micIcon.style.display = 'none';
    return;
  }

  micIcon.addEventListener('click', startRecognition);

  transcriptElement.addEventListener('input', function updateTranscript() {
    transcript = transcriptElement.textContent;
  });
}

module.exports = {
  enableSpeech: enableSpeechRecognition,
  clearTranscript: clearTranscript
};

});
