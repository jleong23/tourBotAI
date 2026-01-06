import axios from "axios";

const BASE_URL =
  "https://places.googleapis.com/v1/places:searchText?key=" +
  import.meta.env.VITE_GOOGLE_PLACE_API_KEY;

export const GetPlaceDetails = async (query) => {
  const res = await axios.post(
    BASE_URL,
    { textQuery: query },
    {
      headers: {
        "Content-Type": "application/json",
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.formattedAddress,places.photos",
      },
    }
  );

  return res.data;
};

export const PHOTO_REF_URL =
  "https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=600&maxWidthPx=800&key=" +
  import.meta.env.VITE_GOOGLE_PLACE_API_KEY;
