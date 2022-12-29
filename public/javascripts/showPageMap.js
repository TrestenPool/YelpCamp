  mapboxgl.accessToken = mapToken;
  const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/dark-v11', // style URL
    // center: camp_coordinates,
    center: campground.geometry.coordinates,
    zoom: 10, // starting zoom
    projection: 'globe' // display the map as a 3D globe
  });

  var marker = new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    
    // adds the campground title when ever you click on the pin on the map
    .setPopup(
      new mapboxgl.Popup({offset: 25})
      .setHTML(
        `<h3>${campground.title}</h3>`
      )
    )
    .addTo(map);

  map.on('style.load', () => {
    map.setFog({}); // Set the default atmosphere style
  });

  map.addControl(new mapboxgl.NavigationControl(), 'bottom-left');
  map.addControl(new mapboxgl.FullscreenControl());
