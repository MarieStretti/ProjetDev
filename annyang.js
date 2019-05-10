/**
 * 
 * 
 * @param {*} view 
 * @param {*} map 
 */
function commande_voc (view,map){

   console.log('annyang commande going');

   annyang.setLanguage('fr-FR');

   if (!annyang) {
     console.log("La commande vocale ne fonctionne pas");
   }

   if (annyang) {
     // Ajout des commandes vocales

     //Zoom d'un niveau
     annyang.addCommands({
       'plus': function() {
         console.log("plus");
         console.log(zoomlevel);
         zoomlevel = view.zoom+1;
         console.log(zoomlevel);
         view.zoom= zoomlevel;
         }
     });

     //DéZoom d'un niveau
     annyang.addCommands({
       'moins': function() {
         console.log("moins");
         console.log(zoomlevel);
         zoomlevel = view.zoom-1;
         console.log(zoomlevel);
         view.zoom= zoomlevel;
         }
     });

     //Déplacement de la vue pour voir la partie plus à gauche
     var commandegauche1 = {'gauche': gaucheFunction};
     var commandegauche2 = {'vers l Ouest': gaucheFunction};
     var commandegauche3 = {'Ouest': gaucheFunction};
     var commandegauche4 = {'vers la gauche': gaucheFunction};

     function gaucheFunction(){
        console.log("gauche");
        var xmin = view.extent.xmin.toFixed(2);
        var xmax = view.extent.xmax.toFixed(2);
        var x_range = xmax - xmin;
        var x_new = xmin - (x_range/6);
        view.center.x = x_new;
        view.goTo({
          target: view.center,
        });
    };
    
     annyang.addCommands(commandegauche1);
     annyang.addCommands(commandegauche2);
     annyang.addCommands(commandegauche3);
     annyang.addCommands(commandegauche4);


     //Déplacement de la vue pour voir la partie plus à droite
     var commandedroite1 = {'droite': droiteFunction};
     var commandedroite2 = {'vers l Est': droiteFunction};
     var commandedroite3 = {'Est': droiteFunction};
     var commandedroite4 = {'vers la droite': droiteFunction};
     function droiteFunction(){
        console.log("droite");
        var xmin = view.extent.xmin.toFixed(2);
        var xmax = view.extent.xmax.toFixed(2);
        var x_range = xmax - xmin;
        var x_new = xmax + (x_range/6);
        view.center.x = x_new;
        view.goTo({
          target: view.center,
        });
      };
      annyang.addCommands(commandedroite1);
      annyang.addCommands(commandedroite2);
      annyang.addCommands(commandedroite3);
      annyang.addCommands(commandedroite4);


  //Déplacement de la vue pour voir la partie plus en haut
    var commandehaut1 = {'monte': hautFunction};
    var commandehaut3 = {'vers le haut': hautFunction};
    var commandehaut5 = {'Nord': hautFunction};
    var commandehaut6 = {'vers le Nord': hautFunction};
    function hautFunction(){
      console.log("haut");
      var ymin = view.extent.ymin.toFixed(2);
      var ymax = view.extent.ymax.toFixed(2);
      var y_range = ymax - ymin;
      var y_new = ymax + (y_range/6);
      view.center.y = y_new;
      view.goTo({
        target: view.center,
      });
    };
    annyang.addCommands(commandehaut1);
    annyang.addCommands(commandehaut3);
    annyang.addCommands(commandehaut5);
    annyang.addCommands(commandehaut6);



   //Déplacement de la vue pour voir la partie plus en bas
    var commandebas1 = {'descend': basFunction};
    var commandebas2 = {'bas': basFunction};
    var commandebas3 = {'vers le bas': basFunction};
    var commandebas4 = {'plus bas': basFunction};
    var commandebas5 = {'Sud': basFunction};
    var commandebas6 = {'vers le Sud': basFunction};
    function basFunction(){
          console.log("bas");
          var ymin = view.extent.ymin.toFixed(2);
          var ymax = view.extent.ymax.toFixed(2);
          var y_range = ymax - ymin;
          var y_new = ymin - (y_range/6);
          view.center.y = y_new;
          view.goTo({
            target: view.center,
          });
      };
    annyang.addCommands(commandebas1);
    annyang.addCommands(commandebas2);
    annyang.addCommands(commandebas3);
    annyang.addCommands(commandebas4);
    annyang.addCommands(commandebas5);
    annyang.addCommands(commandebas6);


   //DE-activation Surbrillance
    var commandesurb1 = {'Recherche': SurbFunction};
    var commandesurb2 = {'activer Recherche': SurbFunction};
    var commandesurb3 = {'voir Recherche': SurbFunction};
    var commandesurb4 = {'cocher Recherche': SurbFunction};
    var commandesurb5 = {'Rechercher': SurbFunction};
    function SurbFunction(){
          console.log("Rechercher changed");
          document.getElementById('surbrillance').click();
    };
    annyang.addCommands(commandesurb1);
    annyang.addCommands(commandesurb2);
    annyang.addCommands(commandesurb3);
    annyang.addCommands(commandesurb4);
    annyang.addCommands(commandesurb5);


    //DE-activation Cadre
     var commandecadre1 = {'Cadre': CadreFunction};
     var commandecadre2 = {'activer Cadre': CadreFunction};
     var commandecadre3 = {'voir Cadre': CadreFunction};
     var commandecadre4 = {'cocher Cadre': CadreFunction};
     function CadreFunction(){
           console.log("Cadre changed");
           document.getElementById('cadre').click();
     };
     annyang.addCommands(commandecadre1);
     annyang.addCommands(commandecadre2);
     annyang.addCommands(commandecadre3);
     annyang.addCommands(commandecadre4);


     //DE-activation Commande vocale
      var commandevoc1 = {'Commande vocale': CmdVocFunction};
      var commandevoc2 = {'activer commande vocale': CmdVocFunction};
      var commandevoc3 = {'voir commande vocale': CmdVocFunction};
      var commandevoc4 = {'cocher commande vocale': CmdVocFunction};
      function CmdVocFunction(){
            console.log("Commande vocale changed");
            document.getElementById('commande').click();
      };
      annyang.addCommands(commandevoc1);
      annyang.addCommands(commandevoc2);
      annyang.addCommands(commandevoc3);
      annyang.addCommands(commandevoc4);


      //DE-activation Lecture Audio
       var commandelect1 = {'Lecture Audio': CmdLectureAudio};
       var commandelect2 = {'activer Lecture Audio': CmdLectureAudio};
       var commandelect3 = {'voir Lecture Audio': CmdLectureAudio};
       var commandelect4 = {'cocher Lecture Audio': CmdLectureAudio};
       function CmdLectureAudio(){
             console.log("Lecture Audio changed");
             document.getElementById('lecture').click();
       };
       annyang.addCommands(commandelect1);
       annyang.addCommands(commandelect2);
       annyang.addCommands(commandelect3);
       annyang.addCommands(commandelect4);


   }

 }

 /**
  * 
  * @param {*} checkboxElem 
  */
 function alertannyang(checkboxElem) {
  if (checkboxElem.checked) {
    annyang.start({autoRestart : true});
    console.log('commande started');
  } else {
    annyang.abort();
    console.log('commande stoped');
  }
}
