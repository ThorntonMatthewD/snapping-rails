import '../Assets/Styles/Railmap.css';

import * as React from 'react';
import { MapContainer, TileLayer, Marker, Popup} from 'react-leaflet'
import { Alert, Collapse, Box, Typography, Backdrop, CircularProgress } from '@mui/material'
import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

import useFetch from '../Hooks/useFetch'
import AddMarkerFab from './AddMarkerFab';
import DraggableMarker from './RailmapDraggableMarker';
import MarkerModal from './MarkerModal';

const Railmap = () => {

    const [refetchData, setRefetchData] = useState(false);
    let {data: markers, error, isPending} = useFetch('http://localhost:5000/markers', refetchData);

    const [searchParams, setSearchParams] = useSearchParams();

    const [draggableMarker, setDraggableMaker] = useState(false);
    const [draggableMarkerLocation, setDraggableMarkerLocation] = useState([]);

    const [map, setMap] = useState(null);

    const [modalOpen, setModalOpen] = useState(false);
    const handleModalOpen = () => setModalOpen(true);
    const handleModalClose = () => setModalOpen(false);

    const [addMarkerButNoLogin, setAddMarkerButNoLogin] = useState(false);

    const getMapCenter = () => {
        return map.getCenter();
    }

    const finalizeNewMarker = () => {
        setDraggableMaker(false);
        setRefetchData(!refetchData);
    }

    const goToParamsLocation = (railmap) => {

        let lastLocation = [searchParams.get("lat"), searchParams.get("lng")]
        lastLocation = lastLocation.map(parseFloat);

        if (lastLocation.includes(null) || lastLocation.includes(NaN)) {
            return;
        }

        if(lastLocation.length === 2) {
            railmap.flyTo(lastLocation)
        }

        return;
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
                    marginTop: 10,
                    bottom: '12%',
                    maxWidth: '80vw'
                }}
            >
                <Alert
                severity="error"
                sx={{ mb: 2 }}
                >
                    Map markers could not be loaded. Please refresh to try again, or come back later.
                </Alert>
            </Collapse>

            <Collapse
                in={addMarkerButNoLogin}
                style={{
                    position: 'absolute',
                    zIndex: 100,
                    marginTop: 10,
                    bottom: '12%',
                    maxWidth: '80vw'
                }}
            >
                <Alert
                severity="error"
                sx={{ mb: 2, color: "white" }}
                >
                    You need to login or create an account in order to add a marker. <Link to="/login">Click here to do so.</Link>
                </Alert>
            </Collapse>

            <Collapse
                in={draggableMarker === true}
                style={{
                    position: 'absolute',
                    zIndex: 100,
                    bottom: '12%',
                    maxWidth: '80vw'
                }}
            >
                <Alert
                severity="success"
                sx={{ mb: 2 }}
                >
                    Edit Mode: Drag the train to where you'd like to place a marker.
                </Alert>
            </Collapse>

            <MapContainer 
                center={ [34.858377, -82.413944] } 
                zoom={ 13 } 
                whenCreated={ (e) => setMap(e) } 
                whenReady={(e) => goToParamsLocation(e.target) }
                maxBounds={ [[-90, -180],[90, 180]] }
            >

                <TileLayer
                    noWrap={true}
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {markers && markers.map( marker => (
                        <Marker key={ marker.id } position={ [marker.lat, marker.long] }>
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
                                        minHeight: {xs: 90, md: 180},
                                        minWidth: {xs: 90, md: 180},
                                        mr: 2,
                                        alignContent: 'center'
                                    }}
                                    alt={marker.description}
                                    src={marker.img_url}  
                                />
                            </a>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {draggableMarker && 
                    <DraggableMarker center={ getMapCenter() } 
                        onFinalPlacement={ handleModalOpen } 
                        updateLocation={ setDraggableMarkerLocation } 
                        setMarkerVisibility={ setDraggableMaker }
                    /> 
                }
                
                <AddMarkerFab onFabClick={ () => { setDraggableMaker(true) } } onFabClickNoLogin={ () => {setAddMarkerButNoLogin(true)} }/>
            </MapContainer>

            <MarkerModal open={ modalOpen } handleClose={ handleModalClose } markerLocation={ draggableMarkerLocation } refreshMap={finalizeNewMarker} />
        </div>
    );
}

export default Railmap;