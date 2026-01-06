// Hotels.jsx
import React from "react";
import { motion } from "framer-motion";

import HotelCardItem from "./HotelCardItem";
import useGoogleMapsLoader from "@/lib/useGoogleMapsLoader";

function Hotels({ trip, apiKey }) {
  const hotelOptions =
    trip?.tripData?.travelPlan?.hotelOptions ||
    trip?.tripData?.hotelOptions ||
    trip?.tripData?.hotels ||
    [];

  const mapsLoaded = useGoogleMapsLoader(apiKey);

  if (!mapsLoaded) return <p>Loading map data...</p>;

  // Framer Motion variants
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div>
      <motion.h2
        className="font-bold text-xl mt-5 mb-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Hotel Recommendations
      </motion.h2>

      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {hotelOptions.map((hotel, index) => (
          <HotelCardItem
            key={index}
            index={index}
            hotel={hotel}
            cardVariants={cardVariants}
          />
        ))}
      </motion.div>
    </div>
  );
}

export default Hotels;
