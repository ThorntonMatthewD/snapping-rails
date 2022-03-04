import { Box, Typography } from '@mui/material';
import { Marker, Popup} from 'react-leaflet';

const MapMarker = ({ marker }) => {
    return (
        <Marker position={ [marker.lat, marker.long] }>
            <Popup>
                <Typography>
                    {marker.title}
                </Typography>
                <Typography>
                    Description: {marker.description}
                </Typography>
                <Typography>
                    Created At: {new Date(marker.created_at).toString()}
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
    );
}

export default MapMarker;













