import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { chatSession } from "@/service/AIModel";
import { setDoc, doc } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";
import { AiOutlineLoading } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { motion } from "framer-motion";

import {
  Plane,
  Users,
  MapPinHouse,
  CalendarDays,
  CircleDollarSign,
  Icon,
} from "lucide-react";

import {
  AI_PROMPT,
  SelectBudgetOptions,
  SelectTravelerList,
} from "@/constants/options";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Helper to extract JSON from markdown code blocks
function extractJsonFromText(text) {
  const regex = /```json\s*([\s\S]*?)\s*```/i;
  const match = text.match(regex);
  return match?.[1]?.trim() || text;
}

function CreateTrip() {
  const [place, setPlace] = useState();
  const [formData, setFormData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    console.log("Form Data:", formData);
  }, [formData]);

  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => console.log("Google login error", error),
  });

  const OnGenerateTrip = async () => {
    const user = localStorage.getItem("user");
    if (!user) return setOpenDialog(true);

    if (
      (formData?.days > 5 && !formData?.location) ||
      !formData?.budget ||
      !formData?.traveler
    ) {
      toast("Please fill in all details!");
      return;
    }

    setLoading(true);

    const FINAL_PROMPT = AI_PROMPT.replace(
      "{location",
      formData?.location?.label,
    )
      .replace("{totalDays}", formData?.days)
      .replace("{traveler}", formData?.traveler)
      .replace("{budget}", formData?.budget);

    try {
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      setLoading(false);
      if (!result) return toast("AI response is empty. Trip not saved.");

      await SaveAiTrip(result.text || result);
    } catch (error) {
      setLoading(false);
      toast.error("Failed to generate trip: " + error.message);
    }
  };

  const SaveAiTrip = async (tripData) => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    const docId = Date.now().toString();

    let parsedTripData;
    try {
      parsedTripData = JSON.parse(extractJsonFromText(tripData));
    } catch {
      parsedTripData = tripData;
    }

    await setDoc(doc(db, "AITrips", docId), {
      userSelection: formData,
      tripData: parsedTripData,
      userEmail: user?.email,
      id: docId,
    });

    setLoading(false);
    toast.success("Trip saved successfully!");
    navigate("/view-trip/" + docId);
  };

  const GetUserProfile = (tokenInfo) => {
    axios
      .get(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenInfo?.access_token}`,
        {
          headers: { Authorization: `Bearer ${tokenInfo?.access_token}` },
        },
      )
      .then((resp) => {
        localStorage.setItem("user", JSON.stringify(resp.data));
        setOpenDialog(false);
        window.dispatchEvent(new Event("user-updated"));
        OnGenerateTrip();
      })
      .catch(() => toast.error("Failed to get user profile"));
  };

  // Motion variants
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };
  const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  return (
    <>
      <motion.div
        className="sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.div variants={fadeUp} className="flex items-center gap-2">
          <Plane className="text-xl" />
          <h2 className="text-3xl font-bold">Tell Us Your Travel Preference</h2>
        </motion.div>

        <motion.p variants={fadeUp} className="mt-3 text-gray-500 text-xl">
          Provide some basic information and the trip planner will generate a
          customized itinerary based on your preferences.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-10 flex flex-col gap-9">
          {/* Destination */}
          <motion.div variants={fadeUp}>
            <div className="flex items-center gap-2">
              <MapPinHouse className="text-xl" />
              <h2 className="text-xl my-3 font-medium">Destination</h2>
            </div>
            <GooglePlacesAutocomplete
              apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
              selectProps={{
                place,
                placeholder: "Please type your destination",
                onChange: (v) => {
                  setPlace(v);
                  handleInputChange("location", v);
                },
              }}
            />
          </motion.div>

          {/* Days */}
          <motion.div variants={fadeUp}>
            <div className="flex items-center gap-2">
              <CalendarDays />
              <h2 className="text-xl my-3 font-medium">Number of Days</h2>
            </div>
            <Input
              placeholder="Please type number of days"
              type="number"
              onChange={(e) => handleInputChange("days", e.target.value)}
            />
          </motion.div>
        </motion.div>

        {/* Budget */}
        <motion.div variants={fadeUp} className="mt-8">
          <div className="flex items-center gap-2">
            <CircleDollarSign />
            <h2 className="text-xl my-3 font-medium">Budget</h2>
          </div>

          <div className="grid grid-cols-3 gap-5">
            {SelectBudgetOptions.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleInputChange("budget", item.title)}
                  className={`
        p-4 border rounded-lg cursor-pointer
        ${
          formData?.budget === item.title
            ? "border-black bg-slate-100"
            : "hover:shadow-lg"
        }

        transition-all duration-200
      `}
                >
                  <Icon className={`text-2xl mb-2 ${item.color}`} />
                  <h2 className="font-bold text-lg">{item.title}</h2>
                  <h2 className="text-sm text-gray-600">{item.description}</h2>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Traveler */}
        <motion.div variants={fadeUp} className="mt-8">
          <div className="flex items-center gap-2">
            <Users className="text-xl" />
            <h2 className="text-xl my-3 font-medium">Travelers</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {SelectTravelerList.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleInputChange("traveler", item.people)}
                  className={`
        p-4 border rounded-lg cursor-pointer
        ${
          formData?.traveler === item.people
            ? "border-black bg-slate-100"
            : "hover:shadow-lg"
        }
        transition-all duration-200
      `}
                >
                  <Icon className={`text-2xl mb-2 ${item.color}`} />
                  <h2 className="font-bold text-lg">{item.title}</h2>
                  <h2 className="text-sm text-gray-600">{item.description}</h2>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Generate Button */}
        <motion.div variants={fadeUp} className="my-10 flex justify-end">
          <Button
            disabled={loading}
            onClick={OnGenerateTrip}
            className="flex items-center gap-3 min-w-[220px] justify-center"
          >
            {loading ? (
              <>
                <AiOutlineLoading className="animate-spin text-lg" />
                <span className="text-sm font-medium">
                  Generating your best travel plan…
                </span>
              </>
            ) : (
              "Generate Trip"
            )}
          </Button>
        </motion.div>

        {/* Google Sign-in Dialog */}
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="sr-only">Sign in with Google</DialogTitle>
              <DialogDescription asChild>
                <div>
                  <h2 className="font-bold text-lg mt-7">
                    Sign in With Google
                  </h2>
                  <p>Sign in to the App with Google Authentication securely.</p>
                  <Button
                    className="mt-5 w-full flex gap-4 items-center justify-center bg-black text-white hover:bg-slate-800"
                    onClick={login}
                  >
                    <FcGoogle className="h-7 w-7" /> Sign in with Google
                  </Button>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </motion.div>
    </>
  );
}

export default CreateTrip;
