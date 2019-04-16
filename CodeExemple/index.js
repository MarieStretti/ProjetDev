
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

var map = new Map({
  basemap: "topo-vector"
});


//*** ADD ***//
// Define a unique value renderer and symbols
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
        //"style": "dot"
      },
    //  "label": "Bikes"
    },
    {
      "value": "Tramway",
      "symbol": {
        "color": [0, 150, 0, 255],
        "size": 5,
        "type": "simple-marker",
        //"style": "dot"
      },
    //  "label": "No Bikes"
  },
    {
      "value": "RER",
      "symbol": {
        "color": [0, 0, 150, 255],
        "size": 5,
        "type": "simple-marker",
        //"style": "dot"
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

// creation map
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


/// on stocke les coordonnées de TOUS LES POINTS
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
view.on(['pointer-down'], function() {

  console.log('start!');


////  emprise actuelle de la carte 
  /*
  var size   =  view.size; // emprise en pixels de la carte
  var width  = size[0]; // longueur de la carte
  var height = size[1]; // largeur de la carte
  var x_center = height/2;
  var y_center = width/2;

  console.log("center: ",x_center, y_center);


  // dimensions du polygone d'emprise
  var dx = 0.5*(height/2);
  var dy = 0.5*(width/2);

  console.log("dx, dy : ",dx, dy);


  var x_ouest = x_center - dx;
  var x_est = x_center + dx;
  var y_nord = y_center - dy; /// pixels != lon/lat !!!!!
  var y_sud = y_center + dy;

  var lat_nord = view.toMap({x: x_est, y:y_nord}).latitude;
  var lat_sud = view.toMap({x: x_est, y:y_sud}).latitude;
  var lon_ouest = view.toMap({x: x_ouest, y:y_nord}).longitude;
  var lon_est = view.toMap({x: x_est, y:y_nord}).longitude;
*/

var lon_ouest = 2.282; // COORDONNEES A CONVERTIR ( rentrées à la main )
var lat_sud = 48.830;
var lon_est = 2.313;
var lat_nord = 48.890;

//// CONVERSION DE COORDONNES AVEC PROJ4 //////
var wgs84 = proj4.Proj('EPSG:4326');
console.log(wgs84);

//proj4.defs('EPSG:27571','+proj=lcc +lat_1=49.50000000000001 +lat_0=49.50000000000001 +lon_0=0 +k_0=0.999877341 +x_0=600000 +y_0=1200000 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs');

proj4.defs("EPSG:2154","+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");


var lambert1 = proj4.Proj("EPSG:2154");
console.log(lambert1);


var firstProjection = wgs84 ;
var secondProjection = lambert1;

var new_coord1 = proj4(firstProjection,secondProjection,[lon_ouest,lat_sud]); // lon lat
var new_coord2 = proj4(firstProjection,secondProjection,[lon_est,lat_nord]);

var new_coord3 = proj4(firstProjection,secondProjection).inverse(new_coord1);
var new_coord4 = proj4(firstProjection,secondProjection).inverse(new_coord2);

console.log(new_coord1, new_coord2);
console.log(new_coord3, new_coord4);


////////////////////////////// fin de conversion proj4 /////////:::


console.log("lat_N : ",lat_nord);
console.log("lat_S : ",lat_sud);
console.log("lon_E : ",lon_est);
console.log("lon_O : ",lon_ouest);


var p1 = proj4.Proj('EPSG:27571');
var p2 = proj4.Proj('EPSG:4326');

console.log(p1,p2);

proj4(firstProjection,[-71,41]);

var y_nord  = projectedPoints[0];
var y_sud   = projectedPoints[1];
var x_est   = projectedPoints[2];
var x_ouest = projectedPoints[3];


/* comment trouver les coordonnées du centre de la carte ???
  // étendue de l'emprise de la carte
  var x_ouest = view.extent.xmin;
  var y_sud = view.extent.ymin;
  var x_est = view.extent.xmax;
  var y_nord = view.extent.ymax;

  console.log("O > ",x_ouest);
  console.log("E > ",x_est);
  console.log("N > ",y_nord);
  console.log("S > ",y_sud);

  */

  // conteneurs du nombre des points dans chaque direction
  var points_NSEO = [0,0,0,0];
  var cadres_NSEO = [cadreNord, cadreSud, cadreEst,cadreOuest];

//////// DETECTION DE LA POSITION DES POINTS     /////////
  for (var i = 0; i < liste_points.length; i++) {  

    var x = liste_points[i][0]; /// EN LAMBERT 1
    var y = liste_points[i][1]; /// EN LAMBERT 1

    if (x < x_ouest){ // point à gauche
      points_NSEO[3] +=1;
    }
    if (x > x_est){ // point à droite
      points_NSEO[2] +=1;
    }
    if (y < y_nord){ // point en haut
      points_NSEO[0] +=1;
    }
    if (y < y_sud){ // point en bas
      points_NSEO[1] +=1;
    }
  }

  console.log("N : ",points_NSEO[0]);
  console.log("S : ",points_NSEO[1]);
  console.log("E : ",points_NSEO[2]);
  console.log("O : ",points_NSEO[3]);


  //////// modification de la couleur des cadres   //////////////////:
  
  for (var i = 0; i<4 ; i++){
    cadres_NSEO[i].innerHTML = points_NSEO[i];
    if (points_NSEO[i] >= 500){
      cadres_NSEO[i].style.background = "purple";
    }else if (points_NSEO[i] >= 400){
      cadres_NSEO[i].style.background = "pink";
    }else if (points_NSEO[i] >= 300){
      cadres_NSEO[i].style.background = "red";
    }else if (points_NSEO[i] >= 200){
      cadres_NSEO[i].style.background = "orange";
    }else if (points_NSEO[i] >= 100){
      cadres_NSEO[i].style.background = "gold";
    }else if (points_NSEO[i] >= 50){
      cadres_NSEO[i].style.background = "lightgreen";
    }else{
      cadres_NSEO[i].style.background = "lightgrey";
    };
  };
  console.log('bg : ',cadreNord.style.background);
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
