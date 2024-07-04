import mapboxgl from 'mapbox-gl';

type Location = {
    lng: number;
    lat: number;
}

class Dagger extends mapboxgl.Marker {
    constructor(className: string, onClickCallBack: (x: any) => void) { //change this type
        const el = document.createElement('div');
        el.className = className;
        el.addEventListener('click', function () {
            onClickCallBack(this);
        })
        super(el);
    }

    public setMarker(location: Location, map: any) {
        super.setLngLat(location).addTo(map);
    }
}

export default Dagger;