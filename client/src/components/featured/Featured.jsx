import useFetch from "../../hooks/useFetch";
import { useNavigate } from "react-router-dom";
import "./featured.css";

const Featured = () => {
  const { data, loading, error } = useFetch(
    "/hotels/countByCity?cities=delhi,noida,gurugram"
  );
  const navigate = useNavigate();

  const handleCityClick = (city) => {
    navigate(`/hotels/city?city=${city.toLowerCase()}`);
  };

  const cities = [
    {
      name: "Delhi",
      count: data[0],
      img: "https://cf.bstatic.com/xdata/images/city/max500/957801.webp?k=a969e39bcd40cdcc21786ba92826063e3cb09bf307bcfeac2aa392b838e9b7a5&o=",
    },
    {
      name: "Noida",
      count: data[1],
      img: "https://cf.bstatic.com/xdata/images/city/max500/690334.webp?k=b99df435f06a15a1568ddd5f55d239507c0156985577681ab91274f917af6dbb&o=",
    },
    {
      name: "Gurugram",
      count: data[2],
      img: "https://cf.bstatic.com/xdata/images/city/max500/689422.webp?k=2595c93e7e067b9ba95f90713f80ba6e5fa88a66e6e55600bd27a5128808fdf2&o=",
    },
  ];

  return (
    <div className="featured">
      {loading ? (
        "Loading please wait"
      ) : error ? (
        "Error loading city data"
      ) : (
        <>
          {cities.map((city, index) => (
            <div
              key={index}
              className="featuredItem"
              onClick={() => handleCityClick(city.name)}
            >
              <img src={city.img} alt={city.name} className="featuredImg" />
              <div className="featuredTitles">
                <h1>{city.name}</h1>
                <h2>{city.count || 0} properties</h2>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default Featured;