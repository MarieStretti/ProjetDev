
meSpeak.loadConfig("mespeak_config.json");
meSpeak.loadVoice('voices/fr.json');

document.getElementById('btn').addEventListener('click',function(){
  meSpeak.speak('RER A, métro',{ variant: 'm1'});

})
