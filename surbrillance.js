


/**
 * 
 * @param {*} view 
 * @param {*} map 
 * @param {*} layerGare 
 * @param {*} gareRenderer_defaut 
 */
function executeSurbrillance(view, map, layerGare, gareRenderer_defaut){

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



//definition de la projection Lambert93

var wgs84 = proj4.Proj('EPSG:4326');
proj4.defs("EPSG:2154","+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
var lambert93 = proj4.Proj("EPSG:2154");


//definition du style 1 de la couche gare

var gareRenderer_s1 = {
  "type": "simple",
  "field": "",
  "uniqueValueInfos": [],
  "symbol" :{
     type: "simple-marker",
     size: 30,
     color: "#FCD946"
   }
};


//definition du style 2 de la couche gare

var gareRenderer_s2 = {
  "type": "simple",
  "field": "",
  "symbol" :{
     type: "simple-marker",
     size: 30,
     color: "#060D9D"
   }
};


var boutonGares = document.getElementById("boutonGares");
var nom_gares = document.getElementById("nom_gares");


// On cree un ecouteur sur chacun des icones (= lignes) de metro et de RER

var classRER = document.getElementsByClassName("classRER");

for (var i = 0; i < classRER.length; i++) {
    classRER[i].addEventListener("click", sql_RER_METRO, false);

}

var classMETRO = document.getElementsByClassName("classMETRO");

for (var i = 0; i < classMETRO.length; i++) {
    classMETRO[i].addEventListener("click", sql_RER_METRO, false);

}


// Cette fonction permet d'afficher la ligne de RER ou metro demande par l'utilisateur

  function sql_RER_METRO(event){

    map.remove(gare);
    clearInterval(setInterVar);

    var query = layerGare.createQuery();
    if (event.target.value == "M1"){
      query.where = "res_com LIKE '%" + event.target.value +" /%' OR res_com LIKE '%" + event.target.value +"' ";
    }
    else {
      query.where = "res_com LIKE '%" + event.target.value +"%'";
    }

    query.outFields = ["x","y"];
    layerGare.queryFeatures(query).features;

    var liste = []

    // On parcourt l'ensemble des elements retournes par la requete
    layerGare.queryFeatures(query).then(function(response){
      response.features.forEach(function(item){

        // On construit un point avec des coordonnes WGS84
        var new_coord  = proj4(lambert93,wgs84,[item.attributes.x,item.attributes.y])
        var latitude = new_coord[1];
        var longitude = new_coord[0];

        var point = {
          type: "point",
          latitude: latitude,
          longitude: longitude,

        };

        var pointGraphic = new Graphic({
          geometry: point,
          attributes: {x: item.attributes.x , y: item.attributes.y }
        });

        liste.push(pointGraphic);

        });

        // on cree une nouvelle FeatureLayer a partir des Graphic crees precedemment
        gare = new FeatureLayer({
          source: liste,
          renderer:gareRenderer_s1,
          objectIdField: "FID",
        });

        // la couche potentiellement interogee par le cadre change
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

var p = [p1,p2,p3];

// permet de choisir la gare proposee comme celle que l'on desire rechercher
function changerNomGare(event){
  nom_gares.value = event.target.innerHTML;
}

// on agrandit le volet lors de la recherche de gares
function voletRecherche(event){
    volet.style.width = "600px";
}




// permet de proposer a l'utilisateur les 3 gares les plus proches (semantiquement) de celle qui 'l'est en train de chercher

function nomDeGare(event){

  // permet de mettre en majuscules
  nom_gares.value = nom_gares.value.toUpperCase();

  var liste = [];
  var query = layerGare.createQuery();
  query.where = "nom_long LIKE '" + nom_gares.value +"%'";
  query.outFields = ["nom_long"];
  layerGare.queryFeatures(query).features;

  layerGare.queryFeatures(query).then(function(response){
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


// permet a l'utilisateur de trouver la gare de son choix

function trouverGare(event){

  if(nom_gares.value != ""){

  var str = "" + nom_gares.value;
  var n = str.indexOf("'");
  var regex = /'/gi;

  gare_recherchee = str.replace(regex, "''");

  map.remove(gare);
  clearInterval(setInterVar);
  var liste = [];
  var query = layerGare.createQuery();

  query.where = "nom_long LIKE '" + gare_recherchee +"'"; // requete SQL du nom des gares

  query.outFields = ["x","y"];
  layerGare.queryFeatures(query).features;

  var new_coord;

  layerGare.queryFeatures(query).then(function(response){

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
          attributes: {x: item.attributes.x , y: item.attributes.y }
        });

        liste.push(pointGraphic);

      });

      // on cree une nouvelle FeatureLayer a partir des Graphic crees precedemment
      gare = new FeatureLayer({
        source: liste,
        renderer:gareRenderer_s1,
        objectIdField: "FID",
      });

      // la couche potentiellement interogee par le cadre change
      gare_surbrillance = gare;


      map.add(gare);
      clignoter(gare);

      // On centre la carte la ou se trouve la gare
      view.center.latitude = new_coord[1];
      view.center.longitude = new_coord[0];
      view.goTo({
        target: view.center
      });

    });


    // Une fois clique, on enleve les propositions de gares
    volet.style.width = "400px";
    nom_gares.value ="";
    p1.innerHTML ="";
    p2.innerHTML ="";
    p3.innerHTML ="";

}

}





// permet de faire clignoter les objets selectionnes en faisant alterner les
// deux styles 1 et 2 de la couche gare

var setInterVar;
renderer_encours = 1;

function clignoter(featurelayer){

clearInterval(setInterVar);
setInterVar = setInterval( function c(){

    if (renderer_encours == 1){
      featurelayer.renderer = gareRenderer_s2;
      renderer_encours = 2;
    }

    else {
      featurelayer.renderer = gareRenderer_s1;
      renderer_encours = 1;

}},1000); // le clignotement a lieu toutes les 1s (1000ms)

}




// #################### Affichage de l'outil Surbrillance ################### //


var metros = document.getElementById("metros");
var rer = document.getElementById("RER");
var metro = document.getElementById("METRO");
var rech = document.getElementById("RECHERCHE");


var boutonRER = document.getElementById("boutonRER");
var boutonMetro= document.getElementById("boutonMetro");
var boutonRecherche= document.getElementById("boutonRecherche");

var volet = document.getElementById("volet");


// 
/**
 * 
 * Reaction de la div RER en fonction du click sur le boutonRER
 */
document.getElementById("boutonRER").addEventListener("click", function(){

  if (rer.style.display == "flex") {
    map.remove(gare);
    gare_surbrillance = 0;
    gare = 0;
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


// Reaction de la div metro en fonction du clic sur le boutonMetro

document.getElementById("boutonMetro").addEventListener("click", function(){

  if (metro.style.display == "flex") {
    map.remove(gare);
    gare_surbrillance = 0;
    gare = 0;
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



// Reaction de la div recherche en fonction du click sur le boutonRecherche

document.getElementById("boutonRecherche").addEventListener("click", function(){
  if (rech.style.display == "flex") {
    map.remove(gare);
    gare_surbrillance = 0;
    gare = 0;
    volet.style.width = "400px";
    rech.style.display = "none";
    boutonRER.style.display ="block";
    boutonMetro.style.display ="block";
  }

  else {
  volet.style.width = "600px"
  rech.style.display = "flex";
  rech.style.width = '100%'
  boutonRER.style.display ="none";
  boutonMetro.style.display ="none";

  }
});


// ################ Reinitialisation de l'outil Surbrillance ################ //

// En fonction de la checkbox de l'outil surbrillance on reinitialise les variables

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
      rer.style.display = "none";
      metro.style.display = "none";
      rech.style.display = "none";
      metros.style.overflowY = "hidden";
      boutonRecherche.style.display = "block";
      boutonRER.style.display ="block";
      boutonMetro.style.display ="block";
    }

}, false);


})};
