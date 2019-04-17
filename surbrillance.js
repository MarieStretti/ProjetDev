//initialisation du niveau de zoom
var zoomlevel = 11;
var lng_c = 2.4;
var lat_c = 48.8;

// import modules d'esri et fcts
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


var wgs84 = proj4.Proj('EPSG:4326');
proj4.defs("EPSG:2154","+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
var lambert93 = proj4.Proj("EPSG:2154");

  var map = new WebMap({
    portalItem: {
      id: "9c41116150794b6d899503bb1dc2af2f"
    }
  });


  var symbolTrain = new WebStyleSymbol({
  name: "Train",
  styleName: "EsriIconsStyle"
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


var boutonGares = document.getElementById("boutonGares");
var nom_gares = document.getElementById("nom_gares");


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


// On ajoute la couche à la carte
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


  view.center.longitude = lng_c;
  lng_c = view.center.longitude;
  view.center.latitude = lat_c;
  lat_c = view.center.latitude;


  view.ui.move(["zoom","map"],"top-right");

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

// Commande vocale
commande_voc (view,map);



///cadre

/// CADRE DE COULEUR
var cadreNord  = document.getElementById('cadreNord');
var cadreOuest = document.getElementById('cadreOuest');
var cadreEst   = document.getElementById('cadreEst');
var cadreSud   = document.getElementById('cadreSud');


/// préparation des projections de coordonnées avec proj4
var wgs84 = proj4.Proj('EPSG:4326');
console.log(wgs84);

proj4.defs("EPSG:2154","+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");

var lambert93 = proj4.Proj("EPSG:2154");
console.log(lambert93);

var firstProjection = wgs84 ;
var secondProjection = lambert93;


/// stockage des coordonnées de TOUS LES POINTS
var query = gare.createQuery();
query.outFields = ["x","y"];
gare.queryFeatures(query).features;
var liste_points = [];
gare.queryFeatures(query).then(function(response){
  response.features.forEach(function(item){
      liste_points.push([item.attributes.x,item.attributes.y]); // on rajoute les couples [x,y] aux coordonnées
  });
});

var boutonCadre = document.getElementById("boutonCadre");
boutonCadre.addEventListener("click", RefreshCadre);

///////// au clic : activation du cadre ///////////////////////:
function RefreshCadre() {

  console.log('start!');


////  coordonnées d'emprise actuelle de la carte /////

  var size   =  view.size; // emprise en pixels de la carte
  var width  = size[1]; // longueur de la carte
  var height = size[0]; // largeur de la carte
  var pix_x_center = height/2;
  var pix_y_center = width/2;

  console.log("center : ",view.toMap({x: pix_x_center, y:pix_y_center}));
  // dimensions du polygone d'emprise
  var dx = (height/2);
  var dy = (width/2);

  console.log("dx, dy : ",dx, dy);
  var pix_x_ouest = pix_x_center - dx;
  var pix_x_est = pix_x_center + dx;
  var pix_y_nord = pix_y_center - dy; /// pixels != lon/lat !!!!!
  var pix_y_sud = pix_y_center + dy;

  // coordonnées des 'coins' de la carte en pixels > 80% de l'emprise environ
  var lat_nord = view.toMap({x: pix_x_est, y:pix_y_nord}).latitude; console.log('lat_nord',lat_nord);
  var lat_sud = view.toMap({x: pix_x_est, y:pix_y_sud}).latitude; console.log('lat_sud',lat_sud);
  var lon_ouest = view.toMap({x: pix_x_ouest, y:pix_y_nord}).longitude; console.log('lon_ouest',lon_ouest);
  var lon_est = view.toMap({x: pix_x_est, y:pix_y_nord}).longitude; console.log('lon_est',lon_est);

  console.log("###### Emprise de la view ######");
  console.log("O > ",lon_ouest);
  console.log("E > ",lon_est);
  console.log("N > ",lat_nord);
  console.log("S > ",lat_sud);

//// CONVERSION DE COORDONNES D'EMPRISE AVEC PROJ4 //////

  var new_coord1 = proj4(firstProjection,secondProjection,[lon_ouest,lat_sud]); // lon lat : point sud ouest
  var new_coord2 = proj4(firstProjection,secondProjection,[lon_est,lat_nord]); // lon lat : point nord est

  var y_nord  = new_coord2[1];
  var x_est   = new_coord2[0];
  var y_sud   = new_coord1[1];
  var x_ouest = new_coord1[0];

  // initialisation des conteneurs du nombre des points dans chaque direction
  var points_NSEO = [0,0,0,0];
  var cadres_NSEO = [cadreNord, cadreSud, cadreEst,cadreOuest];


//////// DETECTION DE LA POSITION DES POINTS     /////////
  for (var i = 0; i < liste_points.length; i++) {

    var x = liste_points[i][0]; /// EN LAMBERT 93
    var y = liste_points[i][1]; /// EN LAMBERT 93

    if (x < x_ouest){ // point à gauche
      points_NSEO[3] +=1;
    }
    if (x > x_est){ // point à droite
      points_NSEO[2] +=1;
    }
    if (y > y_nord){ // point en haut
      points_NSEO[0] +=1;
    }
    if (y < y_sud){ // point en bas
      points_NSEO[1] +=1;
    }
  }
  console.log("####### nombre de points détectés dans les quadrants #######")
  console.log("N : ",points_NSEO[0]);
  console.log("S : ",points_NSEO[1]);
  console.log("E : ",points_NSEO[2]);
  console.log("O : ",points_NSEO[3]);
  console.log("total : ",points_NSEO[3]+points_NSEO[1]+points_NSEO[2]+points_NSEO[0])


  //////// modification de la couleur des cadres   //////////////////:
  var couleurs_croissantes = ["lightgrey","lightgreen","gold","orange","tomato","fuchsia","purple","blue","darkblue"];

  for (var i = 0; i<4 ; i++){
    cadres_NSEO[i].innerHTML = points_NSEO[i];
    if (points_NSEO[i] >= 700){
      cadres_NSEO[i].style.background = couleurs_croissantes[8];
    }else if (points_NSEO[i] >= 600){
      cadres_NSEO[i].style.background = couleurs_croissantes[7];
    }else if (points_NSEO[i] >= 500){
      cadres_NSEO[i].style.background = couleurs_croissantes[6];
    }else if (points_NSEO[i] >= 400){
      cadres_NSEO[i].style.background = couleurs_croissantes[5];
    }else if (points_NSEO[i] >= 300){
      cadres_NSEO[i].style.background = couleurs_croissantes[4];
    }else if (points_NSEO[i] >= 200){
      cadres_NSEO[i].style.background = couleurs_croissantes[3];
    }else if (points_NSEO[i] >= 100){
      cadres_NSEO[i].style.background = couleurs_croissantes[2];
    }else if (points_NSEO[i] >= 50){
      cadres_NSEO[i].style.background = couleurs_croissantes[1];
    }else{
      cadres_NSEO[i].style.background = couleurs_croissantes[0];
    };
  };
  console.log('bg : ',cadreNord.style.background);
};






  // On récupère l'id de l'ensemble des élements de la carte

  window.addEventListener("load", requeteSQL_toutID, false);

  function requeteSQL_toutID(event){
      var query = gare.createQuery();
      query.outFields = ["id_ref_zdl"];
      gare.queryFeatures(query).features;

      var liste = [];
      var liste_RER = [];
      gare.queryFeatures(query).then(function(response){
        response.features.forEach(function(item){
            liste.push(item.attributes.id_ref_zdl);
          });
        });
    }


  // On crée une requête SQL sur la couche gare

  var classRER = document.getElementsByClassName("classRER");

  for (var i = 0; i < classRER.length; i++) {
    classRER[i].addEventListener("click", requeteSQLRER, false);

  }


  var classMETRO = document.getElementsByClassName("classMETRO");

  for (var i = 0; i < classMETRO.length; i++) {
    classMETRO[i].addEventListener("click", requeteSQLRER, false);

  }

  function requeteSQLRER(event){
    var L = [];
    var query = gare.createQuery();
    if (event.target.value == "M1"){
      query.where = "res_com LIKE '%" + event.target.value +" /%' OR res_com LIKE '%" + event.target.value +"' ";
    }
    else {
      query.where = "res_com LIKE '%" + event.target.value +"%'";
    }

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

nom_gares.addEventListener("input", nomDeGare, false);
nom_gares.addEventListener("click", voletRecherche, false);

var p1 = document.getElementById("p1");
var p2 = document.getElementById("p2");
var p3 = document.getElementById("p3");

p1.addEventListener("click", changerNomGare, false);
p2.addEventListener("click", changerNomGare, false);
p3.addEventListener("click", changerNomGare, false);


function changerNomGare(event){
  nom_gares.value = event.target.innerHTML;
}


function voletRecherche(event){

    volet.style.width = "1300px";
}


var p = [p1,p2,p3];

function nomDeGare(event){
  nom_gares.value = nom_gares.value.toUpperCase();
  liste = [];
  var query = gare.createQuery();
  query.where = "nom_long LIKE '" + nom_gares.value +"%'";
  query.outFields = ["nom_long"];
  gare.queryFeatures(query).features;

  gare.queryFeatures(query).then(function(response){
    response.features.forEach(function(item){
        liste.push(item.attributes.nom_long);

      });

      for (var i = 0; i < 3; i++) {
        if (liste[i] == undefined){
          p[i].innerHTML = "";
        }

        else{
          p[i].innerHTML = liste[i];
        }

      }



    });

}


boutonGares.addEventListener("click", trouverGare, false);


function trouverGare(event){

  liste = [];
  var query = gare.createQuery();
  console.log(nom_gares.value);
  query.where = "nom_long LIKE '" + nom_gares.value +"%'";
  console.log(query.where);
  query.outFields = ["id_ref_zdl","x","y"];
  gare.queryFeatures(query).features;

  gareRenderer_s1.uniqueValueInfos = [];
  var new_coord1 =[];
  gare.queryFeatures(query).then(function(response){
    response.features.forEach(function(item){
        liste.push(item.attributes.id_ref_zdl);
        new_coord1 = proj4(lambert93,wgs84,[item.attributes.x,item.attributes.y]);


      });

      console.log(liste);
      gareRenderer_s1.uniqueValueInfos.push({
        "value":liste[0],
        "symbol": {
          "color": [0, 255, 0, 255],
          "size": 30,
          "type": "simple-marker",
        }}
      )

        gareRenderer_s2.uniqueValueInfos = JSON.parse(JSON.stringify(gareRenderer_s1.uniqueValueInfos));
        gareRenderer_s2.uniqueValueInfos[0].symbol.color = [255,255,0,255];

        map.add(gare);
        renderer1 = gareRenderer_s1;
        renderer2 = gareRenderer_s2;
        renderer_encours = 1;
        clearInterval(setInterVar);
        setInterVar = setInterval(clignoter,1000);


        view.center.latitude = new_coord1[1];
        view.center.longitude = new_coord1[0];

        view.goTo({
          target: view.center
        });


    });
    volet.style.width = "400px";
    nom_gares.value ="";
    p1.innerHTML ="";
    p2.innerHTML ="";
    p3.innerHTML ="";


}

setInterVar = 0;
renderer_encours = 0;

//gareRenderer_s1.onclick(console.log(uniqueValueInfos.)

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

var metros = document.getElementById("metros");
var rer = document.getElementById("RER");
var metro = document.getElementById("METRO");
var rech = document.getElementById("RECHERCHE");

var boutonRER = document.getElementById("boutonRER");
var boutonMetro= document.getElementById("boutonMetro");
var boutonRecherche= document.getElementById("boutonRecherche");

var volet = document.getElementById("volet");




document.getElementById("boutonRER").addEventListener("click", function(){

  if (rer.style.display == "flex") {
    rer.style.display = "none";
    boutonMetro.style.display ="block";
    boutonRecherche.style.display ="block";


  }
  else {
    rer.style.display = "flex";
    boutonMetro.style.display ="none";
    boutonRecherche.style.display ="none";

  }
});


document.getElementById("boutonMetro").addEventListener("click", function(){

  if (metro.style.display == "flex") {
    metro.style.display = "none";
    boutonRER.style.display ="block";
    boutonRecherche.style.display ="block";
    boutonMetro.style.overflowY = "none";
  }
  else {
    metro.style.display = "flex";
    metros.style.overflowY = "scroll";
    boutonMetro.style.overflowY = "none";


    boutonRER.style.display ="none";
    boutonRecherche.style.display ="none";
  }
});



document.getElementById("boutonRecherche").addEventListener("click", function(){
  if (rech.style.display == "flex") {
    volet.style.width = "400px";
    rech.style.display = "none";
    boutonRER.style.display ="block";
    boutonMetro.style.display ="block";
  }

  else {
  volet.style.width = "1300px"
  rech.style.display = "flex";
  boutonRER.style.display ="none";
  boutonMetro.style.display ="none";
  }
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
