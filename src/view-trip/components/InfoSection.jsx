import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CircleDollarSign,
  Users,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function InfoSection({ trip }) {
  const [photoUrl, setPhotoUrl] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if (trip?.userSelection?.location?.label) {
      loadPlacePhoto(trip.userSelection.location.label);
    }
  }, [trip]);

  // Waits for the Google Maps SDK to load before using PlacesService
  const loadPlacePhoto = async (placeName) => {
    // Wait until window.google and maps.places are available
    if (!window.google?.maps) {
      // Retry after a short delay
      setTimeout(() => loadPlacePhoto(placeName), 500);
      return;
    }

    const { PlacesService, PlacesServiceStatus } =
      await window.google.maps.importLibrary("places");
    const service = new PlacesService(document.createElement("div"));
    const request = {
      query: placeName,
      fields: ["photos"],
    };

    service.findPlaceFromQuery(request, (results, status) => {
      if (status === PlacesServiceStatus.OK && results && results[0].photos) {
        const url = results[0].photos[0].getUrl({ maxWidth: 800 }); // optional maxWidth
        setPhotoUrl(url);
      }
    });
  };

  return (
    <div>
      <div className="relative">
        <div className="absolute top-5 left-5">
          <Button
            variant="default"
            size="icon"
            iconSize="md"
            className="!rounded-full !bg-white !text-gray-700 hover:!bg-gray-100 hover:!text-gray-900"
            aria-label="Go Back"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft />
          </Button>
        </div>

        <img
          src={photoUrl || "/placeholder.jpeg"}
          className="h-[340px] w-full object-cover rounded-xl"
          alt="Destination"
        />
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="flex flex-col gap-2">
          <h2 className="font-bold text-2xl">
            {trip?.userSelection?.location?.label}
          </h2>
          <div className="flex flex-wrap gap-3 md:gap-5">
            <div className="flex gap-2 p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md items-center">
              <CalendarDays className="h-4 w-4" />
              <h2>{trip?.userSelection?.days} Days</h2>
            </div>

            <div className="flex gap-2 p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md items-center">
              <CircleDollarSign className="h-4 w-4" />
              <h2>{trip?.userSelection?.budget} Budget</h2>
            </div>

            <div className="flex gap-2 p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md items-center">
              <Users className="h-4 w-4" />
              <h2>{trip?.userSelection?.traveler} Traveler</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoSection;
