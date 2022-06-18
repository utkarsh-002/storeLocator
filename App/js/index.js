 var map;
 var ramaiah = {lat: 13.0306, lng: 77.5649};
 var infoWindow;
 var markers = [];
function initMap(){
    map = new google.maps.Map(document.getElementById('map'), {
         center: ramaiah,
        zoom: 5
    });
    infoWindow = new google.maps.InfoWindow();
    getStores();
 }

 const getStores = ()=>{
    const API_URL = 'http://localhost:3000/api/stores';
    fetch(API_URL).then((response)=>{
        if(response.status == 200)
            return response.json();
        else
            throw new Error(response.status);
    }).then((data)=>{
        searchLocationNear(data);
        setStoreList(data);
        setOnClickListener();
    })
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