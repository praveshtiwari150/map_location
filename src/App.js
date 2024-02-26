import styled from '@emotion/styled';
import { Box, Container, Button, FormControl, FormGroup, Input, InputLabel, Typography } from '@mui/material'
import './App.css';
import { useState, useEffect, useRef } from 'react';
import { useJsApiLoader, GoogleMap, Marker, Autocomplete, DirectionsRenderer } from '@react-google-maps/api'
import NearMeIcon from '@mui/icons-material/NearMe';

const MainContainer = styled(Container)`
  width: 60%;
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 20px;
  background-color: rgba(255, 255, 255, 0.8); 
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2); 
  z-index: 1; 

  @media (max-width: 600px) {
    width: 90%; 
    left: 50%;
    transform: translateX(-50%);
  }
`;

const StyledInput = styled(Input)`
  padding-top: 20px;
  margin-bottom: 10px;
`;

const defaultValue = {
  origin: '',
  destination: ''
}


const center = { lat: 12.980085943292957, lng: 77.59150051139959 }

function App() {

  const [location, setLocation] = useState(defaultValue)
  const onValueChange = (e) => {
    const { name, value } = e.target;
    setLocation((prevLocation) => ({
      ...prevLocation,
      [name]: value
    }));
  };



  const locationHandler = () => {
    return location;
  }

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyDrQB28X7aHs9FcEeoiU9HtYMp0IfMRikg',
    libraries: ['places']
  });

  const [direction, setDirection] = useState('');

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  const findRoute = () => {
    const { origin, destination } = location;
    if (origin === '' || destination === '') {
      return
    }

    const directionService = new window.google.maps.DirectionsService()
    directionService.route(
      {
        origin,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirection(result);
        } else {
          console.error(`Directions request failed due to ${status}`);
        }
      }
    );
  };

  const handleAutoComplete = () => {
    findRoute();
  }




  return (
    <Box h='100vh' w='100vw'>
      <MainContainer maxWidth="md">
        <FormControl>

          <InputLabel htmlFor="origin" shrink={false}>Origin</InputLabel>

          <StyledInput
            style={{ margin: '10px' }}
            onChange={(e) => onValueChange(e)} name='origin' onBlur={handleAutoComplete} />

        </FormControl>
        <FormControl>
          <InputLabel htmlFor='destination' shrink={false} >Destination</InputLabel>

          <StyledInput
            style={{ margin: '10px' }}
            onChange={(e) => onValueChange(e)} name='destination'
            onBlur={handleAutoComplete}
          />

        </FormControl>
        <FormControl>
          <Button variant={"contained"} onClick={() => locationHandler()}
            style={{ marginRight: '20px' }}
          >
            <NearMeIcon />
          </Button>

        </FormControl>
      </MainContainer>

      <Box position={'absolute'} left={0} top={0} h='100%' w='100%'>
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: '100vw', height: '100vh', border: '2px solid blue' }}
          options={{
            fullscreenControl: false
          }}
        >
          <Marker position={center} />

          {direction && <DirectionsRenderer directions={direction} />}
        </GoogleMap>

      </Box>

    </Box>
  );
}

export default App;
