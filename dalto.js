// import modules d'esri et fcts
require([
  "esri/Map",
  "esri/WebMap",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "esri/core/promiseUtils",
  "dojo/domReady!",
  "esri/widgets/BasemapToggle"
], function(Map,WebMap,MapView,FeatureLayer,BasemapToggle) {


  var webmap = new WebMap({
    portalItem: {
      id: "9c41116150794b6d899503bb1dc2af2f"
    }
  });


  // creation map
  var view = new MapView({
    container: "viewDiv",
    map: webmap,
    center: [2.4,48.8], //longlats
    zoom: 11,
    constraints: {
      maxZoom: 15,
      minZoom: 9,
    }
  });
console.log(view);
  view.ui.move([ "zoom", webmap ], "top-right");


  // Create the layer and set the renderer
  var area = new FeatureLayer({
    portalItem: {
      id: "fdf1a27e48eb4308b58f28adf1d08fc9",
    },
    renderer: maj([237,81,81,255],[20,158,206,255],[167,198,54,255])
  });

  webmap.add(area,0);


  // Couche deuteranopie
  document.getElementById("btnD").addEventListener("click", function(){
    webmap.findLayerById(area.id).renderer = maj([152,210,23,255],[255,255,255,255],[132,12,236,255]);
  });

  // Couche protanopie
  document.getElementById("btnP").addEventListener("click", function(){
    webmap.findLayerById(area.id).renderer = maj([152,210,23,255],[255,255,255,255],[132,12,236,255]);
  });

  // Couche tritanopie
  document.getElementById("btnT").addEventListener("click", function(){
    webmap.findLayerById(area.id).renderer = maj([12,140,236,255],[255,255,255,255],[236,12,12,255]);
  });

  //################################### COULEURS CHANGEES DIRECTEMENT ###############################################

  var colorCours;
  var colorProg;
  var colorEtude;
  var param;

  var btnPP =   document.getElementById("btnPP");
  btnPP.addEventListener("click", function(){
    var pp = document.getElementById("PP");
    if (pp.style.display == "flex") {
      pp.style.display = "none";
    }
    else {
      pp.style.display = "flex";
      btnPP.style.margin = '0px 0px';
    }
  });


  var items = document.getElementsByClassName('btnparam');
  for (var i = 0; i < items.length; i++) {
    items[i].addEventListener("change",function() {

      colorC = document.getElementById("cours").value;
      colorCours = hexToRGB(colorC);

      colorP = document.getElementById("prog").value;
      colorProg = hexToRGB(colorP);

      colorE = document.getElementById("etude").value;
      colorEtude = hexToRGB(colorE);

      param = maj(colorCours,colorProg,colorEtude);

      webmap.findLayerById(area.id).renderer = param;
    });
  };


  /*
  * Met a jour les couleurs des surfaces representant les amenagements (renderer)
  * param color0 = couleur des projets 'en cours'
  * param color1 = couleur des projets 'programmes'
  * param color2 = couleur des projets 'a l'etude'
  * return le renderer modifie
  */
  function maj(color0,color1,color2){
    var param = {
      "type": "unique-value",
      "field": "etat_lib",
      "uniqueValueInfos": [
        {
          "value": "en cours",
          "symbol": {
            "color": color0,
            "size": 20,
            "type": "simple-fill"
          },
        },
        {
          "value": "programmé",
          "symbol": {
            "color": color1,
            "width": 0.9,
            "type": "simple-fill"
          },
        },
        {
          "value": "à l'étude",
          "symbol": {
            "color": color2,
            "size": 20,
            "type": "simple-fill"
          },
        }
      ]
    };
    return param;
  };

  /*
  * Convertir les couleurs en hexadecimales en rgb +- la transparence
  * param hex = couleur en hexadecimales
  * param alpha = transparence
  * return la liste rgb +- la transparence
  */
  function hexToRGB(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16);
    if (alpha) {
      var list = [r,g,b,alpha];
      return list;
    } else {
      var list = [r,g,b];
      return list;
    }
  }
});


// //*** Add div element to show coordates ***//
//   var coordsWidget = document.createElement("div");
//   coordsWidget.id = "coordsWidget";
//   coordsWidget.className = "esri-widget esri-component";
//   coordsWidget.style.padding = "7px 15px 5px";
//   view.ui.add(coordsWidget, "bottom-right");
//
//   //*** Update lat, lon, zoom and scale ***//
//   function showCoordinates(pt) {
//     var coords = "Lat/Lon " + pt.latitude.toFixed(3) + " " + pt.longitude.toFixed(3) +
//         " | Scale 1:" + Math.round(view.scale * 1) / 1 +
//         " | Zoom " + view.zoom;
//     coordsWidget.innerHTML = coords;
//   }
//
//   //*** Add event and show center coordinates after the view is finished moving e.g. zoom, pan ***//
//   view.watch(["stationary"], function() {
//     showCoordinates(view.center);
//   });
//
//   //*** Add event to show mouse coordinates on click and move ***//
//   view.on(["pointer-down","pointer-move"], function(evt) {
//     showCoordinates(view.toMap({ x: evt.x, y: evt.y }));
