lecture_audio = 0;
var lecture = document.getElementById('lecture');
var audio = document.getElementById('audio');

/**
 * Au clic du bouton correspondant, active le fichier audio 'lecture audio activee' ou 'lecture audio desactive'
 *
 */
lecture.addEventListener('change', function(){
  if(lecture.checked){
    lecture_audio = 1;
    audio.innerHTML = '<audio autoplay> <source src="audio/lecture_audio_activee.wav"/> </audio>';
  }
  else{
    lecture_audio = 0;
    audio.innerHTML =  '<audio autoplay> <source src="audio/lecture_audio_desactivee.wav"/> </audio>';
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


/**
 * Au clic du bouton correspondant, active le fichier audio 'rechercher la gare'
 *
 */
boutonGares.addEventListener('click',function(){
  if(lecture_audio ==1 ){
    audio.innerHTML ='<audio autoplay> <source src="audio/vous_rechercher_la_gare.wav"/> </audio>';
    var valeur = nom_gares.value;
    setTimeout(speak , 2300);
    function speak(){
      meSpeak.speak(valeur,{ variant: 'f2',speed:150,wordgap:5});
    }
  }
},false);

/**
 * Au clic du bouton correspondant, active le fichier audio 'rer'
 *
 */
boutonRER.addEventListener('mouseover', function() {
  if(lecture_audio == 1 ){
    audio.innerHTML ='<audio autoplay> <source src="audio/rer.wav" /> </audio>';
    audio.firstElementChild.volume = 0.7;
  }
}, false);

/**
 * Au clic du bouton correspondant, active le fichier audio 'metro'
 *
 */
boutonMetro.addEventListener('mouseover', function() {
  if(lecture_audio == 1 ){
    audio.innerHTML = '<audio autoplay> <source src="audio/metro.wav"/> </audio>';
    audio.firstElementChild.volume = 0.7;
  }
}, false);

/**
 * Au clic du bouton correspondant, active le fichier audio 'rechercher une gare'
 *
 */
boutonRecherche.addEventListener('mouseover', function() {
  if(lecture_audio == 1 ){
    audio.innerHTML = '<audio autoplay> <source src="audio/rechercher_une_gare.wav"/> </audio>';
  }
}, false);

/**
 * Au clic du bouton correspondant, active le fichier audio 'surbrillance activee' ou 'surbrillance activee'
 *
 */
surbrillance.addEventListener('change', function() {
  if(lecture_audio == 1 ){
    if(surbrillance.checked){
      audio.innerHTML = '<audio autoplay> <source src="audio/recherche_activee.wav"/> </audio>';
      audio.firstElementChild.volume = 0.4;
    }
    else {
      audio.innerHTML = '<audio autoplay> <source src="audio/recherche_desactivee.wav"/> </audio>';
      audio.firstElementChild.volume = 0.4;
    }
  }
}, false);

/**
 * Au clic du bouton correspondant, active le fichier audio 'cadre active' ou 'cadre desactive'.
 *
 */
cadre.addEventListener('change', function() {
  if(lecture_audio == 1 ){
    if(cadre.checked){
      audio.innerHTML = '<audio autoplay> <source src="audio/cadre_active.wav" /> </audio>';
    }
    else {
      audio.innerHTML = '<audio autoplay> <source src="audio/cadre_desactive.wav"/> </audio>';
    }
  }
}, false);

/**
 * Au clic du bouton correspondant, active le fichier audio 'commande vocale activee' ou 'commande vocale desactivee'
 *
 */
commande.addEventListener('change', function() {
  if(lecture_audio == 1 ){
    if(commande.checked){
      audio.innerHTML =  '<audio autoplay> <source src="audio/commande_vocale_activee.wav"/> </audio>';
    }
    else {
      audio.innerHTML = '<audio autoplay> <source src="audio/commande_vocale_desactivee.wav"/> </audio>';
    }
  }
}, false);



var home = document.getElementById("maison");

/**
 * Au passage de la souris sur le bouton, cela active le fichier audio 'retour page d'accueil'
 *
 */
home.addEventListener('mouseover', function() {
  if(lecture_audio == 1 ){

      audio.innerHTML = '<audio autoplay> <source src="audio/retour_page_accueil.wav" /></audio>';
      audio.firstElementChild.volume = 0.4;
  }
}, false);


var help = document.getElementById("help");

/**
 * Au passage de la souris sur le bouton, cela active le fichier audio 'aide'
 *
 */

help.addEventListener('mouseover', function() {
  if(lecture_audio == 1 ){

      audio.innerHTML =  '<audio autoplay> <source src="audio/aide.wav"/> </audio>';
      audio.firstElementChild.volume = 0.4;
  }
}, false);



var carte_topo = document.getElementById("carte_topo");

/**
 * Au clic du bouton correspondant, active le fichier audio 'fond active' ou 'fond desactive'.
 *
 */
carte_topo.addEventListener('change', function() {
  if(lecture_audio == 1 ){
    if(carte_topo.checked){
      audio.innerHTML = '<audio autoplay> <source src="audio/fond_active.wav"/> </audio>';
      audio.firstElementChild.volume = 0.4;
    }
    else {
      audio.innerHTML = '<audio autoplay> <source src="audio/fond_desactive.wav"/> </audio>';
      audio.firstElementChild.volume = 0.4;
    }
  }
}, false);



var loupe = document.getElementById("loupe");


/**
 * Au clic du bouton correspondant, active le fichier audio 'loupe' activee' ou 'loupe desactivee'
 *
 */

loupe.addEventListener('change', function() {
  if(lecture_audio == 1 ){
    if(view.magnifier.visible == true){
      audio.innerHTML =  '<audio autoplay> <source src="audio/loupe_activee.wav"/> </audio>';
      audio.firstElementChild.volume = 0.4;
    }
    else {
      audio.innerHTML = '<audio autoplay> <source src="audio/loupe_desactivee.wav"/> </audio>';
      audio.firstElementChild.volume = 0.4;
    }
  }
}, false);
