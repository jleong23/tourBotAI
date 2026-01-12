import {
  FaUser,
  FaHeart,
  FaUsers,
  FaUserFriends,
  FaWallet,
  FaMoneyBillWave,
  FaGem,
} from "react-icons/fa";

export const SelectTravelerList = [
  {
    id: 1,
    title: "Solo",
    description: "Traveling alone",
    icon: FaUser,
    people: "1 person",
    color: "text-slate-600",
  },
  {
    id: 2,
    title: "Couple",
    description: "Traveling with a partner",
    icon: FaHeart,
    people: "2 people",
    color: "text-rose-500",
  },
  {
    id: 3,
    title: "Family",
    description: "Traveling with family members",
    icon: FaUsers,
    people: "3–5 people",
    color: "text-indigo-600",
  },
  {
    id: 4,
    title: "Friends",
    description: "Traveling with friends",
    icon: FaUserFriends,
    people: "5–10 people",
    color: "text-teal-600",
  },
];

export const SelectBudgetOptions = [
  {
    id: 1,
    title: "Low Budget",
    description: "Affordable options",
    icon: FaWallet,
    budget: "$",
    color: "text-green-600",
  },
  {
    id: 2,
    title: "Mid Range",
    description: "Moderate spending",
    icon: FaMoneyBillWave,
    budget: "$$",
    color: "text-blue-600",
  },
  {
    id: 3,
    title: "High End",
    description: "Luxury experiences",
    icon: FaGem,
    budget: "$$$",
    color: "text-purple-600",
  },
];

export const AI_PROMPT =
  "Generate Travel Plan for Location: {location}, For {totalDays} days for {traveler} with a {budget}, give me Hotels option list with HotelName, HotelAddress, Price, hotel image URL, Geo coordinates, rating, descriptions and suggest itinerary with PlaceName, Place Details, Place Image URL, Geo coordinate, ticket pricing, Time to travel each of the location for {totalDays} days with each day planned with best time to visit in JSON format";
