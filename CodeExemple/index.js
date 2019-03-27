
require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/core/promiseUtils",
    "dojo/domReady!"
  ], function(Map, MapView,FeatureLayer) {

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
      "value": "RER",
      "symbol": {
        "color": [20, 26, 26, 255],
        "size": 20,
        "type": "simple-marker",
        //"style": "dot"
      },
    //  "label": "Bikes"
    },
    {
      "value": "Metro",
      "symbol": {
        "color": [230, 0, 0, 255],
        "width": 0.9,
        "type": "simple-marker",
        //"style": "dot"
      },
    //  "label": "No Bikes"
    }
  ]
};

// Create the layer and set the renderer
var gare = new FeatureLayer({
  portalItem: {
    id: "7898dc0c69f848f08c0ccb720b96bd95",
  },
  renderer: gareRenderer
});

// Add the layer
map.add(gare,0);

  var view = new MapView({
    container: "viewDiv",
    map: map,
    center: [2.4,48.8], //longlats
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
