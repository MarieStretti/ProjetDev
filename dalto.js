// import modules d'esri et fcts
var zoomlevel = 11;

require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/widgets/Zoom",
    "esri/core/promiseUtils",
    "dojo/domReady!"
  ], function CreateMap(Map, MapView,FeatureLayer,Zoom,domReady) {

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
        "color": [20, 255, 255, 255],
        "size": 20,
        "type": "simple-fill",
        //"style": "dot"
      },
    //  "label": "Bikes"
    },
    {
      "value": "programmé",
      "symbol": {
        "color": [230, 0, 0, 255],
        "width": 0.9,
        "type": "simple-fill",
        //"style": "dot"
      },
    //  "label": "No Bikes"
  },
    {
      "value": "à l'étude",
      "symbol": {
        "color": [20, 26, 26, 255],
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
    zoom: zoomlevel,
  });

  view.zoom=zoomlevel;
  zoomlevel = view.zoom;

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





annyang.setLanguage('fr-FR');

//document.cookie = 'zoomlevel=3';

if (!annyang) {
  console.log("Speech Recognition is not supported");
}

if (annyang) {
  // Add our commands to annyang
  annyang.addCommands({
    'bonjour': function() { alert('Hello world!'); }
  });

  // Add our commands to annyang
  annyang.addCommands({
    'plus': function() {
      console.log("tu as dit plus");
      console.log(zoomlevel);
      zoomlevel = view.zoom+1;
      console.log(zoomlevel);
      view.zoom= zoomlevel
      }
  });


  annyang.addCommands({
    'moins': function() {
      console.log("tu as dit moins");
      console.log(zoomlevel);
      zoomlevel = view.zoom-1;
      console.log(zoomlevel);
      view.zoom= zoomlevel
      }
  });


  // Tell KITT to use annyang
  SpeechKITT.annyang();

  // Define a stylesheet for KITT to use
  SpeechKITT.setStylesheet('//cdnjs.cloudflare.com/ajax/libs/SpeechKITT/0.3.0/themes/flat.css');

  // Render KITT's interface
  SpeechKITT.vroom();
}
});
