import { Link } from "react-router-dom";
import "./searchItem.css";

const SearchItem = ({ item }) => {
  return (
    <div className="searchItem">
      {item.photos && item.photos.length > 0 ? (
        <img src={item.photos[0]} alt={item.name} className="siImg" />
      ) : (
        <div className="siImg noImage">No image</div>
      )}
      <div className="siDesc">
        <h1 className="siTitle">{item.name || "Unnamed Hotel"}</h1>
        <span className="siDistance">{item.distance || "Unknown"}m from center</span>
        <span className="siTaxiOp">Free airport taxi</span>
        <span className="siSubtitle">Studio Apartment with Air conditioning</span>
        <span className="siFeatures">{item.desc || "No description"}</span>
        <span className="siCancelOp">Free cancellation</span>
        <span className="siCancelOpSubtitle">
          You can cancel later, so lock in this great price today!
        </span>
      </div>
      <div className="siDetails">
        {item.rating && (
          <div className="siRating">
            <span>Excellent</span>
            <button>{item.rating}</button>
          </div>
        )}
        <div className="siDetailTexts">
          <span className="siPrice">₹{item.cheapestPrice || "N/A"}</span>
          <span className="siTaxOp">Includes taxes and fees</span>
          <Link to={`/hotels/${item._id}`}>
            <button className="siCheckButton">See availability</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SearchItem;