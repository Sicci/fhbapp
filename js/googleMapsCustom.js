var map,
    currentPosition,
    directionsDisplay,
    directionsService,
    destinationLatitude,
    destinationLongitude,
    cornerTopLeft,
    cornerBotRight,
    studentInFHbool,
    directionTravelMode;

// Updates your current location (e.g. entered a room) in latitue and longitude
function updateCurrentLocation(lati,lngi) {
    console.log(lati+" latCurrentBefore");
    console.log(currentPosition+" currentPositionBefore");
    if (currentPosition.lat() == 0 ){
        currentPosition = new google.maps.LatLng(lati, lngi);
    }
    console.log(currentPosition+" currentAfter");
}

// Sets the target location in latitue and longitude
function setDestinationLocation(lat,lng) {
    console.log(lat+" latTargetBefore");
    if (lat != 0 ){
        console.log(lat+" latTarget");
        console.log(lng+" lngTarget");
        destinationLatitude = lat;
        destinationLongitude = lng;
        initializeMapAndCalculateRoute(currentPosition.lat(), currentPosition.lng());
    }
}

// Callback when Google Maps connection denied
function locError(error) {
    studentInFHbool = true;
    currentPosition = new google.maps.LatLng(0,0);
    console.log("error: the current position could not be located");
    //$("#map_canvas").html("Google Maps nicht erreichbar.");
    updatePositionDetails();
}

// Callback when Google Maps connection accessed and completed
function locSuccess(pos) {
    currentPosition = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
    studentInFHbool = studentInFH();
    updatePositionDetails();
}

// Checking if yourself is located in FH area
function studentInFH() {
    cornerTopLeft = new Array(52.41257, 12.533682);
    cornerBotRight = new Array(52.409442, 12.541289);
    var bla1 = currentPosition.lat();
    //currentPosition.lat()=25252;
    var bla2 = currentPosition.lng();
    if (bla1 < cornerTopLeft[0]){
        if (bla2 > cornerTopLeft[1]){
            if (bla1 > cornerBotRight[0]){
                if (bla2 < cornerBotRight[1]){
                    return 1;
                }
            }
        }
    }
    return 0;
}

// Show Google Maps canvas and shows the direction from yourself to the target
function initializeMapAndCalculateRoute(lat, lon){
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsService = new google.maps.DirectionsService();
    map = new google.maps.Map(document.getElementById('map_canvas'), {
        zoom: 10,
        center: new google.maps.LatLng(destinationLatitude, destinationLongitude),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

   // currentPosition = new google.maps.LatLng(52.411148, 12.538045);
    if (currentPosition.lat() != 0){
        directionsDisplay.setMap(map);
        var currentPositionMarker = new google.maps.Marker({
            position: currentPosition,
            map: map,
            title: "Derzeitige Position"
        });
        var infowindow = new google.maps.InfoWindow();
        google.maps.event.addListener(currentPositionMarker, 'click', function() {
            infowindow.setContent("Deine derzeitige Position: latitude: " + lat +" longitude: " + lon);
            infowindow.open(map, currentPositionMarker);
        });

    }
    addMarker(destinationLatitude,destinationLongitude);
    calculateRoute(destinationLatitude,destinationLongitude);
}

// Add a marker to the Google Maps canvas
function addMarker(lat,lon) {
    var actualPosition = new google.maps.LatLng(lat, lon);
    var marker = new google.maps.Marker({
        position: actualPosition,
        map: map,
        title: "Target"
    });
}

// Calculates the route from youself to the target
function calculateRoute(lat,lon) {
    if (!studentInFHbool){
        directionTravelMode="DRIVING";}
    else{
        directionTravelMode="WALKING";
    }
    var targetDestination =  new google.maps.LatLng(lat, lon);
    if (currentPosition != '' && targetDestination != '' && currentPosition.lat() != 0) {
        //alert(currentPosition.lat());
        var request = {
            origin: currentPosition,
            destination: targetDestination,
            travelMode: google.maps.DirectionsTravelMode[directionTravelMode]
        };
        directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setPanel(document.getElementById("directions"));
                directionsDisplay.setDirections(response);
                $("#results").show();
            }
            else {
                $("#results").hide();
            }
        });
    }
    else {
        $("#results").hide();
    }
}

$(document).on("pagebeforeshow", "#page_position", function() {
    navigator.geolocation.getCurrentPosition(locSuccess, locError, {maximumAge:600000, timeout:10000});

});
// http://stackoverflow.com/questions/13345479/clean-example-of-directions-with-google-maps-in-jquery-mobile