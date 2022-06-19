 var map;
 var ramaiah = {lat: 34.063380, lng: -118.358080};
 var infoWindow;
 var markers = [];
function initMap(){
    map = new google.maps.Map(document.getElementById('map'), {
         center: ramaiah,
        zoom: 12
    });
    var marker = new google.maps.Marker({
        position: ramaiah,
         map: map,
         label: '$'
        });
        infoWindow = new google.maps.InfoWindow();
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
 }

 const onEnter = (e)=> {
    if(e.key == "Enter"){
        getStores();
    }
 }

 const getStores = ()=>{
    const zipCode = document.getElementById("zip-code").value;
    if(!zipCode){
        return;
    }
    const API_URL = 'http://localhost:3000/api/stores';
    const fullUrl = `${API_URL}?zip_code=${zipCode}`;
    fetch(fullUrl).then((response)=>{
        if(response.status == 200)
            return response.json();
        else
            throw new Error(response.status);
    }).then((data)=>{
        if(data.length> 0){
            clearLocations();
            searchLocationNear(data);
            setStoreList(data);
            setOnClickListener();
        }
        else{
            clearLocations();
            noStoresFound();
        }
        
    })
 }

const clearLocations = () =>{
    infoWindow.close();
    for(var i =0;i<markers.length;i++){
        markers[i].setMap(null);
    }
    markers.length = 0;
}

const noStoresFound = () => {
    const html = `
        <div class= "no-stores-found">No Stores Found
        </div>
    `
    document.querySelector('.stores-list').innerHTML = html;
}

 const setOnClickListener = ()=>{
    let storeElements = document.querySelectorAll('.container');
    storeElements.forEach((elem, index)=>{
        elem.addEventListener('click',()=>{
            google.maps.event.trigger(markers[index],'click');
        })
    })
 }

 const setStoreList = (stores) => {
    let storesHtml = '';
    stores.forEach((store, index)=>{
        storesHtml +=`
        <div class="container">
            <div class="container-bg">
                <div class="info">
                    <div class="address">
                        <span>${store.addressLines[0]}</span>
                        <span>${store.addressLines[1]}</span>
                    </div>
                    <div class="phone">${store.phoneNumber}</div>
                </div>
                <div class="num-container">
                <div class="number">${index+1}</div>
                </div>
            </div>
         </div>
        `
    })
    document.querySelector('.stores-list').innerHTML = storesHtml;
 }
 const searchLocationNear = (stores) => {
    let bounds  = new google.maps.LatLngBounds();
    stores.forEach((store,index) => {
        let latlng = new google.maps.LatLng(
            store.location.coordinates[1],
            store.location.coordinates[0]);
        let name = store.storeName;
        let address = store.addressLines[0];
        let phone = store.phoneNumber;
        let openStatusText = store.openStatusText;
        bounds.extend(latlng);
        createMarker(latlng, name, address, openStatusText, phone, index+1);
    });
    map.fitBounds(bounds);
 }

 const createMarker = (latlng, name, address,openStatusText, phone,storeNumber) =>{
    let html = `
        <div class="info-window">
            <div class="store-name">${name}</div>
            <div class="open-status">${openStatusText}</div>
            <div class="store-address">
            <div class="icon"><i class="fa-solid fa-location-crosshairs"></i></div>
            <span>${address}</span>
            </div>
            <div class="store-phone">
            <div class="icon"><i class="fa-solid fa-phone"></i></div>
            <span><a href="tel:${phone}">${phone}</span>
            </div>
        </div>
    `;
  var marker = new google.maps.Marker({
        position: latlng,
         map: map,
         label: `${storeNumber}`
        });
    google.maps.event.addListener(marker,'click',function(){
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
    })
    markers.push(marker);
 };

 const currLocation = ()=> {
    if(navigator.geolocation)
                navigator.geolocation.getCurrentPosition(function(position){
                    let curr = {lat:position.coords.latitude,lng:position.coords.longitude}
                    ramaiah = curr;
                    initMap();
                });
 };