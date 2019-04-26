
meSpeak.loadConfig("mespeak_config.json");
meSpeak.loadVoice('voices/fr.json');


p1.addEventListener('mouseover',function(){
  var string = ""+p1.innerHTML;
  meSpeak.speak(string,{ variant: 'f1'});

},false);


p2.addEventListener('mouseover',function(){
  var string = ""+p2.innerHTML;
  meSpeak.speak(string,{ variant: 'f1'});

},false);


p3.addEventListener('mouseover',function(){
  var string = ""+p3.innerHTML;
  meSpeak.speak(string,{ variant: 'f1'});

},false);



boutonGares.addEventListener('click',function(){
  var string = " Vous rechercher la station "+nom_gares.value;
  meSpeak.speak(string,{ variant: 'f3'});

},false);
