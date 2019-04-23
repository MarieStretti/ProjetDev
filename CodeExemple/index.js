// imports pour arcgis online
require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "esri/tasks/support/Query",
  "esri/geometry/Polygon",
  "esri/tasks/QueryTask",
  "esri/Graphic",
  "esri/geometry/Point",
  "dojo/domReady!"

], function(Map, MapView,FeatureLayer,Query,Polygon,QueryTask, Graphic,Point) {

// creation de la carte
var map = new Map({
  basemap: "topo-vector"
});

// renderer : creation des attributs de la carte
var gareRenderer = {
  "type": "unique-value",
  "field": "mode",
  "uniqueValueInfos": [
    {
      "value": "Metro",
      "symbol": {
        "color": [150, 0, 0, 200],
        "size": 5,
        "type": "simple-marker",
      },
    },
    {
      "value": "Tramway",
      "symbol": {
        "color": [0, 150, 0, 255],
        "size": 5,
        "type": "simple-marker",
      },
  },
    {
      "value": "RER",
      "symbol": {
        "color": [0, 0, 150, 255],
        "size": 5,
        "type": "simple-marker",
      },
    }
  ]
};


// Create the layer and set the renderer
var gares = new FeatureLayer({
  portalItem: {
    id: "2ee97649b65244ccbb4f3377c5a55497",
  },
  renderer: gareRenderer
});

// Add the layer
map.add(gares,0);

// creation de la view
var view = new MapView({
  container: "viewDiv",
  map: map,
  center: [2.34,48.85], //longlats
  zoom: 12
});

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
var query = gares.createQuery();
query.outFields = ["x","y"];
gares.queryFeatures(query).features;
var liste_points = [];
gares.queryFeatures(query).then(function(response){
  response.features.forEach(function(item){
      liste_points.push([item.attributes.x,item.attributes.y]); // on rajoute les couples [x,y] aux coordonnées
  });
});


///////// au clic : activation du cadre ///////////////////////:
function RefreshCadre() {

  console.log('start!');

  
////  coordonnées d'emprise actuelle de la carte /////

  var size   =  view.size; // emprise en pixels de la carte
  var width  = size[1]; // longueur de la carte
  var height = size[0]; // largeur de la carte
  var pix_x_center = height/2;
  var pix_y_center = width/2;

  lat_center = view.toMap({x: pix_x_center, y:pix_y_center}).latitude;
  lon_center = view.toMap({x: pix_x_center, y:pix_y_center}).longitude;
  console.log("centre : ",lat_center,", ",lon_center);
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
  var coord_conv_centre = proj4(firstProjection,secondProjection,[lon_center,lat_center]);
  var coord_conv_SO = proj4(firstProjection,secondProjection,[lon_ouest,lat_sud]); // lon lat : point sud ouest
  var coord_conv_NE = proj4(firstProjection,secondProjection,[lon_est,lat_nord]); // lon lat : point nord est
  
  var x_center = coord_conv_centre[0];
  var y_center = coord_conv_centre[1];
  var y_nord  = coord_conv_SO[1];
  var x_est   = coord_conv_SO[0];
  var y_sud   = coord_conv_NE[1];
  var x_ouest = coord_conv_NE[0];

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
      
      /*
      var dnord  = Math.abs(y-y_center)/Math.abs(y_nord-y_center);
      var dsud   = Math.abs(y-y_center)/Math.abs(y_sud-y_center);
      var dest   = Math.abs(x-x_center)/Math.abs(x_est-x_center);
      var douest = Math.abs(x-x_center)/Math.abs(x_ouest-x_center);
      */

     var dnord  = Math.abs(y-y_nord);
     var dsud   = Math.abs(y-y_sud);
     var dest   = Math.abs(x-x_est);
     var douest = Math.abs(x-x_ouest);

      /*
      console.log("dnord: ",dnord);
      console.log("dsud: ",dsud);
      console.log("dest: ",dest);
      console.log("douest: ",douest);
*/
      if (x < x_ouest){
         if (y > y_nord){ // NORD-OUEST

            if ( dnord > douest) { 
              points_NSEO[3]+=1;//point attribué à l'ouest
            } 
            else { 
              points_NSEO[0] += 1 // point attribué au nord
            }; 

         }else if (y < y_sud) { // SUD-OUEST
          
          if (dsud > douest){ 
            points_NSEO[3] +=1 ;//point attribué à l'ouest
          } 
          else { 
            points_NSEO[1] += 1;// point attribué au sud
          }
        }else{ // OUEST
          points_NSEO[3] +=1;
        }
      }

      else if (x > x_est){
        if (y > y_nord){ // NORD-EST
          if (dnord < dest) {
            points_NSEO[2] +=1; //point attribué à l'est
          } 
          else {
            points_NSEO[0] += 1; // point attribué au nord
          }; 
        }else if (y < y_sud) { // SUD-EST
          if (dsud < dest) {
            points_NSEO[2] += 1;//point attribué à l'est
          } 
          else {
            points_NSEO[1] += 1// point attribué au sud
          }; 
        }else{
          points_NSEO[2] +=1; // EST
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



  //////// modification de la couleur des cadres   //////////////////:

  var couleurs_croissantes = ["lightgoldenrodyellow","gold","orange","red","purple","black"];
  var nb_paliers = 4; /////////// nb de paliers de couleur ( à changer à la main)
  var taille_palier = nb_total_points/nb_paliers;
  var paliers = [taille_palier,2*taille_palier,3*taille_palier,4*taille_palier,5*taille_palier,6*taille_palier];

  // attribution des couleurs (pour 4 paliers)
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

view.on(["pointer-move"], function(evt) {
  showCoordinates(view.toMap({ x: evt.x, y: evt.y }));
});

view.on(["drag","double-click","mouse-wheel"], function() {
  console.log("drag");
  RefreshCadre();
});


///////////////// WIDGET D'INFOS EN BAS DE LA CARTE /////////


//*** Add div element to show coordates ***//
var coordsWidget = document.createElement("div");
coordsWidget.id = "coordsWidget";
coordsWidget.className = "esri-widget esri-component";
coordsWidget.style.padding = "7px 15px 5px";
view.ui.add(coordsWidget, "bottom-right");

//*** Update lat, lon, zoom and scale ***//
function showCoordinates(pt) {
  var coords = "Lat/Lon " + pt.latitude.toFixed(3) + " " + pt.longitude.toFixed(3) +
      " | Scale 1:" + Math.round(view.scale * 1) / 1 +
      " | Zoom " + view.zoom;
  coordsWidget.innerHTML = coords;
}

//*** Add event and show center coordinates after the view is finished moving e.g. zoom, pan ***//
view.watch(["stationary"], function() {
  showCoordinates(view.center);
});

//*** Add event to show mouse coordinates on click and move ***//
view.on(["pointer-down","pointer-move"], function(evt) {
  showCoordinates(view.toMap({ x: evt.x, y: evt.y }));
});

});
