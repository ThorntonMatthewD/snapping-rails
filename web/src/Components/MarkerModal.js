import Box from '@mui/material/Box';
import { TextField, FormControlLabel, Checkbox, Button } from '@mui/material';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useState } from 'react';

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


const MarkerModal = ({open, handleClose}) => {
    const [type, setType] = useState('');

    return (
        
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box sx={style} id="marker-modal">
                <Typography id="modal-title" variant="h6" component="h2" color="primary">
                Add Rail Marker
                </Typography>
                <Typography id="modal-description" sx={{ mt: 2, color: "white" }}>
                A marker can be placed anywhere a rail-related entity exists. They can denote depots, museums, murals, businesses, events, and anywhere on the high iron!
                </Typography>
                <Box
                  component="form"
                  sx={{
                      '& > :not(style)': { m: 1, width: '25ch' },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField id="outlined-basic" label="Entry Name" variant="outlined" />
                  <TextField id="outlined-basic" label="Description" variant="outlined" />
                  <TextField id="outlined-basic" label="Media Link" variant="outlined" />
                  <TextField id="outlined-basic" label="Latitude" variant="outlined" />
                  <TextField id="outlined-basic" label="Longitude" variant="outlined" />

                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Marker Type</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={type}
                        label="Type of Marker"
                        onChange={setType}
                    >
                        <MenuItem value={"photo"} sx={{color: 'white'}}>Photo</MenuItem>
                        <MenuItem value={"video"} sx={{color: 'white'}}>Video</MenuItem>
                        <MenuItem value={"history"} sx={{color: 'white'}}>Museum/History</MenuItem>
                        <MenuItem value={"event"} sx={{color: 'white'}}>Event</MenuItem>
                        <MenuItem value={"group"} sx={{color: 'white'}}>Club/Business</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControlLabel control={<Checkbox />} style={{label: 'white'}} label="Agree to Our Terms of Use" />
                  <Button variant="contained">Submit Marker</Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default MarkerModal;