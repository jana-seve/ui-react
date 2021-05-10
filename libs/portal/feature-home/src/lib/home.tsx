import React, { useState } from 'react';

import { useHistory } from 'react-router-dom';
import { getUserLocation, ILocation } from '@covid-essentials/shared/utils';
import GpsFixedIcon from '@material-ui/icons/GpsFixed';
import SearchIcon from '@material-ui/icons/Search';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Paper,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@material-ui/core';
import { map, reverse, trim } from 'lodash';


export function HomePage(props) {
  const {
    palette: { primary },
  } = useTheme();
  const history = useHistory();
  const [autoLocation, setAutoLocation] = useState<ILocation>({
    state: '',
    city: '',
    area: '',
    latitude: -1,
    longitude: -1,
  });
  const [isLocating, setIsLocating] = useState(false);
  const [location, setLocation] = useState('');

  const searchLocation = () => {
    const parts = map(location.split(','), (l) => trim(l));
    history.push(
      `/search/${parts.length > 1 ? reverse(parts).join('/') : parts[0]}`
    );
  };

  const getLocation = () => {
    setIsLocating(true);
    getUserLocation((location) => {
      setIsLocating(false);
      setAutoLocation(location);
      setLocation(`${location.area}, ${location.city}`);
    }, (error) => {
      setIsLocating(false);
    })
  }

  return (
    <Grid
      container
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100%"
    >
      <Grid
        item
        container
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={12} mb={4}>
          <Typography variant="h4" textAlign="center">
            Covid Essentials Portal
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} justifyContent="center" alignItems="center">
          <TextField
            fullWidth
            placeholder="Area, City"
            value={location}
            onChange={(evt) => setLocation(evt.target.value)}
            InputProps={{
              endAdornment: (
                <>
                  <Tooltip title="Search" arrow>
                    <span>
                      <IconButton
                        onClick={() => searchLocation()}
                        disabled={trim(location).length === 0}
                      >
                        <SearchIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Divider orientation="vertical" sx={{ height: 28, m: 0.5 }} />
                  {isLocating ? (
                    <Box sx={{ padding: '14px' }}>
                      <CircularProgress size={18} />
                    </Box>
                  ) : (
                    <Tooltip title="Locate Me" arrow>
                      <IconButton onClick={getLocation}>
                        <GpsFixedIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body2" textAlign="center" mt={2}>
            Choose your area to find the available supplies.
          </Typography>
        </Grid>
      </Grid>

      <Grid
        item
        mt={15}
        justifyContent="center"
        alignItems="center"
        sx={{ maxWidth: { xs: '100%', md: '50%' } }}
      >
        <Paper sx={{ padding: '6px', textAlign: 'center' }} elevation={0}>
          <Typography variant="caption" textAlign="center">
            Do you manage a{' '}
            {<span style={{ color: primary.main }}>covid care center</span>}? Do
            you rent or offer{' '}
            {<span style={{ color: primary.main }}>oxygen concentrators</span>}?
            Do you want to{' '}
            {<span style={{ color: primary.main }}>donate plamsa</span>}?
            Register with us to list your services.
          </Typography>
          <br />
          <br />
          <Button variant="outlined" onClick={() => history.push('/register')}>
            Register
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default HomePage;
