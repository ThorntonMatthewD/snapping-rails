import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@emotion/react';

const fabStyle = {
  bottom: 30
};

const AddMarkerFab = ({ onFabClick }) => { 
  const theme = useTheme();
  const showExtendedFab = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Box className="leaflet-bottom leaflet-right" sx={{ '& > :not(style)': { m: 1 } }}>
      { !showExtendedFab &&
        <Fab className="fab" size="medium" color="primary" aria-label="add-marker" sx={ fabStyle } onClick={ onFabClick }>
          <AddLocationIcon />
        </Fab> 
      }
      { showExtendedFab && 
        <Fab className="fab" variant="extended" color="primary" aria-label="add" sx={ fabStyle } onClick={ onFabClick }>
          <AddLocationIcon sx={{ mr: 1 }} />
            Add Rail Marker
        </Fab>
      }
    </Box>
  );
}

export default AddMarkerFab
