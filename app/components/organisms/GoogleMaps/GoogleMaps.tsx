import { GoogleMap, LoadScript, Marker, MarkerF } from '@react-google-maps/api'
import { useEffect, useState } from 'react'
import { Spot } from '~/models/spots'

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

const defaultLatLng = {
  lat: 35.6882294,
  lng: 139.712699,
}

const containerStyle = {
  width: '100%',
  height: '500px',
}

export type WrappedGoogleMapProps = {
  spots: Array<Spot>
}

type Position = {
  lat: number
  lng: number
}

export const WrappedGoogleMap: React.FC<WrappedGoogleMapProps> = ({
  spots,
}) => {
  const [currentLocation, setCurrentLocation] = useState<Position | null>(null)

  const [markers, setMarkers] = useState<Array<Position> | null>([])

  useEffect(() => {
    if (navigator.geolocation) {
      const successFunc: PositionCallback = (s) => {
        const coords = s.coords

        setCurrentLocation({
          lat: coords.latitude,
          lng: coords.longitude,
        })
      }
      const errorFunc: PositionErrorCallback = (e) => {
        console.error(e)
      }

      // 現在の位置情報を取得
      navigator.geolocation.getCurrentPosition(successFunc, errorFunc)
    } else {
      alert('現在地の取得に失敗しました')
    }
  }, [])

  function handleMapClick(event: google.maps.MapMouseEvent) {
    setCurrentLocation({
      lat: event.latLng?.lat() || 0,
      lng: event.latLng?.lng() || 0,
    })
  }

  const svgMarker = {
    path: 'M-1.547 12l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z',
    fillColor: 'blue',
    fillOpacity: 1,
    // strokeWeight: 0,
    // rotation: 0,
    // scale: 2,
    // anchor: new google.maps.Point(0, 20),
  }

  return (
    <>
      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          center={defaultLatLng}
          zoom={10}
          mapContainerStyle={containerStyle}
          onClick={handleMapClick}
        >
          {currentLocation && <Marker position={currentLocation} />}
          {spots?.length &&
            spots.map((spot) => (
              <MarkerF
                clickable={true}
                onClick={() => {
                  console.log(spot.title, 'click')
                }}
                position={spot.position}
                key={spot.id}
                icon={svgMarker}
                // icon={}
                title={spot.title}
                label={spot.title}
                // optimized={false}
              />
            ))}
        </GoogleMap>
      </LoadScript>
    </>
  )
}
