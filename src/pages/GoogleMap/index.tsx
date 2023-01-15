import { useRef, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Autocomplete,
  Marker,
} from "@react-google-maps/api";
import { useDispatch, useSelector } from "react-redux";
import { storeResult } from "../../redux/googleMapReducer";
import { RootState } from "../../redux/store";
import moment from "moment";
import { Box } from "@mui/system";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import "../../style.css";
import ClearIcon from "@mui/icons-material/Clear";

const App = () => {
  const dispatch = useDispatch();

  const mapRef = useRef<any>(null);
  const searchInput = useRef<HTMLInputElement>(null);

  const [coor, setCoor] = useState({ lat: 1.0458378, lng: 103.98402 });
  const [isResultShown, setIsResultShown] = useState(false);
  const [libraries] = useState<["places"]>(["places"]);
  const [searchText, setSearchText] = useState("");
  const [zoom, setZoom] = useState(10);

  const { result } = useSelector((state: RootState) => state.googleMap);

  const onChangePlace = () => {
    const place = mapRef.current.getPlace();
    dispatch(
      storeResult({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        address: place.formatted_address,
        date: moment().format("LLL"),
        photo: place.photos[0].getUrl(),
        name: place.name,
        link: place.url,
      })
    );
    setSearchText(place.formatted_address);
    setCoor({
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    });
    setZoom(12);
  };

  const findButton = () => {
    searchInput?.current?.focus();
    setIsResultShown(false);
  };

  const clearText = () => {
    setZoom(10);
    setSearchText("");
  };

  if (!process.env.REACT_APP_GOOGLE_API) {
    return <Box>Please provide Google Api to make Google Map works</Box>;
  }

  return (
    <Box>
      <Box
        className="result-button"
        onClick={() => setIsResultShown(!isResultShown)}
      >
        {isResultShown ? "Hide" : "Show"} History Result
      </Box>
      {searchText && (
        <Box className="clear-icon" onClick={clearText}>
          <ClearIcon color="disabled" />
        </Box>
      )}
      <Box className={`result ${isResultShown ? "show" : "hide"}`}>
        <Box className="result-header">
          <Box className="result-title">Result</Box>
          <Box className="close-icon" onClick={() => setIsResultShown(false)}>
            <ClearIcon color="disabled" />
          </Box>
        </Box>
        <Box className="result-container">
          {result.length > 0 ? (
            result.map((e, i) => (
              <Card sx={{ maxWidth: 345 }} key={i}>
                <CardMedia
                  sx={{ height: 100 }}
                  image={e.photo}
                  title={e.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="subtitle2" component="div">
                    {e.address}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {e.date}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => window.open(e.link, "_blank")}
                  >
                    Open map
                  </Button>
                  {e.lat !== coor.lat && e.lng !== coor.lng && (
                    <Button
                      size="small"
                      onClick={() =>
                        setCoor({
                          lat: e.lat,
                          lng: e.lng,
                        })
                      }
                    >
                      Show map
                    </Button>
                  )}
                </CardActions>
              </Card>
            ))
          ) : (
            <Box className="no-result-container">
              <Box className="no-result">Oops, no result found.</Box>
              <Box className="find-button" onClick={findButton}>
                Let's go find one!
              </Box>
            </Box>
          )}
        </Box>
      </Box>
      <LoadScript
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_API}
        libraries={libraries}
      >
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100vh" }}
          center={coor}
          zoom={zoom}
        >
          <Autocomplete
            onLoad={(data) => (mapRef.current = data)}
            onPlaceChanged={onChangePlace}
          >
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              type="text"
              placeholder="Find any place"
              className="text-input"
              ref={searchInput}
            />
          </Autocomplete>
          <Marker position={coor} />
        </GoogleMap>
      </LoadScript>
    </Box>
  );
};

export default App;
