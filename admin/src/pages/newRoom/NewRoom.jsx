import "./newRoom.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
// eslint-disable-next-line no-unused-vars
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import { roomInputs } from "../../formSource";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const NewRoom = () => {
  const [info, setInfo] = useState({});
  const [hotelId, setHotelId] = useState(""); // Initialize as empty string
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  const { data, loading, error } = useFetch("/hotels");

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    console.log("Send button clicked"); // Debug
    try {
      if (!hotelId) {
        throw new Error("Please select a hotel");
      }

      const roomNumbers = rooms
        .split(",")
        .map((room) => ({ number: parseInt(room.trim(), 10) }))
        .filter((room) => !isNaN(room.number));

      if (roomNumbers.length === 0) {
        throw new Error("Please enter at least one valid room number");
      }

      const newRoom = {
        ...info,
        roomNumbers,
      };

      console.log("Sending room data:", newRoom); // Debug

      const res = await axios.post(`/rooms/${hotelId}`, newRoom, {
        withCredentials: true,
      });
      alert("Room created successfully!");
      navigate("/rooms");
      return res.data;
    } catch (err) {
      console.error("Error creating room:", err.response?.data || err.message);
      alert("Failed to create room: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Add New Room</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form>
              {roomInputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    id={input.id}
                    type={input.type}
                    placeholder={input.placeholder}
                    onChange={handleChange}
                  />
                </div>
              ))}
              <div className="formInput">
                <label>Rooms</label>
                <textarea
                  onChange={(e) => setRooms(e.target.value)}
                  placeholder="Give comma between room numbers (e.g., 101,102)"
                />
              </div>
              <div className="formInput">
                <label>Choose a hotel</label>
                <select
                  id="hotelId"
                  onChange={(e) => setHotelId(e.target.value)}
                  value={hotelId}
                >
                  <option value="">Select a hotel</option>
                  {loading ? (
                    <option>Loading...</option>
                  ) : error ? (
                    <option>Error loading hotels</option>
                  ) : (
                    data.map((hotel) => (
                      <option key={hotel._id} value={hotel._id}>
                        {hotel.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
              <button type="button" onClick={handleClick}>
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewRoom;