import '../Assets/Styles/Railmap.css';

import * as React from 'react';
import { MapContainer, TileLayer, Marker, Popup} from 'react-leaflet'
import { Alert, Collapse, Box, Typography, Backdrop, CircularProgress } from '@mui/material'
import { useState } from 'react';

import useFetch from '../Hooks/useFetch'
import AddMarkerFab from './AddMarkerFab';
import DraggableMarker from './RailmapDraggableMarker';
import MarkerModal from './MarkerModal';

const Railmap = () => {

    const {data: markers, error, isPending} = useFetch('http://localhost:5000/markers');

    const [draggableMarker, setDraggableMaker] = useState(false);
    const [draggableMarkerLocation, setDraggableMarkerLocation] = useState([]);

    const [map, setMap] = useState(null);
    
    const [modalOpen, setModalOpen] = useState(false);
    const handleModalOpen = () => setModalOpen(true);
    const handleModalClose = () => setModalOpen(false);

    const getMapCenter = () => {
        return map.getCenter();
    }

    return (
        <div className="map-wrapper">

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isPending}
            >
                <h1 style={{m: 3}}>Loading the Rail Manifest...</h1>
                <CircularProgress color="inherit"/>
            </Backdrop>

            <Collapse
                in={error != null}
                style={{
                    position: 'absolute',
                    zIndex: 100,
                    marginTop: 10
                }}
            >
                <Alert
                severity="error"
                sx={{ mb: 2 }}
                >
                    Map markers could not be loaded. Please refresh to try again, or come back later.
                </Alert>
            </Collapse>

            <MapContainer center={[34.858377, -82.413944]} zoom={13} whenCreated={(e) => setMap(e)}>

                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {markers && markers.map( marker => (
                        <Marker key={marker.id} position={[marker.lat, marker.long]}>
                        <Popup>
                            <Typography>
                                {marker.title}
                            </Typography>
                            <div style={{ textAlign: 'center'}}>
                            <a href={marker.media_url} target="_blank" rel="noreferrer">
                                <Box
                                    component="img"
                                    sx={{
                                        height: 'auto',
                                        width: '100%',
                                        maxHeight: { xs: 120, md: 240 },
                                        maxWidth: { xs: 120, md:  240},
                                        mr: 2,
                                        alignContent: 'center'
                                    }}
                                    alt={marker.img_alt_text}
                                    src={marker.img_url}  
                                />
                            </a>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {draggableMarker && <DraggableMarker center={ getMapCenter() } onFinalPlacement={ handleModalOpen } updateLocation = { setDraggableMarkerLocation } /> }
                
                <AddMarkerFab onFabClick={ () => {setDraggableMaker(true)} }/>
            </MapContainer>

            <MarkerModal open={ modalOpen } handleClose={ handleModalClose } markerLocation = { draggableMarkerLocation }/>
        </div>
    );
}

export default Railmap;