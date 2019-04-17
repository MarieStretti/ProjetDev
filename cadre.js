var cadrediv = document.getElementById("cadrediv");

function alertcadre(checkboxElem) {
 if (checkboxElem.checked) {
   cadrediv.style.display = "block";



 } else {
    cadrediv.style.display = "none";
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
          console.log(wgs84);

          proj4.defs("EPSG:2154","+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");

          var lambert93 = proj4.Proj("EPSG:2154");
          console.log(lambert93);

          var firstProjection = wgs84 ;
          var secondProjection = lambert93;


          /// stockage des coordonnées de TOUS LES POINTS
          var query = gare.createQuery();
          query.outFields = ["x","y"];
          gare.queryFeatures(query).features;
          var liste_points = [];
          gare.queryFeatures(query).then(function(response){
            response.features.forEach(function(item){
                liste_points.push([item.attributes.x,item.attributes.y]); // on rajoute les couples [x,y] aux coordonnées
            });
          });

          var boutonCadre = document.getElementById("boutonCadre");
          boutonCadre.addEventListener("click", RefreshCadre);

          ///////// au clic : activation du cadre ///////////////////////:
          function RefreshCadre() {

            console.log('start!');


          ////  coordonnées d'emprise actuelle de la carte /////

            var size   =  view.size; // emprise en pixels de la carte
            var width  = size[1]; // longueur de la carte
            var height = size[0]; // largeur de la carte
            var pix_x_center = height/2;
            var pix_y_center = width/2;

            console.log("center : ",view.toMap({x: pix_x_center, y:pix_y_center}));
            // dimensions du polygone d'emprise
            var dx = (height/2);
            var dy = (width/2);

            console.log("dx, dy : ",dx, dy);
            var pix_x_ouest = pix_x_center - dx;
            var pix_x_est = pix_x_center + dx;
            var pix_y_nord = pix_y_center - dy; /// pixels != lon/lat !!!!!
            var pix_y_sud = pix_y_center + dy;

            // coordonnées des 'coins' de la carte en pixels > 80% de l'emprise environ
            var lat_nord = view.toMap({x: pix_x_est, y:pix_y_nord}).latitude; console.log('lat_nord',lat_nord);
            var lat_sud = view.toMap({x: pix_x_est, y:pix_y_sud}).latitude; console.log('lat_sud',lat_sud);
            var lon_ouest = view.toMap({x: pix_x_ouest, y:pix_y_nord}).longitude; console.log('lon_ouest',lon_ouest);
            var lon_est = view.toMap({x: pix_x_est, y:pix_y_nord}).longitude; console.log('lon_est',lon_est);

            console.log("###### Emprise de la view ######");
            console.log("O > ",lon_ouest);
            console.log("E > ",lon_est);
            console.log("N > ",lat_nord);
            console.log("S > ",lat_sud);

          //// CONVERSION DE COORDONNES D'EMPRISE AVEC PROJ4 //////

            var new_coord1 = proj4(firstProjection,secondProjection,[lon_ouest,lat_sud]); // lon lat : point sud ouest
            var new_coord2 = proj4(firstProjection,secondProjection,[lon_est,lat_nord]); // lon lat : point nord est

            var y_nord  = new_coord2[1];
            var x_est   = new_coord2[0];
            var y_sud   = new_coord1[1];
            var x_ouest = new_coord1[0];

            // initialisation des conteneurs du nombre des points dans chaque direction
            var points_NSEO = [0,0,0,0];
            var cadres_NSEO = [cadreNord, cadreSud, cadreEst,cadreOuest];


          //////// DETECTION DE LA POSITION DES POINTS     /////////
            for (var i = 0; i < liste_points.length; i++) {

              var x = liste_points[i][0]; /// EN LAMBERT 93
              var y = liste_points[i][1]; /// EN LAMBERT 93

              if (x < x_ouest){ // point à gauche
                points_NSEO[3] +=1;
              }
              if (x > x_est){ // point à droite
                points_NSEO[2] +=1;
              }
              if (y > y_nord){ // point en haut
                points_NSEO[0] +=1;
              }
              if (y < y_sud){ // point en bas
                points_NSEO[1] +=1;
              }
            }
            console.log("####### nombre de points détectés dans les quadrants #######")
            console.log("N : ",points_NSEO[0]);
            console.log("S : ",points_NSEO[1]);
            console.log("E : ",points_NSEO[2]);
            console.log("O : ",points_NSEO[3]);
            console.log("total : ",points_NSEO[3]+points_NSEO[1]+points_NSEO[2]+points_NSEO[0])


            //////// modification de la couleur des cadres   //////////////////:
            var couleurs_croissantes = ["lightgrey","lightgreen","gold","orange","tomato","fuchsia","purple","blue","darkblue"];

            for (var i = 0; i<4 ; i++){
              cadres_NSEO[i].innerHTML = points_NSEO[i];
              if (points_NSEO[i] >= 700){
                cadres_NSEO[i].style.background = couleurs_croissantes[8];
              }else if (points_NSEO[i] >= 600){
                cadres_NSEO[i].style.background = couleurs_croissantes[7];
              }else if (points_NSEO[i] >= 500){
                cadres_NSEO[i].style.background = couleurs_croissantes[6];
              }else if (points_NSEO[i] >= 400){
                cadres_NSEO[i].style.background = couleurs_croissantes[5];
              }else if (points_NSEO[i] >= 300){
                cadres_NSEO[i].style.background = couleurs_croissantes[4];
              }else if (points_NSEO[i] >= 200){
                cadres_NSEO[i].style.background = couleurs_croissantes[3];
              }else if (points_NSEO[i] >= 100){
                cadres_NSEO[i].style.background = couleurs_croissantes[2];
              }else if (points_NSEO[i] >= 50){
                cadres_NSEO[i].style.background = couleurs_croissantes[1];
              }else{
                cadres_NSEO[i].style.background = couleurs_croissantes[0];
              };
            };
            console.log('bg : ',cadreNord.style.background);
          };

})};
