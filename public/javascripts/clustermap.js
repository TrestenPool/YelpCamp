mapboxgl.accessToken = 'pk.eyJ1IjoidHBvb2wtMzIiLCJhIjoiY2w5eDdsYmNnMDdyajNxbXE5a2R2ZGxyaCJ9.7p2b9gE87Iqeo6gwRRlBrw';
const map = new mapboxgl.Map({
  container: 'cluster-map',
  // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
  style: 'mapbox://styles/mapbox/dark-v11',
  center: [-103.5917, 40.6699],
  zoom: 3
});
 
map.on('load', () => {
  // Add a new source from our GeoJSON data and
  // set the 'cluster' option to true. GL-JS will
  // add the point_count property to your source data.
  map.addSource('campgrounds', {
    type: 'geojson',
    // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
    // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
    data: campgrounds,
    cluster: true,
    clusterMaxZoom: 14, // Max zoom to cluster points on
    clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
  });
  
  map.addLayer({
    id: 'clusters',
    type: 'circle',
    source: 'campgrounds',
    filter: ['has', 'point_count'],
    paint: {
    // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
    // with three steps to implement three types of circles:
    //   * Blue, 20px circles when point count is less than 100
    //   * Yellow, 30px circles when point count is between 100 and 750
    //   * Pink, 40px circles when point count is greater than or equal to 750
    'circle-color': [
      'step',
      ['get', 'point_count'],

      // yellow when <= 10
      '#ffe600',
      10,
      
      // blue when <= 50
      '#51bbd6',
      50,

      // Read when <= 100
      '#f50202',
      100,

      // Pink when > 100
      '#f28cb1'
    ],
    'circle-radius': [
      'step',
      ['get', 'point_count'],
      10,
      10,

      20,       // 20px circle radius
      50,      // when >= 10

      30,       // 30px circle radius
      100,      // when <= 750

      40
    ]
    }
  });
  
  map.addLayer({
    id: 'cluster-count',
    type: 'symbol',
    source: 'campgrounds',
    filter: ['has', 'point_count'],
    layout: {
    'text-field': ['get', 'point_count_abbreviated'],
    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    'text-size': 12
    }
  });
  
  // setting up the circle radius/color 
  map.addLayer({
    id: 'unclustered-point',
    type: 'circle',
    source: 'campgrounds',
    filter: ['!', ['has', 'point_count']],
    paint: {
    'circle-color': '#11b4da',
    'circle-radius': 4,
    'circle-stroke-width': 1,
    'circle-stroke-color': '#fff'
    }
  });
  
  // inspect a cluster on click
  map.on('click', 'clusters', (e) => {
    const features = map.queryRenderedFeatures(e.point, {
    layers: ['clusters']
    });
    const clusterId = features[0].properties.cluster_id;
    map.getSource('campgrounds').getClusterExpansionZoom(
    clusterId,
    (err, zoom) => {
    if (err) return;
    
    map.easeTo({
    center: features[0].geometry.coordinates,
    zoom: zoom
    });
    }
    );
  });
  
  // When a click event occurs on a feature in
  // the unclustered-point layer, open a popup at
  // the location of the feature, with
  // description HTML from its properties.
  map.on('click', 'unclustered-point', (e) => {
    const coordinates = e.features[0].geometry.coordinates.slice();
    const popUpMarkup = e.features[0].properties.popUpMarkup;

    // Ensure that if the map is zoomed out such that
    // multiple copies of the feature are visible, the
    // popup appears over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
  }
  
  // setting the popup when over unclustered point
  new mapboxgl.Popup()
    .setLngLat(coordinates)
    .setHTML(
      popUpMarkup
    )
    .addTo(map);
  });
  
  // mouse enter clusters
  map.on('mouseenter', 'clusters', () => {
    map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'clusters', () => {
    map.getCanvas().style.cursor = '';
  });

  map.addControl(new mapboxgl.NavigationControl(), 'bottom-left');
  map.addControl(new mapboxgl.FullscreenControl());
});