// PlaceCardItem.jsx
import React, { useEffect, useState } from "react";

function PlaceCardItem({ place }) {
  const [photoUrl, setPhotoUrl] = useState();

  const placeName =
    place.placeName ||
    place.place_name ||
    place.place ||
    place.name ||
    place.Activity;
  const placeDetails =
    place.details || place.description || place.Description || place.desc;

  useEffect(() => {
    if (!placeName || !window.google?.maps) return;

    const service = new window.google.maps.places.PlacesService(
      document.createElement("div"),
    );
    const request = { query: placeName, fields: ["photos"] };

    service.findPlaceFromQuery(request, (results, status) => {
      if (
        status === window.google.maps.places.PlacesServiceStatus.OK &&
        results?.[0]?.photos?.length
      ) {
        const url = results[0].photos[0].getUrl({ maxWidth: 400 });
        setPhotoUrl(url);
      }
    });
  }, [place, placeName]);

  return (
    <a
      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeName)}`}
      target="_blank"
      rel="noreferrer"
    >
      <div className="border rounded-2xl p-4 flex gap-4 bg-white hover:shadow-lg cursor-pointer h-full">
        <img
          src={
            photoUrl || place.imageUrl || place.image_url || "/placeholder.jpeg"
          }
          alt={placeName}
          className="w-[110px] h-[110px] object-cover rounded-xl flex-shrink-0"
        />
        <div className="flex flex-col gap-1">
          {place.Time && (
            <p className="text-xs font-medium text-gray-500">{place.Time}</p>
          )}
          <h2 className="font-semibold text-base text-gray-900">{placeName}</h2>
          {placeDetails && (
            <p className="text-sm text-gray-600 line-clamp-3">{placeDetails}</p>
          )}
        </div>
      </div>
    </a>
  );
}

export default PlaceCardItem;
