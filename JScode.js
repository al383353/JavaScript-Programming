$Google_Key= "AIzaSyDBRx0crV33B-rLPoQr7SkYl4_ZrUOZzig";
$service_url="https://places.cit.api.here.com/places/v1/autosuggest?at=39.9864,-0.05133&q=parks&app_id=v1OI8ORA0wpSOsagfLPx&app_code=A8_9yqXwiT6ZJP6vJW7NzA&cat=recreation";
var nearestParks;
var parks;
//Adding leaflet map
   $(window).load(function(){
        var element = $('#mapPage');
        element.height(element.height() - 42);
        var map = L.map('map').setView([39.984, -0.044], 13);
                    var Esri_WorldStreetMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
            }).addTo(map);
//Add marker
        $.getJSON($service_url, function (data) {
            parks = data.results;
            console.log(parks);
            $.each(parks, function (index, park) {
                if(parks.indexOf(park)>1 && parks.indexOf(park)<17){
                    var marker = L.marker([park.position[0], park.position[1]]).addTo(map);
                    marker.bindPopup(park.title);
            }
            });
        });

   });
   
   //var marker = L.marker([39.984, -0.044]).addTo(map);
//console.log(marker);
//Refresh button event
$(document).on("click","#refresh",function() {
    //Prevent the usual navigation behaviour
    event.preventDefault();
    //Get User Location
    $.post("https://www.googleapis.com/geolocation/v1/geolocate?key="+$Google_Key,function(result){
        PopulateList(result.location.lat,result.location.lng);
    });
});


//Events to Navigate to Details
$(document).on("pagebeforeshow","#mapPage",function() {
    $(document).on("click","#to_details",function(e) {
        //Stop more events
        e.preventDefault();
        e.stopImmediatePropagation();
        //Store the current item in the list
        nearestParks = parks[e.target.children[0].id];
        //Change to the new page
        $.mobile.changePage("#details");

    });

});

//Event to Populate UI of Details
$(document).on("pagebeforeshow","#details",function(e) {
    e.preventDefault();
    //Rest of data
    $('#ParkName').text(nearestParks.title);
    $('#distance').text('Distance: '+parseFloat(nearestParks.distance/1000).toFixed(2)+' Km');
    $('#category').text('Services: '+nearestParks.category);
    $('#address').text('Address: '+nearestParks.vicinity);
});

//by using if not displaying the first two and the last three results, add leaflet map, add marker of parks into map

//Populate the data from service to the UI
function PopulateList($lat, $lon) {
    $.getJSON($service_url, function (data) {
        parks = data.results;
        console.log(parks);
        //Remove Previous ones
        $('#parks_list li').remove();
        //Add new stations to the listview
        $.each(parks, function (index, park) {
            if(parks.indexOf(park)>1 && parks.indexOf(park)<17){
            $('#parks_list').append('<li><a id="to_details" href="#">'+park.title+'<span id="'+index+'" class="ui-li-count">'+parseFloat(park.distance/1000).toFixed(2)+'Km</span></a></li>');
        }
        });
        //Refresh list
        $('#parks_list').listview('refresh');

    });
}