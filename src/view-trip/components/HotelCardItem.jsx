// HotelCardItem.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

function HotelCardItem({ hotel, index, cardVariants }) {
  const [photoUrl, setPhotoUrl] = useState();

  useEffect(() => {
    if (!hotel?.hotelName || !window.google?.maps) return;

    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );
    const request = {
      query: `${hotel.hotelName}, ${hotel.hotelAddress}`,
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
  }, [hotel]);

  return (
    <motion.a
      key={index}
      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.hotelName + ", " + hotel.hotelAddress)}`}
      target="_blank"
      rel="noreferrer"
      variants={cardVariants}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="cursor-pointer block rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-white"
    >
      <div className="relative h-[180px] w-full bg-gray-200 animate-pulse">
        <img
          src={photoUrl || "/placeholder-hotel.jpeg"}
          alt={hotel.hotelName || "Hotel"}
          className="rounded-xl h-full w-full object-cover"
          loading="lazy"
          onLoad={(e) => e.currentTarget.classList.remove("animate-pulse")}
        />
      </div>

      <div className="my-2 flex flex-col gap-1 p-2">
        <h2 className="font-medium text-md">
          {hotel.hotelName || "Unnamed Hotel"}
        </h2>
        {hotel.hotelAddress && (
          <h2 className="text-xs text-gray-500">📍 {hotel.hotelAddress}</h2>
        )}
        {(hotel.pricePerNight_RM || hotel.priceRange) && (
          <h2 className="text-sm">
            💰{" "}
            {hotel.pricePerNight_RM
              ? `${hotel.pricePerNight_RM} RM`
              : hotel.priceRange}
          </h2>
        )}
        {hotel.rating && <h2 className="text-sm">⭐ {hotel.rating}</h2>}
      </div>
    </motion.a>
  );
}

export default HotelCardItem;
