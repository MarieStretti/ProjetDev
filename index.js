// import modules d'esri et fcts
var zoomlevel = 11;
var lng_c = 2.4;
var lat_c = 48.8;
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

  ], function(Map, MapView, WebMap, FeatureLayer, Query, QueryTask, Graphic, GraphicsLayer, SimpleLineSymbol, SimpleFillSymbol,
        UniqueValueRenderer, Color, WebStyleSymbol) {

  var map = new WebMap({
    portalItem: {
      id: "9c41116150794b6d899503bb1dc2af2f"
    }
  });


// Définition du style d'affichage des gares
var gareRenderer_defaut = {
  "type": "simple",
  "field": "",
  "uniqueValueInfos": [],
  "symbol" :{
     type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
     size: 5,
     color: "black"
   }
};


// Crée la couche des gares et y applique le style d'affichage
var gare = new FeatureLayer({
  portalItem: {
    id: "7898dc0c69f848f08c0ccb720b96bd95",
  },
  renderer: gareRenderer_defaut

});


gare_surbrillance = 0;
// On ajoute la couche à la carte
map.add(gare);


// On défini la vue initiale de la carte et on la place dans la div
// creation map
  var view = new MapView({
    container: "viewDiv",
    map: map,
    center: [lng_c,lat_c], //longlats
    zoom: zoomlevel
  });

  view.ui.move([ "zoom", map ], "top-right");

  view.zoom=zoomlevel;
  zoomlevel = view.zoom;

  // permet de ne pas pouvoir afficher les attributs qui parasitent la vue
  view.popup = null;

surbrillance.addEventListener("change",executeSurbrillanceEvent,false);
executeSurbrillance(view, map, gare, gareRenderer_defaut);
var voletclos = document.getElementById("volet_clos");

// on peut passer cette fonction dans surbrillance.js à la manière du cadre et de la commande vocal avec un alertsurbrillance
function executeSurbrillanceEvent(event){
  if (surbrillance.checked) {
    volet_clos.style.display = "flex";
  }
  else {
    volet_clos.style.display = "none";

  }

};

  executeCadre(view, map, gare, gareRenderer_defaut);

  commande_voc(view,map);

  document.getElementById('loupe').addEventListener('click', function(){
    if (view.magnifier.visible == true) {
        view.magnifier.visible = false;
    }
    else {
      view.magnifier.visible = true;
    }
  })

});
