// chromium-browser --disable-web-security --user-data-dir="[file:///C:/Users/Marie/Documents/ENSG/2eme_annee/ProjetDev/Developpement/Client/test]"
// header('Access-Control-Allow-Origin: *');
// Access-Control-Allow-Origin *

meSpeak.loadConfig("mespeak_config.json");
meSpeak.loadVoice('voices/fr.json');

document.getElementById('btn').addEventListener('click',function(){
  meSpeak.speak('r e r a, métro',{ variant: 'klatt'});

})
