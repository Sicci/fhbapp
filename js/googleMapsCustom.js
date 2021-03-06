var currentPosition;
var directionsDisplay;
var directionsService;

//borders for fh area
var cornerTopLeft = new Array(52.41257, 12.533682);
var cornerBotRight = new Array(52.409442, 12.541289);

var userHasGPSCoordinates = false;


// Updates your current location (e.g. entered a room) in latitue and longitude
function updateCurrentLocation(roomLat,roomLng) {
    if (!userHasGPSCoordinates ){
        userHasGPSCoordinates = true;
        currentPosition = new google.maps.LatLng(roomLat, roomLng);
    }
}


// Callback when Google Maps connection denied
function locError(error) {
    userHasGPSCoordinates = false;
    console.log("error: the current position could not be located");
    searchPosition(1); //if no gps is activated we asume the user is in fh
}

// Callback when Google Maps connection accessed and completed
function locSuccess(pos) {
    userHasGPSCoordinates = true;
    currentPosition = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
    searchPosition(isStudentInFH());
}

// checks if student is near fh brandenburg
// returns 0 or 1
function isStudentInFH() {
    var _lat = currentPosition.lat();
    var _lng = currentPosition.lng();
    if (_lat < cornerTopLeft[0] && _lat > cornerBotRight[0]){
        if (_lng > cornerTopLeft[1] && _lng < cornerBotRight[1]){
            return 1;
        }
    }
    return 0;
}

// Show Google Maps canvas and shows the direction from yourself to the target
function setDestinationAndDrawMap(destinationLat, destinationLng){
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsService = new google.maps.DirectionsService();

    var map = new google.maps.Map(document.getElementById('map_canvas'), {
        zoom: 10,
        center: new google.maps.LatLng(destinationLat, destinationLng),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    addMarker(map, new google.maps.LatLng(destinationLat,destinationLng), "Ziel");

    if (userHasGPSCoordinates){
        directionsDisplay.setMap(map);
        addMarker(map, currentPosition, "Derzeitige Position")
        calculateRoute(destinationLat,destinationLng);
    }
}

// Add a marker to the Google Maps canvas
function addMarker(map, position, title) {
    var marker = new google.maps.Marker({
        position: position,
        map: map,
        title: title
    });
    var infowindow = new google.maps.InfoWindow();
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent("Position: latitude: " + position.lat() +" longitude: " + position.lng());
        infowindow.open(map, marker);
    });
}

// Calculates the route from youself to the target
function calculateRoute(destinationLat, destinationLon) {
    var directionTravelMode;
    if (!isStudentInFH()){
        directionTravelMode="DRIVING";}
    else{
        directionTravelMode="WALKING";
    }
    var targetDestination =  new google.maps.LatLng(destinationLat, destinationLon);
    if (currentPosition != '' && targetDestination != '') {
        var request = {
            origin: currentPosition,
            destination: targetDestination,
            travelMode: google.maps.DirectionsTravelMode[directionTravelMode]
        };
        directionsService.route(request, function(response, status) {
            console.log(response);
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setPanel(document.getElementById("directions"));
                directionsDisplay.setDirections(response);
                if (!isStudentInFH()) {
                    $("#results").show();
                }
                else {
                    $("#results").hide();
                }
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