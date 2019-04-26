var cadreNord = document.getElementById("cadreNord");
var cadreOuest = document.getElementById("cadreOuest");
var cadreEst = document.getElementById("cadreEst");
var cadreSud = document.getElementById("cadreSud");
//var boutonCadre = document.getElementById("boutonCadre");

function alertcadre(checkboxElem) {
 if (checkboxElem.checked) {
   cadreNord.style.display = "flex";
   cadreOuest.style.display = "flex";
   cadreEst.style.display = "flex";
   cadreSud.style.display = "flex";
  // boutonCadre.style.display = "flex";

 } else {
    cadreOuest.style.display = "none";
    cadreNord.style.display = "none";
    cadreEst.style.display = "none";
    cadreSud.style.display = "none";
  //  boutonCadre.style.display = "none";
 }
};

function executeCadre(view, map, gare, gareRenderer_defaut){

require([
    "esri/Map",
    "esri/views/MapView",
    "esri/WebMap",
    "esri/layers/FeatureLayer",
    "esri/core/promiseUtils",
    "esri/tasks/support/Query",
    "esri/Graphic",
    "esri/layers/GraphicsLayer",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleFillSymbol",
    "esri/renderers/UniqueValueRenderer",
    "esri/Color",
    "esri/symbols/WebStyleSymbol",
    "dojo/domReady!"

  ], function (Map, MapView, WebMap, FeatureLayer, Query, QueryTask, Graphic, GraphicsLayer, SimpleLineSymbol, SimpleFillSymbol,
        UniqueValueRenderer, Color, WebStyleSymbol) {


          /// CADRE DE COULEUR
          var cadreNord  = document.getElementById('cadreNord');
          var cadreOuest = document.getElementById('cadreOuest');
          var cadreEst   = document.getElementById('cadreEst');
          var cadreSud   = document.getElementById('cadreSud');


          /// préparation des projections de coordonnées avec proj4
          var wgs84 = proj4.Proj('EPSG:4326');

          proj4.defs("EPSG:2154","+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");

          var lambert93 = proj4.Proj("EPSG:2154");

          /// stockage des coordonnées de TOUS LES POINTS de la couche sur laquelle on compte les éléments
          var query = gare.createQuery();
          query.outFields = ["x","y"];
          gare.queryFeatures(query).features;
          var liste_points = [];
          gare.queryFeatures(query).then(function(response){
            response.features.forEach(function(item){
                liste_points.push([item.attributes.x,item.attributes.y]); // on rajoute les couples [x,y] aux coordonnées
            });
          });

          ///////// au clic : activation du cadre ///////////////////////:
          function RefreshCadre() {
            console.log("refresh");
          ////  coordonnées d'emprise actuelle de la carte /////

            var size   =  view.size; // emprise en pixels de la carte
            var width  = size[1]; // longueur de la carte
            var height = size[0]; // largeur de la carte
            var pix_x_center = height/2;
            var pix_y_center = width/2;

            var lat_center = view.toMap({x: pix_x_center, y:pix_y_center}).latitude;
            var lon_center = view.toMap({x: pix_x_center, y:pix_y_center}).longitude;
            // dimensions du polygone d'emprise
            var dx = (height/2);
            var dy = (width/2);

            var pix_x_ouest = pix_x_center - dx;
            var pix_x_est = pix_x_center + dx;
            var pix_y_nord = pix_y_center - dy; /// pixels != lon/lat !!!!!
            var pix_y_sud = pix_y_center + dy;

            // coordonnées des 'coins' de la carte en pixels > 80% de l'emprise environ
            var lat_nord = view.toMap({x: pix_x_est, y:pix_y_nord}).latitude;
            var lat_sud = view.toMap({x: pix_x_est, y:pix_y_sud}).latitude;
            var lon_ouest = view.toMap({x: pix_x_ouest, y:pix_y_nord}).longitude;
            var lon_est = view.toMap({x: pix_x_est, y:pix_y_nord}).longitude;



            //// CONVERSION DE COORDONNES D'EMPRISE AVEC PROJ4 //////
            var coord_conv_centre = proj4(wgs84,lambert93,[lon_center,lat_center]);
            var coord_conv_SO = proj4(wgs84,lambert93,[lon_ouest,lat_sud]); // lon lat : point sud ouest
            var coord_conv_NE = proj4(wgs84,lambert93,[lon_est,lat_nord]); // lon lat : point nord est

            var x_center = coord_conv_centre[0];
            var y_center = coord_conv_centre[1];
            var y_nord  = coord_conv_NE[1];
            var x_est   = coord_conv_NE[0];
            var y_sud   = coord_conv_SO[1];
            var x_ouest = coord_conv_SO[0];


            ////////// CONDITIONS DE DISTANCE SUR LES POINTS
            var emprise_x = Math.abs(x_est-x_ouest);
            var emprise_y = Math.abs(y_nord-y_sud);


            /// les points à un certain rayon du centre de la carte ne sont pas pris en compte
            // ici on pose le rayon à 3 fois l'emprise actuelle de la carte
            var rayon_max = Math.max(3*emprise_x, 3*emprise_y);

            // initialisation des conteneurs du nombre des points dans chaque direction
            var points_NSEO = [0,0,0,0];
            var cadres_NSEO = [cadreNord, cadreSud, cadreEst,cadreOuest];


          //////// DETECTION DE LA POSITION DES POINTS   /////////
          for (var i = 0; i < liste_points.length; i++) {

            var x = liste_points[i][0]; /// EN LAMBERT 93
            var y = liste_points[i][1]; /// EN LAMBERT 93

            //filtre sur la distance : variable rayon_max
            if (Math.abs(x_center-x) <= rayon_max && Math.abs(y_center-y) <= rayon_max){


              if (x < x_ouest){
                if (y > y_nord){ // NORD-OUEST
                  points_NSEO[3] += 0.5;
                  points_NSEO[0] += 0.5;
                }else if (y < y_sud) { // SUD-OUEST
                  points_NSEO[3] += 0.5;
                  points_NSEO[1] += 0.5;
                }else{ // OUEST
                  points_NSEO[3] +=1;
                }
              }

              else if (x > x_est){
                if (y > y_nord){ // NORD-EST
                  points_NSEO[2] += 0.5;
                  points_NSEO[0] += 0.5;
                }else if (y < y_sud) { // SUD-EST
                  points_NSEO[2] += 0.5;
                  points_NSEO[1] += 0.5;
                }
                else { // EST
                  points_NSEO[2] += 1;
                }


              }

              else if (y > y_nord){ // NORD
                points_NSEO[0] +=1;
              }

              else if (y < y_sud){ // SUD
                points_NSEO[1] +=1;
              }

            }
          }

            // nombre de points détectés dans l'emprise actuelle
            var nb_total_points = points_NSEO[0]+ points_NSEO[1]+points_NSEO[2]+ points_NSEO[3];
            console.log();

           //////// modification de la couleur des cadres   //////////////////:

            var couleurs_croissantes = ["lightgoldenrodyellow","gold","orange","red","purple","black"];
            var nb_paliers = 4; /////////// nb de paliers de couleur ( à changer à la main)
            var taille_palier = nb_total_points/nb_paliers;
            var paliers = [taille_palier,2*taille_palier,3*taille_palier];

            // attribution des couleurs (4 paliers)
            for (var i = 0; i<4 ; i++){
              cadres_NSEO[i].innerHTML = points_NSEO[i];
              if (points_NSEO[i] >= paliers[2]){ // rouge
                cadres_NSEO[i].style.background = couleurs_croissantes[3];
              }else if (points_NSEO[i] >= paliers[1]){ // orange
                cadres_NSEO[i].style.background = couleurs_croissantes[2];
              }else if (points_NSEO[i] >= paliers[0]){ // jaune
                cadres_NSEO[i].style.background = couleurs_croissantes[1];
              }else{
                cadres_NSEO[i].style.background = couleurs_croissantes[0]; // gris pâle
              };
            };

          };

          // mises à jour du cadre
          view.on(["drag","double-click","click","mouse-wheel"], function() {
            RefreshCadre();
          }, false);

})};
