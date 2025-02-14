/* eslint-disable */
import Map from 'ol/Map';
import View from 'ol/View';
import Feature from 'ol/Feature';
import { Point } from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { XYZ } from 'ol/source';
import VectorSource from 'ol/source/Vector';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import Overlay from 'ol/Overlay';
import { boundingExtent } from 'ol/extent';
import FullScreen from 'ol/control/FullScreen';
import ScaleLine from 'ol/control/ScaleLine';
import DragPan from 'ol/interaction/DragPan';

export const displayMap = (locations) => {
  function calculateCentroid(locations) {
    let sumLon = 0,
      sumLat = 0;
    locations.forEach((loc) => {
      const [lon, lat] = loc.coordinates;
      sumLon += lon;
      sumLat += lat;
    });
    return [sumLon / locations.length, sumLat / locations.length];
  }

  const centroid = calculateCentroid(locations);

  const features = locations.map(
    (loc) =>
      new Feature({
        geometry: new Point(fromLonLat(loc.coordinates)),
        description: loc.description,
        day: loc.day,
      }),
  );

  const vectorSource = new VectorSource({ features });

  const vectorLayer = new VectorLayer({
    source: vectorSource,
    style: new Style({
      image: new Icon({
        anchor: [0.5, 1],
        src: '/img/pin.png',
        scale: 0.1,
      }),
    }),
  });

  const extent = boundingExtent(
    locations.map((loc) => fromLonLat(loc.coordinates)),
  );

  const map = new Map({
    target: 'map',
    layers: [
      new TileLayer({
        source: new XYZ({
          url: 'https://{a-c}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        }),
      }),
      vectorLayer,
    ],
    view: new View({
      constrainResolution: true,
    }),
    controls: [new FullScreen(), new ScaleLine()],
    interactions: [new DragPan()],
  });

  map.getView().fit(extent, { size: map.getSize(), padding: [80, 80, 80, 80] });

  const overlay = new Overlay({
    element: document.createElement('div'),
    positioning: 'bottom-center',
    stopEvent: false,
  });
  map.addOverlay(overlay);

  locations.forEach((loc) => {
    const coordinate = fromLonLat(loc.coordinates);
    const popupElement = document.createElement('div');
    popupElement.style = `
      background: gray;
      color: white;
      font-size: 14px;
      padding: 5px 8px;
      border-radius: 3px;
      white-space: nowrap;
    `;
    popupElement.innerHTML = `<strong>Day: ${loc.day}</strong>, ${loc.description}`;

    const overlay = new Overlay({
      element: popupElement,
      position: coordinate,
      positioning: 'top-center',
      offset: [0, 5],
    });

    map.addOverlay(overlay);
  });
};

//
//
// export const displayMap = (locations) => {
//   function calculateCentroid(locations) {
//     let sumLon = 0,
//       sumLat = 0;
//     locations.forEach((loc) => {
//       const [lon, lat] = loc.coordinates;
//       sumLon += lon;
//       sumLat += lat;
//     });
//     return [sumLon / locations.length, sumLat / locations.length];
//   }

//   const centroid = calculateCentroid(locations);

//   const features = locations.map(
//     (loc) =>
//       new ol.Feature({
//         geometry: new ol.geom.Point(ol.proj.fromLonLat(loc.coordinates)),
//         description: loc.description,
//         day: loc.day,
//       }),
//   );

//   const vectorSource = new ol.source.Vector({ features });

//   const vectorLayer = new ol.layer.Vector({
//     source: vectorSource,
//     style: new ol.style.Style({
//       image: new ol.style.Icon({
//         anchor: [0.5, 1], // Adjust anchor so the bottom of the pin touches the location
//         src: '/img/pin.png', // Relative path from the public folder
//         scale: 0.1, // Adjust size if needed
//       }),
//     }),
//   });

//   // Calculate extent from all points
//   const extent = ol.extent.boundingExtent(
//     locations.map((loc) => ol.proj.fromLonLat(loc.coordinates)),
//   );

//   const map = new ol.Map({
//     target: 'map',
//     layers: [
//       new ol.layer.Tile({
//         source: new ol.source.XYZ({
//           url: 'https://{a-c}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
//         }),
//       }),
//       vectorLayer,
//     ],
//     view: new ol.View({
//       constrainResolution: true, // Prevents fractional zoom levels
//     }),
//     controls: [new ol.control.FullScreen(), new ol.control.ScaleLine()], // Only pan-related controls
//     interactions: [
//       new ol.interaction.DragPan(), // Keep only panning
//     ],
//   });

//   // Fit view to cover all points
//   map.getView().fit(extent, { size: map.getSize(), padding: [80, 80, 80, 80] });

//   // Add popups on click
//   const overlay = new ol.Overlay({
//     element: document.createElement('div'),
//     positioning: 'bottom-center',
//     stopEvent: false,
//   });
//   map.addOverlay(overlay);

//   locations.forEach((loc) => {
//     const coordinate = ol.proj.fromLonLat(loc.coordinates);
//     const popupElement = document.createElement('div');
//     popupElement.style = `
//     background: gray;
//     color: white;
//     font-size: 14px;
//     padding: 5px 8px;
//     border-radius: 3px;
//     white-space: nowrap;
//   `;
//     popupElement.innerHTML = `<strong>Day: ${loc.day}</strong>, ${loc.description}`;

//     const overlay = new ol.Overlay({
//       element: popupElement,
//       position: coordinate,
//       positioning: 'top-center', // Centers horizontally, places popup above
//       offset: [0, 5], // Moves popup 10px downward
//     });

//     map.addOverlay(overlay);
//   });
// };
