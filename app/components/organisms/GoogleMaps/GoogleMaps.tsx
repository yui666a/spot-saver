import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
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
          {markers?.length &&
            markers.map((marker) => <Marker position={marker} />)}
          <Marker
            position={{
              lat: 37.4469813,
              lng: 138.8464919,
            }}
          />
        </GoogleMap>
      </LoadScript>
    </>
  )
}
