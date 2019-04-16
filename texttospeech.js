
meSpeak.loadConfig("mespeak_config.json");
meSpeak.loadVoice('voices/fr.json');

document.getElementById('btn').addEventListener('click',function(){
  meSpeak.speak('r e r a, métro',{ variant: 'klatt'});

})
