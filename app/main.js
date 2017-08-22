require([
    "esri/Map",
    "esri/views/MapView",
    "esri/Graphic",
    "esri/layers/Layer",
    "esri/geometry/geometryEngine",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleFillSymbol",
    "dojo/domReady!"
], function(Map, MapView, Graphic,
    Layer, geomEngine, SimpleMarkerSymbol, SimpleFillSymbol) {

    // Creare obiect map/harta
    const map = new Map({
        basemap: "dark-gray"
    });

    // Creare view harta si definire proprietati
    const mapView = new MapView({
        container: "mainDiv",
        map,
        center: [-118.182, 33.913],
        scale: 836023
    });

    // Creare buton Buffer in pop-up
    const buffAction = {
        title: "Buffer",
        id: "buffer",
        className: "esri-icon-unlocked-link-vertical"
    };
    mapView.popup.actions.push(buffAction);

    //Creare simbol fill
    const fill = SimpleFillSymbol({
        outline: {
            color: [255, 0, 0, 0.5],
            width: "2px"
        }
    });

    //Creare simbol marker
    const marker = SimpleMarkerSymbol({
        outline: {
            color: [255, 0, 0, 0.5],
            width: "2px"
        }
    });

    // Id Layer
    // Incarcare layer in harta
    const id = "41658247c74c4b318c0de073038433db";
    Layer.fromPortalItem({
            portalItem: {
                id
            }
        })
        .then(layer => {
            map.add(layer);
            mapView.popup.on("trigger-action", ({ action }) => {
                if (action.id === "buffer") {

                    // Golire graphics
                    mapView.graphics.removeAll();
                    //Obtinere valoare din input textbox
                    const buffValue = document.getElementById('inputBufferValue').value;
                    document.getElementById('bufferedFeatures').innerHTML = 0;

                    const { selectedFeature } = mapView.popup;
                    const { geometry } = selectedFeature;
                    const buffer = geomEngine.geodesicBuffer(geometry, buffValue, "kilometers");

                    //Creare filtru/query
                    const query = layer.createQuery();
                    query.geometry = buffer;
                    query.spatialRelationship = "intersects";
                    layer.queryFeatures(query)
                        .then(({ features }) => {
                            //Creare graphic pentru feature
                            const bufferGraphic = new Graphic({
                                geometry: buffer,
                                symbol: fill
                            });
                            totalRecords = 0;
                            //Atribuire simbol pentru fiecare punct
                            features.forEach(x => x.symbol = marker);
                            // console.log(features.length);
                            mapView.graphics.addMany([bufferGraphic, ...features]);
                            document.getElementById('bufferedFeatures').innerHTML = features.length;
                        })
                        .otherwise(error => console.log("err", error));
                }
            });
        });
});