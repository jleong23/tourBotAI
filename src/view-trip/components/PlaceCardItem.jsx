// PlaceCardItem.jsx
import React, { useEffect, useState } from "react";

function PlaceCardItem({ place }) {
  const [photoUrl, setPhotoUrl] = useState();

  useEffect(() => {
    if (!place?.placeName || !window.google?.maps) return;

    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );
    const request = { query: place.placeName, fields: ["photos"] };

    service.findPlaceFromQuery(request, (results, status) => {
      if (
        status === window.google.maps.places.PlacesServiceStatus.OK &&
        results?.[0]?.photos?.length
      ) {
        const url = results[0].photos[0].getUrl({ maxWidth: 400 });
        setPhotoUrl(url);
      }
    });
  }, [place]);

  return (
    <a
      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.placeName)}`}
      target="_blank"
      rel="noreferrer"
    >
      <div className="border rounded-2xl p-4 flex gap-4 bg-white hover:shadow-lg cursor-pointer">
        <img
          src={photoUrl || place.imageUrl || "/placeholder.jpeg"}
          alt={place.placeName}
          className="w-[110px] h-[110px] object-cover rounded-xl"
        />
        <div className="flex flex-col justify-between">
          <h2 className="font-semibold text-base text-gray-900">
            {place.placeName}
          </h2>
        </div>
      </div>
    </a>
  );
}

export default PlaceCardItem;
