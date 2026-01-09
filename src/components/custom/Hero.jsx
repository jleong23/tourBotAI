import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../ui/button.jsx";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-slate-50">
      <motion.div
        className="max-w-6xl px-6 md:px-12 text-center flex flex-col items-center gap-8"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Heading */}
        <motion.h1
          variants={fadeUp}
          className="font-extrabold tracking-tight text-3xl sm:text-4xl md:text-6xl leading-tight"
        >
          <span className="text-purple-600">Discover Your Next Adventure</span>
          <br />
          with an AI-Personalised Itinerary
        </motion.h1>

        {/* Subheading */}
        <motion.p
          variants={fadeUp}
          className="max-w-3xl text-base sm:text-lg md:text-xl text-gray-600"
        >
          Your AI-powered trip planner and travel curator, built to design
          personalised itineraries tailored to your interests, schedule, and
          budget.
        </motion.p>

        {/* CTA */}
        <motion.div variants={fadeUp}>
          <Link to="/create-trip">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="px-8 py-6 text-lg font-semibold rounded-xl shadow-md hover:shadow-lg transition !bg-black">
                Get Started — It’s Free
              </Button>
            </motion.div>
          </Link>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          variants={fadeUp}
          className="w-full mt-10 flex justify-center"
        >
          <motion.img
            src="/landing.jpeg"
            alt="AI travel planning"
            className="w-full max-w-4xl rounded-2xl shadow-xl border border-slate-200"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
