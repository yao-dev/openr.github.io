// Initialisation des variables
var map;
var infowindow;
var service;
var departure;
var myPosition;
var nameCategory;
var directionsService;
var directionsDisplay;
var travelType = 'DRIVING';
var placeFound = [];
var infoPlace = [];
var tabParam = [];
var idid;
var trvlmode;

var tabId = [];
var tabAllType = [];
  tabAllType['restaurant'] = ["restaurant", "bar", "cafe", "food"];   
  tabAllType['movie'] = ["movie_theater"];   
  tabAllType['monument'] = ["monument"];   
  tabAllType['store'] = [
    "clothing_store", 
    "department_store", 
    "electronics_store", 
    "book_store", 
    "furniture_store", 
    "hardware_store",
    "jewelry_store",
    "shoe_store",
    "shopping_mall",
    "store"
    ];   
  tabAllType['hospital'] = ["hospital"];   
  tabAllType['doctor'] = ["doctor", "dentist"];   
  tabAllType['spa'] = ['spa'];   
  tabAllType['hair'] = ["beauty_salon", "hair_care"];   
  tabAllType['lodging'] = ["lodging"];   
  tabAllType['bank'] = ["bank", "atm"];   
  tabAllType['local-store'] = ["store", "shopping_mall", "bakery", "cafe", "food", "grocery_or_supermarket", "pharmacy", "laundry"];   
  tabAllType['gas_station'] = ["gas_station"];   

// Initialisation de la Map au chargement de la page
function initMap()
{

    directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer;

  // var paris = new google.maps.LatLng(48.8534100,2.3488000);
  map = new google.maps.Map(document.getElementById('map-canvas'));


  if (navigator.geolocation) 
  {
    navigator.geolocation.getCurrentPosition(successfunction, errorfunction);
  }

  // Autocomplétion de l'input
  departure = new google.maps.places.Autocomplete((document.getElementById('departure')), {types: ['geocode']});
  infoWindow = new google.maps.InfoWindow();
  service = new google.maps.places.PlacesService(map);  
}

$(document).ready(function()
{
  // Affichage de l'accueil
  $("#mosaique").click(function()
  {
    clearMarker();
    $("#list-place").empty();
    $("#header-result").empty();
    $("#content-result").empty();
    $('#place').fadeIn("slow");
  });

  // Au choix d'un lieu
  $("#place div").click(function()
  {
    clearMarker();
    $('#place').fadeOut();
    $("#list-place").hide();
    var placeType = $(this).attr('class');
    nameCategory = $(this).find('p');
    nameCategory = nameCategory['0'].innerHTML;

    // Affichage des lieux ouvert autour de ma position
    performSearch(placeType, myPosition);

    $("#list-place").append(
    "<h1>" + nameCategory + "</h1>" + 
    "<hr>"        
    );

    $("#list-place").fadeIn(3300);
  });

    // Clique sur .trajet pour avoir l'itinéraire
    $("#list-place").on('click', '.trajet' ,function()
    {

        directionsDisplay.setMap(map);
        var identifiant = $(this).attr('data-id');
        getTrajet(directionsService, directionsDisplay, identifiant);
    });

    // Clique sur .comments pour avoir les commentaire
    $("#list-place").on('click', '.view-comments' ,function()
    {
        var identifiant = $(this).attr('data-id');
        getComments(identifiant);
    });

    // TravelMode
    $("#home").on('click', 'li' ,function()
    {
        trvlmode = $(this).attr('class');
        idid = $(this).attr('data-id');

        switch (trvlmode) 
        {
            case 'fa fa-bus':
                removeLayer(tabParam, trvlmode);
                trvlmode = new google.maps.TransitLayer();
                tabParam.push(trvlmode);    
                travelType = 'TRANSIT';
                trvlmode.setMap(map);
                getTrajet(directionsService, directionsDisplay, idid);
            break;
            case 'fa fa-bicycle':
                removeLayer(tabParam, trvlmode);
                trvlmode = new google.maps.BicyclingLayer();
                tabParam.push(trvlmode);    
                travelType = 'BICYCLING';
                trvlmode.setMap(map);
                getTrajet(directionsService, directionsDisplay, idid);
            break;
            case 'fa fa-car':
                removeLayer(tabParam, trvlmode);
                trvlmode = new google.maps.TrafficLayer();
                tabParam.push(trvlmode);    
                travelType = 'DRIVING';
                trvlmode.setMap(map);
                getTrajet(directionsService, directionsDisplay, idid);
            break;
        }        
        getComments(identifiant);
    });
});

function removeLayer(tabParam, mode)
{
    for (var i = 0; i < tabParam.length; i++) 
    {
        mode.setMap(null);
    }
}

function getTrajet(directionsService, directionsDisplay, id)
{
    $("#header-result").remove();
    $("#content-result").empty();
    $("#result").append(
    "<div id=header-result>" + 
    "<h1 class=section>Itinéraire</h1>" + 
    "<hr>" +
    "<div id=content-result>" +
    "<ul class=travelmode>" +
    "<li data-id="+ id +" class='fa fa-car'></li>" +
    "<li data-id="+ id +" class='fa fa-bus'></li>" +
    "<li data-id="+ id +" class='fa fa-bicycle'></li>" +
    "</ul>" +
    "</div>" +
    "</div>"         
    );        

    var obj = tabId[id];  
    var arrived = obj[0].formatted_address;

    directionsService.route({
        origin: document.getElementById('departure').value,
        destination: arrived,
        travelMode: google.maps.TravelMode.DRIVING
        }, function(response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(response);
          directionsDisplay.setPanel(document.getElementById('content-result'));
          map.setZoom(13);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
    });   
}

function getComments(id)
{
    $("#header-result").remove();
    $("#content-result").empty();
    $("#result").append(
    "<div id=header-result>" + 
    "<h1 class=section>Les commentaires</h1>" + 
    "<hr>" +
    "<div id=content-result>" +
    "</div>" +
    "</div>"         
    );    

    var obj = tabId[id][0].reviews;
    for (var i = 0; i < obj.length; i++) 
    {
        var name = obj[i].author_name;
        var comment = obj[i].text;

        if (rating === 'undefined') 
        {
            obj[i].rating = "Aucune";
        }

        var rating = "Note: " + obj[i].rating;

        $("#content-result").append(
            "<p class=author>" + name + "</p>" +
            "<p>" + comment + "</p>" +
            "<p>" + rating + "</p>" +
            "<hr>" 
        );
    }
}

function errorfunction(error)
{
    console.log(error);
    alert('Un problème est survenu lors de la géolocalisation.');
}

function successfunction(position)
{
    myLatitude = position.coords.latitude;
    myLongitude = position.coords.longitude;
    getAddress();
}

function getAddress()
{
    myPosition = new google.maps.LatLng(myLatitude, myLongitude);
    geocoder = new google.maps.Geocoder();
    geoOptions = {
        "latLng" : myPosition
    };
    geocoder.geocode( geoOptions, function(results, status) 
    {
        /* Si les coordonnées ont pu être geolocalisées */
        if (status == google.maps.GeocoderStatus.OK) 
        {
            var address = results[0].formatted_address;
            centerMap(map, myPosition, 12);
            geolocMarker(map, address, myPosition);
            document.getElementById('departure').value = address;
        } 
        else 
        {
            alert("Les nouvelles coordonnées n'ont pu être géocodées avec succès.");
        }
    });
}

function centerMap(map, coords, zoom)
{
    map.panTo(coords);
    map.setZoom(zoom);
}

function geolocMarker(map, body, myPosition) 
{
  var img = {
    url: 'img/moi.png',
    size: new google.maps.Size(71, 71),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(0, 32),
    scaledSize: new google.maps.Size(40, 40)
  };
    
    myLoc = new google.maps.Marker({
        map : map, 
        position : myPosition,
        title: 'Je suis ici',
        icon: img,
        animation: google.maps.Animation.BOUNCE,
        draggable : false
    });

    // markerArray.push(myLoc);

    var infowindow = new google.maps.InfoWindow({
        content : body
    });

    new google.maps.event.addListener(myLoc, "click", function() {
        infowindow.open(map, myLoc);
    });
}

function performSearch(placeType, myPosition) 
{
  var request = {
    radius: 10000,
    location: myPosition,
    keyword: tabAllType[placeType]
  };
  service.radarSearch(request, callback);
}

function callback(results, status) 
{
  // map.setZoom(14);
  tabId = [];
  map.setCenter(myPosition);
  if (status !== google.maps.places.PlacesServiceStatus.OK) {
  console.error(status);
  return;
  }
  for (var i = 0, result; result = results[i]; i++) 
  {
    getDataPlace(result.place_id, result);
    if (i == 30) {return;};
  }
}

function addMarkerPlace(place) 
{
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  placeFound.push(marker);

  google.maps.event.addListener(marker, 'click', function() {
    service.getDetails(place, function(result, status) {
      if (status !== google.maps.places.PlacesServiceStatus.OK) {
        console.error(status);
        return;
      }
      infoWindow.setContent(result.name);
      infoWindow.open(map, marker);
    });
  });
}


function getDataPlace(place_id, newResult)
{
  var day = new Date();
  day = day.getDay();

  $.post('php/dataPlace.php', {id: place_id}).done(function(data){
    // console.log(JSON.parse(data));
    var data = JSON.parse(data);
    var note;
    var urlSite;
    var site;
    var photo;

    if (typeof data.result.opening_hours.open_now === 'undefined') 
    {      
      return false;
    } 
    
    if (data.result.opening_hours.open_now === true) 
    {
      addMarkerPlace(newResult);
      var open = data.result.opening_hours;
      infoPlace.push(data.result);
      if (typeof data.result.photos[0].photo_reference === 'undefined') 
      {
        photo = "#";
      }
      else
      {
        photo = data.result.photos[0].photo_reference;
      }

      if (typeof data.result.rating === "undefined") 
      {
        note = "Aucune";
      }
      else
      {
        note = data.result.rating + "/5";
      }
      
      if (typeof data.result.website === "undefined") 
      {
        urlSite = "#";
        site = "Aucun";
      }
      else
      {
        urlSite = data.result.website;
        site = data.result.website;
        site = site.substring(0, 35) + "...";
      }

      var addressPlace = data.result.formatted_address.substring(0, 50) + "...";
      var ouverture = open.periods[day].open.time.substring(0, 2) + "h" + open.periods[day].open.time.substring(2, 4);
      var fermeture = open.periods[day].close.time.substring(0, 2) + "h" + open.periods[day].close.time.substring(2, 4);
      // var locationPlace = data.result.formatted_address;

      tabId[place_id] = [data.result];

      $("#list-place").append(
        "<div class=place-1 id=result-place>" +
          "<img class=thumb src=https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference="+ photo +"&key=AIzaSyAw78f-CkBx5tXmkyWpbzd-xUoCWJsCyz0>" + 
          "<p class=title-place>" + data.result.name + "</p>" +
          "<p>" + addressPlace + "</p>" +
          "<p>" + data.result.formatted_phone_number + "</p>" +
          "<p>Ouvert de " + ouverture + " à " + fermeture + "</p>" +
          "<p>Note: " + note + "</p>" +
          "<p><a target=_blank href=" + data.result.url + ">Google+</a></p>" +
          '<p><a target=_blank href=' + urlSite + '>'+ site +'</a></p>' +
          "<a class='btn btn-success trajet' data-id="+ place_id +"><i class='fa fa-map-signs'></i> Itinéraire</a>" +
          "<a class='btn btn-primary add-favorite' data-id="+ place_id +"><i class='fa fa-plus-circle'></i> Ajouter à ma liste</a>" +
          "<a class='btn btn-primary view-comments' data-id="+ place_id +"><i class='fa fa-comment'></i> Avis</a>" +
        "</div>" 
      );    
    }
    // getDistancePlace(myPosition, locationPlace);
  });
}

function getDistancePlace(origin, destination)
{
  $.post('php/dataPlace.php', {origin: origin, destination: destination}).done(function(data) {
    console.log(JSON.parse(data));
  });
}

function clearMarker()
{
  for(var i = 0; i < placeFound.length; i++)
  {
    placeFound[i].setMap(null);
  }

  placeFound = [];
}