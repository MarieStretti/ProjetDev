
require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "esri/tasks/support/Query",
  "esri/tasks/QueryTask",
  "esri/Graphic",
  "dojo/domReady!"
], function(Map, MapView,FeatureLayer,Query, QueryTask, Graphic) {

var map = new Map({
  basemap: "topo-vector"
});


//*** ADD ***//
// Define query SQL expression
var query = new Query();
query.where = "TRL_NAME like '%backbone%'"
query.outFields = ["*"];
query.returnGeometry = true;

// Define the query task
var queryTask = new QueryTask({
  url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails/FeatureServer/0"
});

// Execute the query
queryTask.execute(query)
  .then(function(result){
    console.log(result.features.length)
  })
  .otherwise(function(e){
    console.log(e);
  });


//*** ADD ***//
// Define query SQL expression
var query = new Query();
query.where = "TRL_NAME like '%backbone%'"
query.outFields = ["*"];
query.returnGeometry = true;

// Define the query task
var queryTask = new QueryTask({
  url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails/FeatureServer/0"
});

// Execute the query
queryTask.execute(query)
  .then(function(result){
    console.log(result.features.length)
  })
  .otherwise(function(e){
    console.log(e);
  });


  // Execute the query
queryTask.execute(query)
  .then(function(result){
    //console.log(result.features.length)

    //*** ADD ***//
    result.features.forEach(function(item){
       var g = new Graphic({
         geometry: item.geometry,
         attributes: item.attributes,
         symbol: {
           type: "simple-line",
           color: "black",
           width: 1.2,
           style: "short-dot"
         },
         popupTemplate: {
           title: "{TRL_NAME}",
           content: "{*}"  // All of the fields
         }
       });
       view.graphics.add(g);
    });

    // Zoom to the features
    view.goTo({
      target: view.graphics
    });

   })

  .otherwise(function(e){
    console.log(e);
  });



// Define a unique value renderer and symbols
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
var trails = new FeatureLayer({
  url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails/FeatureServer/0",
  renderer: trailsRenderer
});

// Add the layer
// map.add(trails,0);

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


var cadreNord  = document.getElementById('cadreNord');
var cadreOuest = document.getElementById('cadreOuest');
var cadreEst   = document.getElementById('cadreEst');
var cadreSud   = document.getElementById('cadreSud');

//cadreSud.style.background = 'purple';

});



