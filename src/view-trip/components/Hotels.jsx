import React, { useEffect, useState } from "react";
import useGoogleMapsLoader from "@/components/google-maps-API";

function Hotels({ trip, apiKey }) {
  const hotelOptions =
    trip?.tripData?.travelPlan?.hotelOptions ||
    trip?.tripData?.hotelOptions ||
    trip?.tripData?.hotels ||
    [];

  const [hotelPhotos, setHotelPhotos] = useState({});
  const placeholderImage = "/placeholder-hotel.jpeg";

  // Load Google Maps JS API
  useGoogleMapsLoader(apiKey);

  useEffect(() => {
    const fetchPhotos = async () => {
      if (!hotelOptions.length) return;

      if (!window.google?.maps) {
        setTimeout(fetchPhotos, 500);
        return;
      }

      const { PlacesService, PlacesServiceStatus } =
        await window.google.maps.importLibrary("places");
      const service = new PlacesService(document.createElement("div"));

      hotelOptions.forEach((hotel) => {
        const request = {
          query: `${hotel.hotelName}, ${hotel.hotelAddress}`,
          fields: ["photos"],
        };

        service.findPlaceFromQuery(request, (results, status) => {
          if (
            status === PlacesServiceStatus.OK &&
            results?.[0]?.photos?.length
          ) {
            setHotelPhotos((prev) => ({
              ...prev,
              [hotel.hotelName]: results[0].photos[0].getUrl(),
            }));
          }
        });
      });
    };

    fetchPhotos();
  }, [hotelOptions]);

  return (
    <div>
      <h2 className="font-bold text-xl mt-5 mb-3">Hotel Recommendations</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
        {hotelOptions.map((hotel, index) => {
          const photoUrl =
            hotelPhotos[hotel.hotelName] ||
            hotel.hotelImageURL ||
            placeholderImage;

          return (
            <a
              key={index}
              href={
                "https://www.google.com/maps/search/?api=1&query=" +
                encodeURIComponent(hotel.hotelName + ", " + hotel.hotelAddress)
              }
              target="_blank"
              rel="noreferrer"
              className="hover:scale-105 transition-all cursor-pointer block"
            >
              <img
                src={photoUrl}
                alt={hotel.hotelName || "Hotel"}
                className="rounded-xl h-[180px] w-full object-cover"
                loading="lazy"
              />

              <div className="my-2 flex flex-col gap-1">
                <h2 className="font-medium">
                  {hotel.hotelName || "Unnamed Hotel"}
                </h2>
                {hotel.hotelAddress && (
                  <h2 className="text-xs text-gray-500">
                    📍 {hotel.hotelAddress}
                  </h2>
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
            </a>
          );
        })}
      </div>
    </div>
  );
}

export default Hotels;
