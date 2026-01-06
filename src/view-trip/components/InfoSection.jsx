import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CalendarDays, CircleDollarSign, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { GetPlaceDetails } from "@/service/GlobalApi";
import { PHOTO_REF_URL } from "@/service/GlobalApi";

function InfoSection({ trip }) {
  const [photoUrl, setPhotoUrl] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    GetPlacePhoto();
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

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };
  const staggerChildren = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  return (
    <motion.div
      className="relative"
      initial="hidden"
      animate="visible"
      variants={staggerChildren}
    >
      {/* Hero Image & Back Button */}
      <motion.div className="relative" variants={fadeUp}>
        <div className="absolute top-5 left-5 z-10">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="default"
              size="icon"
              iconSize="md"
              className="!rounded-full !bg-white !text-gray-700 hover:!bg-gray-100 hover:!text-gray-900 shadow-md"
              aria-label="Go Back"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft />
            </Button>
          </motion.div>
        </div>

        <motion.img
          src={photoUrl || "/placeholder.jpeg"}
          className="h-[340px] w-full object-cover rounded-xl shadow-md"
          alt="Destination"
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
        />
      </motion.div>

      {/* Trip Info */}
      <motion.div
        className="flex justify-between items-center mt-4 flex-col md:flex-row gap-4"
        variants={fadeUp}
      >
        <motion.div className="flex flex-col gap-2" variants={fadeUp}>
          <h2 className="font-bold text-2xl">
            {trip?.userSelection?.location?.label}
          </h2>
          <motion.div
            className="flex flex-wrap gap-3 md:gap-5"
            variants={staggerChildren}
          >
            {/* Days */}
            <motion.div
              className="flex gap-2 p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md items-center"
              variants={fadeUp}
            >
              <CalendarDays className="h-4 w-4" />
              <h2>{trip?.userSelection?.days} Days</h2>
            </motion.div>

            {/* Budget */}
            <motion.div
              className="flex gap-2 p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md items-center"
              variants={fadeUp}
            >
              <CircleDollarSign className="h-4 w-4" />
              <h2>{trip?.userSelection?.budget} Budget</h2>
            </motion.div>

            {/* Travelers */}
            <motion.div
              className="flex gap-2 p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md items-center"
              variants={fadeUp}
            >
              <Users className="h-4 w-4" />
              <h2>{trip?.userSelection?.traveler} Traveler</h2>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default InfoSection;
