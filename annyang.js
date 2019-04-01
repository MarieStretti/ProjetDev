// choose language
annyang.setLanguage('fr-FR');


if (!annyang) {
  console.log("Speech Recognition is not supported");
}
if (annyang) {
  // Add our commands to annyang
  annyang.addCommands({
    'bonjour': function() { alert('Hello world!'); }
  });



  // Tell KITT to use annyang
  SpeechKITT.annyang();

  // Define a stylesheet for KITT to use
  SpeechKITT.setStylesheet('//cdnjs.cloudflare.com/ajax/libs/SpeechKITT/0.3.0/themes/flat.css');

  // Render KITT's interface
  SpeechKITT.vroom();
}
