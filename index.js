// import modules d'esri et fcts
var zoomlevel = 10;
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
    "esri/geometry/Extent",
    "esri/core/watchUtils",
    "dojo/domReady!"

  ], function(Map, MapView, WebMap, FeatureLayer, Query, QueryTask, Graphic, GraphicsLayer, SimpleLineSymbol, SimpleFillSymbol,
        UniqueValueRenderer, Color, WebStyleSymbol,Extent, watchUtils) {


   var extentMap = new Extent({
     xmax:1000000, //768211,
     xmin:-10000, //530887,
     ymin:6000000,//6750430,
     ymax:6500000,//6942667,

   });

   var webStyleSymbol = new WebStyleSymbol({
     name: "Train",
     styleName: "EsriIconsStyle"
   });

  var map = new WebMap({
    portalItem: {
      id: "9c41116150794b6d899503bb1dc2af2f"
    }
  });


// Definition du style d'affichage des gares
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


// Cree la couche des gares et y applique le style d'affichage
var gare = new FeatureLayer({
  portalItem: {
    id: "7898dc0c69f848f08c0ccb720b96bd95",
  },
  renderer: gareRenderer_defaut

});



gare_surbrillance = 0;
// On ajoute la couche a la carte
map.add(gare);


// On defini la vue initiale de la carte et on la place dans la div
// creation map
  var view = new MapView({
    container: "viewDiv",
    map: map,
    center: [lng_c,lat_c], //longlats
    zoom: zoomlevel,
	constraints: {
      minZoom: 9,
    }
  });

  var maxExtent = extentMap;

 
  /**
   * Permet de limiter la carte observable a l'IDF
   * 
   */
  view.on( "pointer-move", function(){
     if((view.extent.xmin < maxExtent.xmin) ||
       (view.extent.ymin < maxExtent.ymin)  ||
       (view.extent.xmax > maxExtent.xmax) ||
       (view.extent.ymax > maxExtent.ymax)
     ){

     view.center.latitude = lat_c;
     view.center.longitude = lng_c;
     view.goTo({
       animate : false,
       target: view.center,
     });

     }

 });


  view.ui.move([ "zoom", map ], "top-right");

  view.zoom = zoomlevel;
  zoomlevel = view.zoom;

  // permet de ne pas pouvoir afficher les attributs qui parasitent la vue
  view.popup = null;

surbrillance.addEventListener("change",executeSurbrillanceEvent,false);
executeSurbrillance(view, map, gare, gareRenderer_defaut);
var voletclos = document.getElementById("volet_clos");

// 
/**
 * on peut passer cette fonction dans surbrillance.js a la maniere du cadre et de la commande vocale avec un alertsurbrillance
 * @param {*} event : evenement 'change' du bouton Surbrillance
 */
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
  });

  //Carte topographique
  var topo = document.getElementById("carte_topo");
  topo.addEventListener("click", function(){
    if (topo.checked == true) {
      map.basemap.baseLayers.items[0].opacity = 1;
    }
    else {
      map.basemap.baseLayers.items[0].opacity = 0;
    }
  });

});
