//initialisation du niveau de zoom
var zoomlevel = 11;
var lng_c = 2.4;
var lat_c = 48.8;

// import modules d'esri et fcts
require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/core/promiseUtils",
    "esri/tasks/support/Query",
    "esri/tasks/QueryTask",
    "esri/Graphic",
    "esri/layers/GraphicsLayer",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleFillSymbol",
    "esri/renderers/UniqueValueRenderer",
    "esri/Color",
    "dojo/domReady!"
  ], function(Map, MapView, FeatureLayer, domReady, Query, QueryTask, Graphic, GraphicsLayer, SimpleLineSymbol, SimpleFillSymbol,
        UniqueValueRenderer, Color, Zoom) {

  var map = new Map({
    basemap: "topo-vector"
  });

// Définition du style d'affichage des gares


var gareRenderer_defaut = {
  "type": "simple",
  "field": "",
  "uniqueValueInfos": [],
  "symbol" : {
     type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
     size: 5,
     color: "black"
   }
};


var gareRenderer_s1 = {
  "type": "unique-value",
  "field": "id_ref_zdl",
  "uniqueValueInfos": []
};

var gareRenderer_s2 = {
  "type": "unique-value",
  "field": "id_ref_zdl",
  "uniqueValueInfos": []
};

renderer1 = gareRenderer_s1;
renderer2 = gareRenderer_s2;


var gareRenderer = {
  "type": "simple",
  "field": "",
  "uniqueValueInfos": [],
};
/*
console.log(gareRenderer.uniqueValueInfos.push({
  "value": "Metro",
  "symbol": {
    "color": [230, 0, 0, 255],
    "size": 10,
    "type": "simple-marker",
  }}
)
);
*/




var ligneRER = document.getElementById("ligneRER");
var formulaire = document.getElementById("formulaire");

// Crée la couche des gares et y applique le style d'affichage
var gare1 = new FeatureLayer({
  portalItem: {
    id: "7898dc0c69f848f08c0ccb720b96bd95",
  },
  renderer: gareRenderer_defaut

});

var gare = new FeatureLayer({
  portalItem: {
    id: "7898dc0c69f848f08c0ccb720b96bd95",
  },
  renderer: gareRenderer
});


// On ajoute la couche à la gare
map.add(gare1);


// On défini la vue initiale de la carte et on la place dans la div
// creation map
  var view = new MapView({
    container: "viewDiv",
    map: map,
    center: [lng_c,lat_c], //longlats
    zoom: zoomlevel
  });

  view.zoom=zoomlevel;
  zoomlevel = view.zoom;


// Add div element to show coordates
  var coordsWidget = document.createElement("div");
  coordsWidget.id = "coordsWidget";
  coordsWidget.className = "esri-widget esri-component";
  coordsWidget.style.padding = "7px 15px 5px";
  view.ui.add(coordsWidget, "bottom-right");

  // Update lat, lon, zoom and scale
  function showCoordinates(pt) {
    var coords = "Lat/Lon " + pt.latitude.toFixed(3) + " " + pt.longitude.toFixed(3) +
        " | Scale 1:" + Math.round(view.scale * 1) / 1 +
        " | Zoom " + view.zoom;
    coordsWidget.innerHTML = coords;
  }

  // Add event and show center coordinates after the view is finished moving e.g. zoom, pan
  view.watch(["stationary"], function() {
    showCoordinates(view.center);
  });

  //Add event to show mouse coordinates on click and move
  view.on(["pointer-down","pointer-move"], function(evt) {
    showCoordinates(view.toMap({ x: evt.x, y: evt.y }));
  });



  // On récupère l'id de l'ensemble des élements de la carte

  window.addEventListener("load", requeteSQL_toutID, false);

  function requeteSQL_toutID(event){
      var query = gare.createQuery();
      query.outFields = ["id_ref_zdl"];
      gare.queryFeatures(query).features;

      var liste = [];
      gare.queryFeatures(query).then(function(response){
        response.features.forEach(function(item){
            liste.push(item.attributes.id_ref_zdl);
          });
        });
    }


  // On crée une requête SQL sur la couche gare
  bouton.addEventListener("click", requeteSQL,false);

  function requeteSQL(event){
    var L = [];
    var query = gare.createQuery();
    query.where = "res_com LIKE '%RER " + ligneRER.value +"%'";
    console.log(query.where);
    query.outFields = ["id_ref_zdl"];
    gare.queryFeatures(query).features;

    gareRenderer_s1.uniqueValueInfos = [];
    var liste = [];
    gare.queryFeatures(query).then(function(response){
      response.features.forEach(function(item){
          liste.push(item.attributes.id_ref_zdl);
        });

          for (var i = 0; i < liste.length; i++) {
            gareRenderer_s1.uniqueValueInfos.push({
              "value":liste[i],
              "symbol": {
                "color": [0, 0, 255, 255],
                "size": 30,
                "type": "simple-marker",
              }}
            )

          }


          gareRenderer_s2.uniqueValueInfos = JSON.parse(JSON.stringify(gareRenderer_s1.uniqueValueInfos));

          for (var i = 0; i < liste.length; i++) {

            gareRenderer_s2.uniqueValueInfos[i].symbol.color = [255,255,0,255];

          }

            map.add(gare);
            renderer1 = gareRenderer_s1;
            renderer2 = gareRenderer_s2;
            renderer_encours = 1;
            clearInterval(setInterVar);
            setInterVar = setInterval(clignoter,1000);

      });

  }

setInterVar = 0;
renderer_encours = 0;

function clignoter(){
  //console.log("renderer en cours " + renderer_encours);

  if (renderer_encours == 1){
    map.findLayerById(gare.id).renderer = renderer2;
    renderer_encours = 2;
  }

  else {
    map.findLayerById(gare.id).renderer = renderer1;
    renderer_encours = 1;
  }

}

  commande_voc (view,map);


});

// Faire clignoter une div 'blinker'
var blink_speed = 500;
var t = setInterval(function () {
  var ele = document.getElementById('blinker');
  ele.style.visibility = (ele.style.visibility == 'hidden' ? '' : 'hidden'); }, blink_speed);
