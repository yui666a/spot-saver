import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import { useEffect, useState } from 'react'

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

const defaultLatLng = {
  lat: 35.6882294,
  lng: 139.712699,
}

const containerStyle = {
  width: '100%',
  height: '500px',
}

export const WrappedGoogleMap = () => {
  const [marker, setMarker] = useState<{
    lat: number
    lng: number
  } | null>(null)

  useEffect(() => {
    if (navigator.geolocation) {
      const successFunc: PositionCallback = (s) => {
        const coords = s.coords

        setMarker({
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
    setMarker({
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
          {marker && <Marker position={marker} />}
        </GoogleMap>
      </LoadScript>
    </>
  )
}
