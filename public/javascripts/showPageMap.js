mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/navigation-night-v1', // style URL
    center: gymData.geometry.coordinates, // starting position [lng, lat]
    zoom: 12, // starting zoom
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

const marker1 = new mapboxgl.Marker()
    .setLngLat(gymData.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${gymData.title}</h3><p>${gymData.location}</p>`
            )
    )
    .addTo(map);

