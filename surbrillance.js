function executeSurbrillance(view, map, gare1, gareRenderer_defaut){

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
    "esri/geometry/Point",
    "dojo/domReady!"

  ], function (Map, MapView, WebMap, FeatureLayer, Query, QueryTask, Graphic, GraphicsLayer, SimpleLineSymbol, SimpleFillSymbol,
        UniqueValueRenderer, Color, WebStyleSymbol, Point) {



var wgs84 = proj4.Proj('EPSG:4326');
proj4.defs("EPSG:2154","+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
var lambert93 = proj4.Proj("EPSG:2154");



var gareRenderer_s1 = {
  "type": "simple",
  "field": "",
  "uniqueValueInfos": [],
  "symbol" :{
     type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
     size: 30,
     color: "yellow"
   }
};

var gareRenderer_s2 = {
  "type": "simple",
  "field": "",
  "symbol" :{
     type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
     size: 30,
     color: "blue"
   }
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



  // On récupère l'id de l'ensemble des élements de la carte

  window.addEventListener("load", requeteSQL_toutID, false);

  function requeteSQL_toutID(event){
      var query = gare1.createQuery();
      query.outFields = ["id_ref_zdl"];
      gare1.queryFeatures(query).features;

      var liste = [];
      var liste_RER = [];
      gare1.queryFeatures(query).then(function(response){
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

id = 0;

  function requeteSQLRER(event){

    map.remove(gare);
    clearInterval(setInterVar);

    var query = gare1.createQuery();
    if (event.target.value == "M1"){
      query.where = "res_com LIKE '%" + event.target.value +" /%' OR res_com LIKE '%" + event.target.value +"' ";
    }
    else {
      query.where = "res_com LIKE '%" + event.target.value +"%'";
    }

    query.outFields = ["x","y"];
    gare1.queryFeatures(query).features;

    var liste = []
    gare1.queryFeatures(query).then(function(response){
      response.features.forEach(function(item){

        var new_coord  = proj4(lambert93,wgs84,[item.attributes.x,item.attributes.y])
        var latitude = new_coord[1];
        var longitude = new_coord[0];

        var point = {
          type: "point",
          latitude: latitude,
          longitude: longitude
        };

        var pointGraphic = new Graphic({
          geometry: point,
        });

        liste.push(pointGraphic);

        });

        gare = new FeatureLayer({
          source: liste, // autocast from an array of esri/Graphic
          renderer:renderer1,
          objectIdField: "FID",
        });

        id = gare.id;
        console.log(gare.id);

        gare_surbrillance = gare;

        map.add(gare);
        renderer_encours = 1;
        clignoter(gare);

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
  var query = gare1.createQuery();
  query.where = "nom_long LIKE '" + nom_gares.value +"%'";
  query.outFields = ["nom_long"];
  gare1.queryFeatures(query).features;

  gare1.queryFeatures(query).then(function(response){
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

  map.remove(gare);
  clearInterval(setInterVar);
  liste = [];
  var query = gare1.createQuery();
  console.log(nom_gares.value);
  query.where = "nom_long LIKE '" + nom_gares.value +"%'";
  console.log(query.where);
  query.outFields = ["x","y"];
  gare1.queryFeatures(query).features;

  gareRenderer_s1.uniqueValueInfos = [];
  var new_coord;

  gare1.queryFeatures(query).then(function(response){

    response.features.forEach(function(item){


        new_coord  = proj4(lambert93,wgs84,[item.attributes.x,item.attributes.y])
        var latitude = new_coord[1];
        var longitude = new_coord[0];

        var point = {
          type: "point",
          latitude: latitude,
          longitude: longitude
        };

        var pointGraphic = new Graphic({
          geometry: point,
        });

        liste.push(pointGraphic);


      });

      console.log(liste);
      gare = new FeatureLayer({
        source: liste, // autocast from an array of esri/Graphic
        renderer:renderer1,
        objectIdField: "FID",
      });

      gare_surbrillance = gare;

      map.add(gare);
      renderer_encours = 1;
      clignoter(gare);


      view.center.latitude = new_coord[1];
      view.center.longitude = new_coord[0];

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

var setInterVar;
renderer_encours = 0;


function clignoter(featurelayer){

clearInterval(setInterVar);
setInterVar = setInterval( function c(){

    if (renderer_encours == 1){
      featurelayer.renderer = renderer2;
      renderer_encours = 2;
    }

    else {
      featurelayer.renderer = renderer1;
      renderer_encours = 1;


}},1000);

}



 //////////////////////// CONCERNE L'AFFICHAGE ///////////////////////////////


var metros = document.getElementById("metros");
var rer = document.getElementById("RER");
var metro = document.getElementById("METRO");
var rech = document.getElementById("RECHERCHE");


var boutonRER = document.getElementById("boutonRER");
var boutonMetro= document.getElementById("boutonMetro");
var boutonRecherche= document.getElementById("boutonRecherche");

var volet = document.getElementById("volet");


// Réaction de la div RER en fonction du click sur le boutonRER


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


// Réaction de la div metro en fonction du click sur le boutonMetro

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


// Réaction de la div recherche en fonction du click sur le boutonRecherche

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


//////////////////////////// REINITIALISATION /////////////////////////////////

// En fonction de la checkbox de l'outil on effectue des réinitialisations



surbrillance.addEventListener("change", function parametres_Defaut(event){


if(surbrillance.checked){
      gare = new FeatureLayer();
    }

    else {
      map.remove(gare);
      clearInterval(setInterVar);
      gare_surbrillance = 0;
      renderer_encours = 0;
      gare = 0;
    }

}, false);


})};
