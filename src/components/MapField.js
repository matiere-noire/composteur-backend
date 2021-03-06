import React from 'react'
import RoomIcon from '@material-ui/icons/Room'
import ReactMapGL, { Marker } from 'react-map-gl'

const MapField = ({ record }) => {
  const { lat, lng } = record
  return lat && lng ? (
    <ReactMapGL latitude={lat} longitude={lng} width={400} height={400} zoom={12} mapboxApiAccessToken={process.env.REACT_APP_MapboxAccessToken}>
      <Marker latitude={lat} longitude={lng}>
        <RoomIcon color="primary" />
      </Marker>
    </ReactMapGL>
  ) : null
}

export default MapField
