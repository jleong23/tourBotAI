import React from "react";
import { Link } from "react-router-dom";

function PlaceCardItem({ place }) {
  return (
    <Link
      to={
        "https://www.google.com/maps/search/?api=1&query=" +
        encodeURIComponent(place.placeName)
      }
    >
      <div
        className="border rounded-2xl p-4 flex gap-4 bg-white
        hover:shadow-lg hover:-translate-y-[2px] transition-all duration-200
        cursor-pointer"
      >
        <img
          src={place.imageUrl || "/placeholder.jpeg"}
          alt={place.placeName}
          className="w-[110px] h-[110px] object-cover rounded-xl shadow-sm"
        />

        <div className="flex flex-col justify-between">
          <div>
            <h2 className="font-semibold text-base text-gray-900 leading-tight">
              {place.placeName || place.title || place.activity}
            </h2>

            {place.placeDetails && (
              <p className="text-sm text-gray-500 mt-[2px] line-clamp-2">
                {place.placeDetails}
              </p>
            )}
          </div>

          {place.timeToTravel && (
            <p className="text-sm font-medium text-gray-700 mt-2">
              🕢 {place.timeToTravel}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

export default PlaceCardItem;
