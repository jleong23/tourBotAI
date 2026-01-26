// HotelCardItem.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

function HotelCardItem({ hotel, index, cardVariants }) {
  const [photoUrl, setPhotoUrl] = useState();

  const hotelName = hotel?.hotelName || hotel?.hotel_name || hotel?.HotelName;
  const hotelAddress =
    hotel?.hotelAddress || hotel?.hotel_address || hotel?.HotelAddress;
  const hotelPrice =
    hotel?.pricePerNight_RM ||
    hotel?.price_per_night_rm ||
    hotel?.priceRange ||
    hotel?.price ||
    hotel?.PricePerNight;

  useEffect(() => {
    if (!hotelName || !window.google?.maps) return;

    const service = new window.google.maps.places.PlacesService(
      document.createElement("div"),
    );
    const request = {
      query: `${hotelName}, ${hotelAddress}`,
      fields: ["photos"],
    };

    service.findPlaceFromQuery(request, (results, status) => {
      if (
        status === window.google.maps.places.PlacesServiceStatus.OK &&
        results?.[0]?.photos?.length
      ) {
        const url = results[0].photos[0].getUrl({ maxWidth: 600 });
        setPhotoUrl(url);
      }
    });
  }, [hotel, hotelName, hotelAddress]);

  return (
    <motion.a
      key={index}
      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotelName + ", " + hotelAddress)}`}
      target="_blank"
      rel="noreferrer"
      variants={cardVariants}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="cursor-pointer block rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-white"
    >
      <div className="relative h-[180px] w-full bg-gray-200 animate-pulse">
        <img
          src={
            photoUrl ||
            hotel?.hotelImageUrl ||
            hotel?.hotel_image_url ||
            hotel?.HotelImageUrl ||
            "/placeholder-hotel.jpeg"
          }
          alt={hotelName || "Hotel"}
          className="rounded-xl h-full w-full object-cover"
          loading="lazy"
          onLoad={(e) => e.currentTarget.classList.remove("animate-pulse")}
        />
      </div>

      <div className="my-2 flex flex-col gap-1 p-2">
        <h2 className="font-medium text-md">{hotelName || "Unnamed Hotel"}</h2>
        {hotelAddress && (
          <h2 className="text-xs text-gray-500">📍 {hotelAddress}</h2>
        )}
        {hotelPrice && (
          <h2 className="text-sm">
            💰 {hotelPrice}{" "}
            {typeof hotelPrice === "number" || !isNaN(Number(hotelPrice))
              ? "RM"
              : ""}
          </h2>
        )}
        {hotel.rating && <h2 className="text-sm">⭐ {hotel.rating}</h2>}
      </div>
    </motion.a>
  );
}

export default HotelCardItem;
