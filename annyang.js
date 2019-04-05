 function commande_voc (view,map){

   annyang.setLanguage('fr-FR');

   if (!annyang) {
     console.log("La commande vocale ne fonctionne pas");
   }

   if (annyang) {
     // Ajout commande
     annyang.addCommands({
       'bonjour': function() { alert('Hello world!'); }
     });

     annyang.addCommands({
       'plus': function() {
         console.log("tu as dit plus");
         console.log(zoomlevel);
         zoomlevel = view.zoom+1;
         console.log(zoomlevel);
         view.zoom= zoomlevel;
         }
     });

     annyang.addCommands({
       'moins': function() {
         console.log("tu as dit moins");
         console.log(zoomlevel);
         zoomlevel = view.zoom-1;
         console.log(zoomlevel);
         view.zoom= zoomlevel;
         }
     });

     annyang.addCommands({
       'gauche': function() {
         console.log("tu as dit gauche");
         lng_c = view.center.longitude - 1;
         view.center.longitude = lng_c;
         view.goTo({
           target: view.center,
         });
         }
     });




     // Utilisation du visuel KITT pour l'aide vocale annyang utilisé
     SpeechKITT.annyang();

     // Definition de stylesheet pour KITT
     SpeechKITT.setStylesheet('//cdnjs.cloudflare.com/ajax/libs/SpeechKITT/0.3.0/themes/flat.css');

     // Render KITT's interface
     SpeechKITT.vroom();
   }

 }
