// import modules d'esri et fcts
require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "dojo/domReady!"
  ], function(Map, MapView,FeatureLayer) {

  var map = new Map({
    basemap: "topo-vector" //fond de carte
  });

  //*** ADD ***//
// Define a unique value renderer and symbols
// ttributs de la rando
var trailsRenderer = {
  "type": "unique-value",
  "field": "USE_BIKE",
  "uniqueValueInfos": [
    {
      "value": "Yes",
      "symbol": {
        "color": [26, 26, 26, 255],
        "width": 0.9,
        "type": "simple-line",
        "style": "dot"
      },
      "label": "Bikes"
    },
    {
      "value": "No",
      "symbol": {
        "color": [230, 0, 0, 255],
        "width": 0.9,
        "type": "simple-line",
        "style": "dot"
      },
      "label": "No Bikes"
    }
  ]
}

// Create the layer and set the renderer
// couche rando
var trails = new FeatureLayer({
  url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails/FeatureServer/0",
  renderer: trailsRenderer // style def au dessus
});

// Add the layer
map.add(trails,0);

// creation map
  var view = new MapView({
    container: "viewDiv",
    map: map,
    center: [-118.71511,34.09042], //longlats
    zoom: 11
  });

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
