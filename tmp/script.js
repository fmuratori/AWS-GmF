function initMap() {
    const coords = {
        lat: 44.2822749,
        lng: 11.8979152
    };

    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 18,
        center: coords,
    });

    let marker = new google.maps.Marker({
        position: coords,
        map: map,
    });

    geocoder = new google.maps.Geocoder();

    map.addListener("click", (mapMouseEvent) => {
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