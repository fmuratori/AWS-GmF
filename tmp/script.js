var map
var places = new Array() 

function initMap() {
    const coords = {
        lat: 44.2822749,
        lng: 11.8979152
    };

    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 18,
        center: coords,
    });

    let marker = new google.maps.Marker({
        position: coords,
        map: map,
    });

    //aggiunge l'autocomplete all'input
    const input = document.getElementById('searchTextField');
    const ac = new google.maps.places.Autocomplete(input);

    geocoder = new google.maps.Geocoder();

    map.addListener("click", (mapMouseEvent) => {
        //salvo il place per testare la setMarkers()
        places.push(mapMouseEvent.latLng)

        //move marker
        marker.setPosition(mapMouseEvent.latLng)

        geocoder.geocode({
            'latLng': mapMouseEvent.latLng
        }, function (results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                    console.log(results[1]);
                } else {
                    alert('No results found');
                }
            } else {
                alert('Geocoder failed due to: ' + status);
            }
        });

    })

}

//spawna un marker per ogni coppia di coordinate passate in input
function setMarkers() {
    markers = new Array()

    places.forEach(elem => {
        markers.push(new google.maps.Marker({
            position: elem,
            map: map,
            icon: "http://maps.google.com/mapfiles/kml/pal2/icon10.png"
        }))
    });
}