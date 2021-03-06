d3.json("/api/v1.0/current-listings", function(data){
      // Pull the price field off of response.data
  data.forEach(function(d) {
    d.price = parseFloat((d.price).replace(/[^\d\.]/, ''))

  });

  // Initialize an array to hold price tiers
  var first = [];
  var second=[];
  var third=[];
  var fourth=[];
// console.log(data)
  // Loop through the listings array
  for (var i = 0; i < data.length; i++) {
    var listing = data[i];


    // console.log(listing.price)
    //create a function to color each listing by price tier
    function getColor(d) {
      return d >= 300 ? 'FireBrick' : // Means: if (d >= 1966) return 'green' else…
        d >= 200 ? 'Khaki' : // if (d >= 1960) return 'black' else etc…
        d >= 100 ? 'DodgerBlue' :
        d >= 0 ? 'MediumSeaGreen' : // Note that numbers must be in descending order
        'grey';
    }

// create circle markers for each listing using the color function
      var circleMarker=L.circle([listing.latitude, listing.longitude], {
        color: getColor(listing.price),
        fillColor: getColor(listing.price),
        fillOpacity: 0.75,
        radius: 10
      }).bindPopup("<h5>"+listing.name+ "</br>"+"Price Per Night: $"+listing.price+"</h5>"+"<img src=" +listing.picture_url+ " alt='Italian Trulli' style='width:125px;height:100px;'>" + "</br>" + "Check Availability: <a href=" +listing.listing_url + ">here</a>");

    // Add the marker to the appropriate price tier array
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

    //loop through listings to create a count of listings per neighborhood
    //create a list of all prices per neighborhood
    //divide the sum by the count of listings per neighborhood using the function to make a new array altered from an existing array?
    function neighborhoodcount(hood) {
    
      // An object to hold neighborhood data
      var hoods_count = {};
    
      // Iterate through the array
      for (var i = 0; i < data.length; i++) {
        var hood = data[i].neighbourhood_cleansed;
    
        // If the neighborhood has been seen before...
        // if (currenthood in hoods) {
        if (hoods_count[hood]) {
          // Add one to the counter
          hoods_count[hood] += 1;
        }
        else {
          // Set the counter at 1
          hoods_count[hood] = 1;
        }

      }
      // console.log(wordFrequency);
      return hoods_count;
    }
  //  console.log(neighborhoodcount(data));
  }


  function neighborhoodsum(hood) {
    var hoods_price = {};

    for (var i = 0; i < data.length; i++) {
      var hood = data[i].neighbourhood_cleansed;
      var price = data[i].price;

    //If the neighborhood has been seen before
      if (hoods_price[hood]) {
      // add the price to the sum
        hoods_price[hood] += parseFloat(hoods_price[price]);
      }
      else {
        hoods_price[hood] = (hoods_price[hood] || 0) + parseFloat(hoods_price[price]);
      
      }

    }
    return hoods_price;
  }

  console.log(neighborhoodsum(data));



 // console.log(neighborhoodcount(data));

 new_object = neighborhoodcount(data);

 console.log(Object.keys(new_object));
  x_axis = Object.keys(new_object)
  y_axis = Object.values(new_object)

  var trace1 = {
    x: x_axis,
    y: y_axis,
    type: "bar"
  };
  
  var data = [trace1];
  
  var layout = {
    title: "Listings by neighborhood",
    xaxis: { title: "Neighborhood"},
    yaxis: { title: "# of listings"}
  };
  
  Plotly.newPlot("plot", data, layout);
  


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

  var streetMap=L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  // Create a baseMaps object to hold the lightmap layer
  var baseMaps = {
    "Light Map": lightmap,
    "Street Map": streetMap
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
    layers: [lightmap, thirdlayer]
  });

 
  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps,{
    collapsed: false
  }).addTo(map);

// create dropdown menu for antire home, single room, or shared room
  var legend1 = L.control({position: 'topright'});
legend1.onAdd = function (map) {
var div = L.DomUtil.create('div', 'info legend');
div.innerHTML = '<select><option>Entire home/apt</option><option>Private room</option><option>Shared room</option></select>';
div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
return div;
};
legend1.addTo(map);



// create a dropdown for neighborhood selection
var legend2 = L.control({position: 'topright'});
legend2.onAdd = function (map) {
var div = L.DomUtil.create('div', 'info legend');
div.innerHTML = '<select><option>Bayview</option><option>Bernal Heights</option><option>Castro/Upper Market</option> \
<option>Chinatown</option><option>Crocker Amazon</option><option>Diamond Heights</option><option>Downtown/Civic Center</option> \
<option>Excelsior</option><option>Financial District</option><option>Glen Park</option><option>Golden Gate Park</option> \
<option>Haight Ashbury</option><option>Inner Richmond</option><option>Inner Sunset</option><option>Lakeshore</option> \
<option>Marina</option><option>Mission</option><option>Nob Hill</option><option>Noe Valley</option> \
<option>North Beach</option><option>Ocean View</option><option>Outer Mission</option> \
<option>Outer Richmond</option><option>Outer Sunset</option><option>Pacific Heights</option> \
<option>Parkside</option><option>Potrero Hill</option><option>Presidio</option> \
<option>Presidio Heights</option><option>Russian Hill</option><option>Seacliff</option> \
<option>South of Market</option><option>Treasure Island/YBI</option><option>Twin Peaks</option> \
<option>Visitacion Valley</option><option>Western Addition</option><option>Seacliff</option></select>';
 div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
 
return div;
};
legend2.addTo(map);


// Our style object
var mapStyle = {
  color: "white",
  fillColor: "orange",
  fillOpacity: 0.05,
  weight: 2.5
};

L.geoJSON(neighborhoods, {
  style: mapStyle,
//  Called on each feature
  onEachFeature: function(feature, layer) {
    // Set mouse events to change map styling
    layer.on({
      // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
      mouseover: function(event) {
        layer = event.target;
        layer.setStyle({
          fillOpacity: 0.5
        });
      },
      // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
      mouseout: function(event) {
        layer = event.target;
        layer.setStyle({
          fillOpacity: 0.05
        });
      },
      // When a feature (neighborhood) is clicked, it is enlarged to fit the screen
      click: function(event) {
        map.fitBounds(event.target.getBounds());
      }
       });
  //  Giving each feature a pop-up with information pertinent to it
    // layer.bindPopup("<h2>" + feature.properties.neighbourhood + "</h2><h3>" + feature.properties. );

    }
}).addTo(map);

});

