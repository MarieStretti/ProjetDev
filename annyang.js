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
     annyang.addCommands({
       'gauche': function() {
         console.log("gauche");
         var xmin = view.extent.xmin.toFixed(2);
         var xmax = view.extent.xmax.toFixed(2);
         var x_range = xmax - xmin;
         var x_new = xmin - (x_range/6);
         view.center.x = x_new;
         view.goTo({
           target: view.center,
         });
         }
     });

     //Déplacement de la vue pour voir la partie plus à droite
     annyang.addCommands({
      'droite': function() {
        console.log("droite");
        var xmin = view.extent.xmin.toFixed(2);
        var xmax = view.extent.xmax.toFixed(2);
        var x_range = xmax - xmin;
        var x_new = xmax + (x_range/6);
        view.center.x = x_new;
        view.goTo({
          target: view.center,
        });
        }
     });


  //Déplacement de la vue pour voir la partie plus en haut
     annyang.addCommands({
      'monte': function() {
        console.log("haut");
        var ymin = view.extent.ymin.toFixed(2);
        var ymax = view.extent.ymax.toFixed(2);
        var y_range = ymax - ymin;
        var y_new = ymax + (y_range/6);
        view.center.y = y_new;
        view.goTo({
          target: view.center,
        });
        }
     });

  //Déplacement de la vue pour voir la partie plus à gauche
     annyang.addCommands({
        'descend': function() {
          console.log("bas");
          var ymin = view.extent.ymin.toFixed(2);
          var ymax = view.extent.ymax.toFixed(2);
          var y_range = ymax - ymin;
          var y_new = ymin - (y_range/6);
          view.center.y = y_new;
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
