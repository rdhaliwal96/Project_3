d3.json("/api/v1.0/current-listings", function(data){
      // Pull the "stations" property off of response.data
  data.forEach(function(d) {
    d.price = parseFloat((d.price).replace(/[^\d\.]/, ''))

  });

  // Initialize an array to hold bike markers
  var first = [];
  var second=[];
  var third=[];
  var fourth=[];
// console.log(data)
  // Loop through the stations array
  for (var i = 0; i < data.length; i++) {
    var listing = data[i];

//     var floatedValue = parseFloat((listing.price).replace(/[^\d\.]/, ''));
// console.log(floatedValue);
    // console.log(listing.latitude)
    // For each station, create a marker and bind a popup with the station's name
    // var roomMarker = L.marker([listing.latitude, listing.longitude])
    //   .bindPopup("<h3>" + listing.name + "<h3><h3>Location: " + listing.neighbourhood + "<h3>");
    // console.log(listing.price)
    function getColor(d) {
      return d >= 300 ? 'FireBrick' : // Means: if (d >= 1966) return 'green' else…
        d >= 200 ? 'Khaki' : // if (d >= 1960) return 'black' else etc…
        d >= 100 ? 'DodgerBlue' :
        d >= 0 ? 'MediumSeaGreen' : // Note that numbers must be in descending order
        'grey';
    }


      var circleMarker=L.circle([listing.latitude, listing.longitude], {
        color: getColor(listing.price),
        fillColor: getColor(listing.price),
        fillOpacity: 0.75,
        radius: 10
      }).bindPopup("<h5>"+listing.name+ "</br>"+"Price Per Night: $"+listing.price+"</h5>"+"</br>"+"Lisiting Link: "+listing.listing_url);

    // Add the marker to the bikeMarkers array
    // roomMarkers.push(roomMarker);
    if (listing.price>=300){
      first.push(circleMarker)
    } else if (listing.price>=200){
      second.push(circleMarker)
    } else if (listing.price>=100){
      third.push(circleMarker)
    } else {
      fourth.push(circleMarker)
    }

  }
// var layers=L.layerGroup(roomMarkers)
var firstlayer=L.layerGroup(first);
var secondlayer=L.layerGroup(second);
var thirdlayer=L.layerGroup(third);
var fourthlayer=L.layerGroup(fourth);



  // Create the tile layer that will be the background of our map
  var lightmap= L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  // Create a baseMaps object to hold the lightmap layer
  var baseMaps = {
    "Light Map": lightmap
  };

  // Create an overlayMaps object to hold the bikeStations layer
  var overlayMaps = {
    "$0-$100 Per Night": fourthlayer,
    "$100-$200 Per Night": thirdlayer,
    "$200-$300 Per Night": secondlayer,
    "$300 and above": firstlayer

  };


  // Create the map object with options
var map=L.map("map", {
    center: [37.77, -122.41],
    zoom: 12,
    layers: [lightmap, firstlayer]
  });

 
  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps,{
    collapsed: false
  }).addTo(map);


  var legend1 = L.control({position: 'topright'});
legend1.onAdd = function (map) {
var div = L.DomUtil.create('div', 'info legend');
div.innerHTML = '<select><option>1</option><option>2</option><option>3</option></select>';
div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
return div;
};
legend1.addTo(map);

var legend2 = L.control({position: 'topright'});
legend2.onAdd = function (map) {
var div = L.DomUtil.create('div', 'info legend');
div.innerHTML = '<select><option>1</option><option>2</option><option>3</option></select>';
div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
return div;
};
legend2.addTo(map);


});