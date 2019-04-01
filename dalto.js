// import modules d'esri et fcts
require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/core/promiseUtils",
    "dojo/domReady!"
  ], function(Map, MapView,FeatureLayer) {

  var map = new Map({
    basemap: "topo-vector" //fond de carte
  });

  //*** ADD ***//
// Define a unique value renderer and symbols
var areaRenderer = {
  "type": "unique-value",
  "field": "etat_lib",
  "uniqueValueInfos": [
    {
      "value": "en cours",
      "symbol": {
        "color": [152,210,23, 255],
        "size": 20,
        "type": "simple-fill",
        //"style": "dot"
      },
    //  "label": "Bikes"
    },
    {
      "value": "programmé",
      "symbol": {
        "color": [255,251,165, 255],
        "width": 0.9,
        "type": "simple-fill",
        //"style": "dot"
      },
    //  "label": "No Bikes"
  },
    {
      "value": "à l'étude",
      "symbol": {
        "color": [251,114,0,255],
        "size": 20,
        "type": "simple-fill",
        //"style": "dot"
      },
    }
  ]
};

// Create the layer and set the renderer
var area = new FeatureLayer({
  portalItem: {
    id: "fdf1a27e48eb4308b58f28adf1d08fc9",
  },
  renderer: areaRenderer
});

// Add the layer
map.add(area,0);

// creation map
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
