import React from "react";
import PlaceCardItem from "./PlaceCardItem";

function PlaceToVisit({ trip }) {
  return (
    <section className="mt-6">
      <h2 className="font-semibold text-xl tracking-tight">Places To Visit</h2>

      <div className="mt-4 space-y-8">
        {trip?.tripData?.itinerary?.map((item, index) => (
          <div key={index} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {typeof item.day === "string" &&
              item.day.toLowerCase().includes("day")
                ? `${item.day} : ${item.theme}`
                : `Day ${item.day ?? item.dayNumber}: ${item.theme}`}
            </h3>

            <div className="grid gap-6 md:grid-cols-2">
              {(item.plan || item.activities || item.places)?.map(
                (place, i) => (
                  <div key={i}>
                    {place.bestTimeToVisit && (
                      <p className="text-xs font-medium text-orange-700 mb-1">
                        Best time: {place.bestTimeToVisit}
                      </p>
                    )}

                    <PlaceCardItem place={place} />
                  </div>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default PlaceToVisit;
