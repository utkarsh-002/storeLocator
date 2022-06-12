 var map;
 var ramaiah = {lat: 13.0306, lng: 77.5649}
function initMap(){
    map = new google.maps.Map(document.getElementById('map'), {
         center: ramaiah,
        zoom: 7
    });
    createMarker();
 }

 const createMarker = () =>{
  var marker = new google.maps.Marker({
        position: ramaiah,
         map: map,
        });
 }