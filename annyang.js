 function commande_voc (view,map){

   annyang.setLanguage('fr-FR');

   if (!annyang) {
     console.log("La commande vocale ne fonctionne pas");
   }

   if (annyang) {
     // Ajout des commandes vocales
     annyang.addCommands({
       'bonjour': function() { alert('Hello world!'); }
     });

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

   }

 }

 function alertannyang(checkboxElem) {
  if (checkboxElem.checked) {
    annyang.start();
    console.log('started');
  } else {
    annyang.pause();
    console.log('stoped');
  }
}