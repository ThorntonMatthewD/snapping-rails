import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@emotion/react';
import useAuth from '../hooks/useAuth';

const AddMarkerFab = ({ onFabClick, onFabClickNoLogin }) => { 
  const theme = useTheme();
  const { auth } = useAuth();
  const showExtendedFab = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Box className="leaflet-bottom leaflet-right" sx={{ '& > :not(style)': { m: 2, mb: 5 } }}>
      { !showExtendedFab &&
        <Fab className="fab"
          size="medium" 
          color="primary" 
          aria-label="add-marker"
          onClick={ !(Object.keys(auth).length === 0) ? onFabClick : onFabClickNoLogin }
        >
          <AddLocationIcon />
        </Fab> 
      }
      { showExtendedFab && 
        <Fab className="fab" 
          variant="extended" 
          color="primary" 
          aria-label="add"
          onClick={ !(Object.keys(auth).length === 0) ? onFabClick : onFabClickNoLogin }
        >
          <AddLocationIcon sx={{ mr: 1 }} />
            Add Rail Marker
        </Fab>
      }
    </Box>
  );
}

export default AddMarkerFab;
