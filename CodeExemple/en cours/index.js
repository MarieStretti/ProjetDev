
require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "esri/tasks/support/Query",
  "esri/tasks/QueryTask",
  "esri/Graphic",
  "esri/geometry/Polygon",
  "dojo/domReady!"
], function(Map, MapView,FeatureLayer,Query, QueryTask, Graphic,Polygon) {

var map = new Map({
  basemap: "topo-vector"
});

window.addEventListener("load",requeteSQL_toutID,false);


//*** ADD ***//
// Define a unique value renderer and symbols
var gareRenderer = {
  "type": "unique-value",
  "field": "mode",
  "uniqueValueInfos": [
    {
      "value": "Metro",
      "symbol": {
        "color": [20, 26, 26, 255],
        "size": 20,
        "type": "simple-marker",
        //"style": "dot"
      },
    //  "label": "Bikes"
    },
    {
      "value": "Tramway",
      "symbol": {
        "color": [230, 0, 0, 255],
        "width": 0.9,
        "type": "simple-marker",
        //"style": "dot"
      },
    //  "label": "No Bikes"
  },
    {
      "value": "RER",
      "symbol": {
        "color": [20, 26, 26, 255],
        "size": 20,
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
  center: [2.4,48.8], //longlats
  zoom: 11
});

// on crée une liste de toutes les coordonnées
function requeteSQL_toutID(event){
  var query = gares.createQuery();
  query.outFields = ["x"];
  gares.queryFeatures(query).features;

  var liste = [];
  gares.queryFeatures(query).then(function(response){
    response.features.forEach(function(item){
      liste.push(item.attributes.x); // on remplit la liste avec les coords (x,y) de chaque point
    });
    
  });
  console.log('liste:',liste);
}



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


var cadreNord  = document.getElementById('cadreNord');
var cadreOuest = document.getElementById('cadreOuest');
var cadreEst   = document.getElementById('cadreEst');
var cadreSud   = document.getElementById('cadreSud');

//cadreSud.style.background = 'purple';

console.log('lat,lon : ',view.center.latitude,view.center.longitude);
console.log('size : ',view.size);


// centre de la carte par défaut
var lat_center = view.center.latitude;
var lon_center = view.center.longitude;

var size   =  view.size; // emprise en pixels de la carte
var width  = size[0]; // longueur de la carte
var height = size[1]; // largeur de la carte
var x_center = width/2;
var y_center = width/2;

/////// proportions du polygône central ///////:
var dx = 0.5*(width/2);
var dy = 0.5*(height/2);


view.on(['pointer-down'], function(){
console.log('start!');

  var x_coin_NO = x_center + dx;
  var y_coin_NO = y_center - dy;

  var x_coin_NE = x_center + dx;
  var y_coin_NE = y_center + dy;

  var x_coin_NE = x_center + dx;
  var y_coin_NE = y_center + dy;

  var x_coin_SE = x_center - dx;
  var y_coin_SE = y_center + dy;

  var x_coin_SO = x_center - dx;
  var y_coin_SO = y_center - dy;


  var lat_coin_NO = view.toMap({x: x_coin_NO, y:y_coin_NO}).latitude;
  var lon_coin_NO = view.toMap({x: x_coin_NO, y:y_coin_NO}).longitude;

  var lat_coin_NE = view.toMap({x: x_coin_NE, y:y_coin_NE}).latitude;
  var lon_coin_NE = view.toMap({x: x_coin_NE, y:y_coin_NE}).longitude;

  var lat_coin_SE = view.toMap({x: x_coin_SE, y:y_coin_SE}).latitude;
  var lon_coin_SE = view.toMap({x: x_coin_SE, y:y_coin_SE}).longitude;

  var lat_coin_SO = view.toMap({x: x_coin_SO, y:y_coin_SO}).latitude;
  var lon_coin_SO = view.toMap({x: x_coin_SO, y:y_coin_SO}).longitude;
  console.log('polygon start');

  const emprise = [
    [  
    [lat_coin_NO,lon_coin_NO],
    [lat_coin_NE,lon_coin_NE],
    [lat_coin_SE,lon_coin_SE],
    [lat_coin_SO,lon_coin_SO]  
    ]
  ];
  
  const polygon = new Polygon({
    rings: emprise,
    spatialReference: { wkid: 4326 }
  });

  console.log(polygon);
  console.log('polygon end');
  });


});
