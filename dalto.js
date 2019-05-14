var zoomlevel = 10;
var lng_c = 2.4;
var lat_c = 48.8;

// import modules d'esri et fcts
require([
  "esri/Map",
  "esri/WebMap",
  "esri/views/MapView",
  "esri/widgets/Legend",
  "esri/layers/FeatureLayer",
  "esri/core/promiseUtils",
  "dojo/domReady!",
  "esri/widgets/BasemapToggle"
], function(Map,WebMap,MapView,Legend,FeatureLayer,BasemapToggle) {


  var webmap = new WebMap({
    portalItem: {
      id: "9c41116150794b6d899503bb1dc2af2f"
    }
  });

  // creation map
  var view = new MapView({
    container: "viewDiv",
    map: webmap,
    center: [lng_c,lat_c], //longlats
    zoom: zoomlevel,
    constraints: {
      minZoom: 9,
    }
  });

  /**
   * Permet de limiter la carte observable a l'IDF
   *
   */
  view.on( "pointer-move", function(){
     if((view.extent.xmin < -20000) ||
       (view.extent.ymin < 6000000)  ||
       (view.extent.xmax > 600000) ||
       (view.extent.ymax > 6500000)
     ){

     view.center.latitude = lat_c;
     view.center.longitude = lng_c;
     view.goTo({
       animate : false,
       target: view.center,
     });

     }

 });

  view.when(function() {
    var featureLayer = webmap.layers.getItemAt(0);

    var legend = new Legend({
      view: view,
      layerInfos: [
        {
          layer: featureLayer,
          title: "Projets d'aménagement"
        }
      ]
    });
    view.ui.add(legend, "bottom-right");
  });

  view.ui.move([ "zoom", webmap ], "top-right");
  view.popup = null;

  // Create the layer and set the renderer
  var area = new FeatureLayer({
    portalItem: {
      id: "fdf1a27e48eb4308b58f28adf1d08fc9",
    },
    renderer: maj([237,81,81,255],[20,158,206,255],[167,198,54,255])
  });
  area.popupEnabled = "false";
  webmap.add(area,0);

  //Carte topographique
  var topo = document.getElementById("carte_topo");
  topo.addEventListener("click", function(){
    if (topo.checked == true) {
      webmap.basemap.baseLayers.items[0].opacity = 1;
    }
    else {
      webmap.basemap.baseLayers.items[0].opacity = 0;
    }
  });

  // Carte initiale
  document.getElementById("carte").addEventListener("click", function(){
    webmap.findLayerById(area.id).renderer = maj([237,81,81,255],[20,158,206,255],[167,198,54,255]);
  });

  // Couche deuteranopie
  document.getElementById("btnD").addEventListener("click", function(){
    webmap.findLayerById(area.id).renderer = maj([38,97,156,255],[141,97,14,255],[242,166,22,255]);
  });

  // Couche protanopie
  document.getElementById("btnP").addEventListener("click", function(){
    webmap.findLayerById(area.id).renderer = maj([38,97,156,255],[184,119,18,255],[242,227,83,255]);
  });

  // Couche tritanopie
  document.getElementById("btnT").addEventListener("click", function(){
    webmap.findLayerById(area.id).renderer = maj([12,140,236,255],[253,225,235,255],[236,12,12,255]);
  });

  //################################### COULEURS CHANGEES DIRECTEMENT ###############################################

  var colorCours;
  var colorProg;
  var colorEtude;
  var param;

  // activation ou desactivation du mode 'couleurs personnalisables'
  var btnPP = document.getElementById("btnPP");
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

  // activation ou desactivation du mode 'couleurs personnalisables'
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

  document.getElementById("prm").addEventListener("click", function(){
    var bout = document.getElementById("prm");
    var par = document.getElementById('paraaam');
    if (bout.checked) {
      par.style.display = "flex";
      console.log("BLA");
    }
    else {
      par.style.display = "none";
      console.log("BLOP");
    }
  });



 /**
  * Fonction qui met a jour les couleurs des surfaces representant les amenagements sur la carte
  *
  * @param {*} color0 : couleur des projets 'en cours'
  * @param {*} color1 : couleur des projets 'programmes'
  * @param {*} color2 : couleur des projets 'a l'etude'
  * @return le renderer modifie
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


 /**
  * Fonction qui convertit les couleurs du hexadecimal en rgb (+- la transparence)
  *
  * @param {*} hex : couleur en hexadecimales
  * @param {*} alpha  : la transparence
  * @returns la liste rgb +- la transparence
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
