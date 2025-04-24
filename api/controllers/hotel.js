import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

export const createHotel = async (req, res, next) => {
  const newHotel = new Hotel(req.body);
  try {
    const savedHotel = await newHotel.save();
    res.status(200).json(savedHotel);
  } catch (err) {
    next(err);
  }
};

export const updateHotel = async (req, res, next) => {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedHotel);
  } catch (err) {
    next(err);
  }
};

export const deleteHotel = async (req, res, next) => {
  try {
    await Hotel.findByIdAndDelete(req.params.id);
    res.status(200).json("Hotel has been deleted.");
  } catch (err) {
    next(err);
  }
};

export const getHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    res.status(200).json(hotel);
  } catch (err) {
    next(err);
  }
};

export const getHotels = async (req, res, next) => {
  const { city, min, max, ...others } = req.query;
  try {
    const query = {};
    if (city) {
      query.city = { $regex: `^${city}$`, $options: "i" }; // Case-insensitive
    }
    if (min || max) {
      query.cheapestPrice = {
        $gte: Number(min) || 1,
        $lte: Number(max) || 999999,
      };
    }
    const hotels = await Hotel.find({ ...query, ...others }).limit(
      req.query.limit ? Number(req.query.limit) : 100
    );
    res.status(200).json(hotels);
  } catch (err) {
    next(err);
  }
};

export const countByCity = async (req, res, next) => {
  const cities = req.query.cities.split(",");
  try {
    const list = await Promise.all(
      cities.map(async (city) => {
        const count = await Hotel.countDocuments({
          city: { $regex: `^${city}$`, $options: "i" }, // Case-insensitive
        });
        return count;
      })
    );
    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

export const countByType = async (req, res, next) => {
  try {
    const hotelCount = await Hotel.countDocuments({
      type: { $regex: "^hotel$", $options: "i" },
    });
    const apartmentCount = await Hotel.countDocuments({
      type: { $regex: "^apartment$", $options: "i" },
    });
    const resortCount = await Hotel.countDocuments({
      type: { $regex: "^resort$", $options: "i" },
    });
    const villaCount = await Hotel.countDocuments({
      type: { $regex: "^villa(s)?$", $options: "i" }, // Matches "villa" or "villas"
    });
    const cabinCount = await Hotel.countDocuments({
      type: { $regex: "^cabin$", $options: "i" },
    });
    res.status(200).json([
      { type: "hotels", count: hotelCount },
      { type: "apartments", count: apartmentCount },
      { type: "resorts", count: resortCount },
      { type: "villas", count: villaCount },
      { type: "cabins", count: cabinCount },
    ]);
  } catch (err) {
    next(err);
  }
};

export const getHotelRooms = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    const list = await Promise.all(
      hotel.rooms.map((room) => {
        return Room.findById(room);
      })
    );
    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};