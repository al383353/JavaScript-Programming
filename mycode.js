$Google_Key= "AIzaSyDBRx0crV33B-rLPoQr7SkYl4_ZrUOZzig";
$OWM_Key = "8c8a482f0c519bcc56bf79715ea71154";
$service_url="http://api.openweathermap.org/data/2.5/find?";

var currentStation;
var stations;

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
$(document).on("pagebeforeshow","#home",function() {
    $(document).on("click","#to_details",function(e) {
        //Stop more events
        e.preventDefault();
        e.stopImmediatePropagation();
        //Store the current item in the list
        currentStation = stations[e.target.children[0].id];
        //Change to the new page
        $.mobile.changePage("#details");

    });

});

//Event to Populate UI of Details
$(document).on("pagebeforeshow","#details",function(e) {
    e.preventDefault();

    //Get Icon
    $('#stationIcon').attr('src','http://openweathermap.org/img/w/'+currentStation.weather[0].icon+'.png');
    //Rest of data
    $('#stationName').text(currentStation.name);
    $('#stationDescription').text(currentStation.weather[0].description);
    $('#stationTemperature').text('Temperature: '+currentStation.main.temp+' º');
    $('#stationHumidity').text('Humidity: '+currentStation.main.humidity+' %');
    $('#stationPressure').text('Pressure: '+currentStation.main.pressure+' hpa');


});


//Populate the data from service to the UI
function PopulateList($lat, $lon) {
    $.getJSON($service_url+"appid="+$OWM_Key+"&lat="+$lat+"&lon="+$lon+"&cnt=20&units=metric", function (data) {
        stations = data.list;
        //Remove Previous ones
        $('#stations_list li').remove();
        //Add new stations to the listview
        $.each(stations, function (index, station) {
            $('#stations_list').append('<li><a id="to_details" href="#">'+station.name+'<span id="'+index+'" class="ui-li-count">'+Math.round(station.main.temp)+'º</span></a></li>');
        });
        //Refresh list
        $('#stations_list').listview('refresh');

    });
}