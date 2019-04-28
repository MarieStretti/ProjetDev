lecture_audio = 0;
var lecture = document.getElementById('lecture');
var audio = document.getElementById('audio');

lecture.addEventListener('change', function(){
  if(lecture.checked){
    lecture_audio = 1;
    audio.innerHTML = '<audio autoplay volume="60"> <source src="audio/lecture_audio_activee.wav" </audio>';
  }
  else{
    lecture_audio = 0;
    audio.innerHTML =  '<audio autoplay volume="60"> <source src="audio/lecture_audio_desactivee.wav" </audio>';
  }

});


meSpeak.loadConfig("mespeak_config.json");
meSpeak.loadVoice('voices/fr.json');


p1.addEventListener('mouseover',function(){
  if(lecture_audio ==1 ){
  var string = ""+p1.innerHTML;
  meSpeak.speak(string,{ variant: 'f2',speed:150,wordgap:5});
}
},false);


p2.addEventListener('mouseover',function(){
  if(lecture_audio ==1 ){
  var string = ""+p2.innerHTML;
  meSpeak.speak(string,{ variant: 'f2',speed:150,wordgap:5});
}

},false);


p3.addEventListener('mouseover',function(){
  if(lecture_audio ==1 ){
  var string = ""+p3.innerHTML;
  meSpeak.speak(string,{ variant: 'f2',speed:150,wordgap:5});
}

},false);



boutonGares.addEventListener('click',function(){
  if(lecture_audio ==1 ){
  audio.innerHTML ='<audio autoplay volume="60"> <source src="audio/vous_rechercher_la_gare.wav" </audio>';
  var valeur = nom_gares.value;
  setTimeout(speak , 2300);
  function speak(){
    meSpeak.speak(valeur,{ variant: 'f2',speed:150,wordgap:5});
  }

}

},false);


boutonRER.addEventListener('mouseover', function() {
  if(lecture_audio == 1 ){
    audio.innerHTML ='<audio autoplay volume="60"> <source src="audio/rer.wav" </audio>';
}
}, false);


boutonMetro.addEventListener('mouseover', function() {
  if(lecture_audio == 1 ){
    audio.innerHTML = '<audio autoplay volume="60"> <source src="audio/metro.wav" </audio>';
}
}, false);


boutonRecherche.addEventListener('mouseover', function() {
  if(lecture_audio == 1 ){
    audio.innerHTML = '<audio autoplay volume="60"> <source src="audio/rechercher_une_gare.wav" </audio>';
}
}, false);


surbrillance.addEventListener('change', function() {
  if(lecture_audio == 1 ){
    if(surbrillance.checked){
      audio.innerHTML = '<audio autoplay volume="60"> <source src="audio/surbrillance_activee.wav" </audio>';
    }
    else {
      audio.innerHTML = '<audio autoplay volume="60"> <source src="audio/surbrillance_desactivee.wav" </audio>';
    }
}
}, false);

cadre.addEventListener('change', function() {
  if(lecture_audio == 1 ){
    if(cadre.checked){
      audio.innerHTML = '<audio autoplay volume="60"> <source src="audio/cadre_active.wav" </audio>';
    }
    else {
      audio.innerHTML = '<audio autoplay volume="60"> <source src="audio/cadre_desactive.wav" </audio>';
    }
}
}, false);

commande.addEventListener('change', function() {
  if(lecture_audio == 1 ){
    if(commande.checked){
      audio.innerHTML =  '<audio autoplay volume="60"> <source src="audio/commande_vocale_activee.wav" </audio>';
    }
    else {
      audio.innerHTML = '<audio autoplay volume="60"> <source src="audio/commande_vocale_desactivee.wav" </audio>';
    }
}
}, false);
