import Box from '@mui/material/Box';
import { TextField, FormControlLabel, Checkbox, Button } from '@mui/material';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { createSearchParams } from 'react-router-dom';
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


const MarkerModal = ({ open, handleClose, markerLocation, refreshMap }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [mediaURL, setMediaURL] = useState(null);
    const [type, setType] = useState('');

    const handleSubmit = (e) => {
        console.log("Submitting!")
        e.preventDefault();
        const newMarker = { 
            "author_id": 1,
            "created_at": { getSubmitTime },
            "lat": markerLocation.lat,
            "long": markerLocation.lng,
            "title": title,
            "media_url": mediaURL,
            "img_url": "https://i3.ytimg.com/vi/cNDvo4n2ZOo/hqdefault.jpg",
            "description": description
         };
    
        fetch('http://localhost:5000/markers/', {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newMarker)
        }).then(() => {
            handleClose();

            const params = {
                lat: markerLocation.lat,
                lng: markerLocation.lng 
            }

            window.location.href = `/?${createSearchParams(params)}`;
        })
      }

    const getSubmitTime = () => {
        return Math.floor(Date.now() / 1000);
    }

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
                <Box
                  component="form"
                  sx={{
                      '& > :not(style)': { m: 1, width: '25ch' },
                  }}
                  noValidate
                  autoComplete="off"
                  onSubmit={ handleSubmit }
                >
                  <TextField id="outlined-basic" label="Title" variant="outlined" onChange={(e) => { setTitle(e.target.value) }} required />
                  <TextField id="outlined-basic" label="Description" variant="outlined" onChange={(e) => { setDescription(e.target.value) }} required />
                  <TextField id="outlined-basic" label="Media Link" variant="outlined" onChange={(e) => { setMediaURL(e.target.value) }} required />

                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Marker Type</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={type}
                        label="Type of Marker"
                        onChange={(e) => {setType(e.target.value)}}
                        required
                    >
                        <MenuItem value={'photo'} sx={{color: 'white'}}>Photo</MenuItem>
                        <MenuItem value={'video'} sx={{color: 'white'}}>Video</MenuItem>
                        <MenuItem value={'history'} sx={{color: 'white'}}>Museum/History</MenuItem>
                        <MenuItem value={'event'} sx={{color: 'white'}}>Event</MenuItem>
                        <MenuItem value={'group'} sx={{color: 'white'}}>Club/Business</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControlLabel control={<Checkbox />} label="Agree to Our Terms of Use" />
                  <Button type="submit" variant="contained">Submit Marker</Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default MarkerModal;