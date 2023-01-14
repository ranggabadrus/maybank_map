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
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
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
    setZoom(15);
  };

  const findButton = () => {
    searchInput?.current?.focus();
    setIsResultShown(false);
  };

  if (!process.env.REACT_APP_GOOGLE_API) {
    return <div>Please provide Google Api to make Google Map works</div>;
  }

  return (
    <div>
      <div
        className="result-button"
        onClick={() => setIsResultShown(!isResultShown)}
      >
        {isResultShown ? "Hide" : "Show"} History Result
      </div>
      <div className="go-back-button" onClick={() => navigate("/")}>
        Go Back
      </div>
      {searchText && (
        <div
          className="clear-icon"
          onClick={() => {
            setZoom(10);
            setSearchText("");
          }}
        >
          <ClearIcon color="disabled" />
        </div>
      )}
      <div className={`result ${isResultShown ? "show" : "hide"}`}>
        <div className="result-header">
          <div className="result-title">Result</div>
          <div className="close-icon" onClick={() => setIsResultShown(false)}>
            <ClearIcon color="disabled" />
          </div>
        </div>
        <Box
          sx={{
            width: "100%",
            maxWidth: 360,
            bgcolor: "background.paper",
            height: 300,
            overflow: "scroll",
          }}
        >
          {result.length > 0 ? (
            result.map((e, i) => (
              <Card sx={{ maxWidth: 345 }} key={i}>
                <CardMedia
                  sx={{ height: 100 }}
                  image={e.photo}
                  title="green iguana"
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
            <div className="no-result-container">
              <div className="no-result">Oops, no result found.</div>
              <div className="find-button" onClick={findButton}>
                Let's go find one!
              </div>
            </div>
          )}
        </Box>
      </div>
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
    </div>
  );
};

export default App;
