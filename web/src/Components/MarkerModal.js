import {Box, Modal, Typography} from '@mui/material';

import NewMarkerForm from './Forms/NewMarkerForm';

const MarkerModal = ({ open, handleClose, markerLocation, refreshMap }) => {

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        color: 'white',
        p: 4,
    };

    return (
        
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="Add Rail Marker"
            aria-describedby="Add details about the marker you wish to add."
        >
            <Box sx={style} id="marker-modal">
                <Typography id="modal-title" variant="h6" component="h2" color="primary">
                Add Rail Marker
                </Typography>
                <Typography id="modal-description" sx={{ mt: 2, color: "white" }}>
                A marker can be placed anywhere a rail-related entity exists. They can denote depots, museums, murals, businesses, events, and anywhere on the high iron!
                </Typography>

                <NewMarkerForm position={markerLocation} handleClose={handleClose} refreshMap={refreshMap} />
            </Box>
        </Modal>
    );
}

export default MarkerModal;