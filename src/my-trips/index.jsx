import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";
import { motion } from "framer-motion";
import UserTripCardItem from "./components/UserTripCardItem";

function MyTrips() {
  const [userTrips, setUserTrips] = useState([]);

  useEffect(() => {
    GetUserTrips();
  }, []);

  const GetUserTrips = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      window.location.href = "/";
      return;
    }

    setUserTrips([]);

    const q = query(
      collection(db, "AITrips"),
      where("userEmail", "==", user.email)
    );

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      setUserTrips((prev) => [...prev, doc.data()]);
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10">
      <h2 className="font-bold text-3xl">My Trips</h2>

      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-3.5"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {userTrips?.length > 0
          ? userTrips.map((trip, index) => (
              <UserTripCardItem
                key={index}
                trip={trip}
                index={index}
                cardVariants={cardVariants}
              />
            ))
          : [1, 2, 3, 4, 5, 6].map((item, index) => (
              <div
                key={index}
                className="h-[250px] w-full bg-slate-200 animate-pulse rounded-xl"
              ></div>
            ))}
      </motion.div>
    </div>
  );
}

export default MyTrips;
