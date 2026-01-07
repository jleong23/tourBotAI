import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GetPlaceDetails, PHOTO_REF_URL } from "@/service/GlobalApi";
import { Link } from "react-router-dom";

function UserTripCardItem({ trip, index, cardVariants }) {
  const [photoUrl, setPhotoUrl] = useState();

  useEffect(() => {
    if (trip?.userSelection?.location?.label) {
      GetPlacePhoto();
    }
  }, [trip]);

  const GetPlacePhoto = async () => {
    try {
      const res = await GetPlaceDetails(trip?.userSelection?.location?.label);

      const place = res?.places?.[0];
      const photo = place?.photos?.[0];
      if (!photo?.name) return;

      const url = PHOTO_REF_URL.replace("{NAME}", photo.name);
      setPhotoUrl(url);
    } catch (err) {
      console.error(
        "Places API Error:",
        JSON.stringify(err?.response?.data?.error, null, 2)
      );
    }
  };

  return (
    <motion.div
      key={index}
      variants={cardVariants}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="cursor-pointer block rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-white"
    >
      <Link to={`/view-trip/${trip?.id}`} className="block">
        <div className="relative h-[180px] w-full bg-gray-200">
          <img
            src={photoUrl || "/placeholder.jpeg"}
            alt={trip?.userSelection?.location?.label || "Trip Location"}
            className="h-full w-full object-cover rounded-xl"
            loading="lazy"
          />
        </div>

        <div className="my-2 flex flex-col gap-1 p-2">
          <h2 className="font-bold text-md">
            {trip?.userSelection?.location?.label || "Untitled Trip"}
          </h2>

          <h2 className="text-sm text-gray-500">
            {trip?.userSelection?.noOfDays} Days trip with{" "}
            {trip?.userSelection?.budget}
          </h2>
        </div>
      </Link>
    </motion.div>
  );
}

export default UserTripCardItem;
