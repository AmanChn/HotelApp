import { useLocation } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import Navbar from "../../components/navbar/Navbar";
import "./cityHotels.css";

const CityHotels = () => {
  const location = useLocation();
  const city = new URLSearchParams(location.search).get("city");

  // Capitalize city for display
  const displayCity = city
    ? city.charAt(0).toUpperCase() + city.slice(1).toLowerCase()
    : "Unknown";

  const { data, loading, error } = useFetch(city ? `/hotels?city=${city}` : "/hotels");

  return (
    <div>
      <Navbar />
      <div className="cityHotelsContainer">
        <h1 className="cityTitle">Hotels in {displayCity}</h1>
        {loading ? (
          "Loading properties, please wait..."
        ) : error ? (
          <span className="error">Error loading properties: {error.message}</span>
        ) : (
          <div className="hotelList">
            {data.length > 0 ? (
              data.map((hotel) => (
                <div key={hotel._id} className="hotelItem">
                  {hotel.photos && hotel.photos.length > 0 ? (
                    <img
                      src={hotel.photos[0]}
                      alt={hotel.name}
                      className="hotelImg"
                    />
                  ) : (
                    <div className="noImage">No image available</div>
                  )}
                  <div className="hotelDetails">
                    <h2>{hotel.name}</h2>
                    <p>{hotel.address}</p>
                    <p>{hotel.desc}</p>
                    <p>Price: ₹{hotel.cheapestPrice}</p>
                    {hotel.rating && <p>Rating: {hotel.rating}/5</p>}
                  </div>
                </div>
              ))
            ) : (
              <p>No properties found in {displayCity}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CityHotels;