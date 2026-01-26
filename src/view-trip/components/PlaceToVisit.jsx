import React from "react";
import PlaceCardItem from "./PlaceCardItem";

function PlaceToVisit({ trip }) {
  // Helper to normalize itinerary data
  const getItineraryData = () => {
    const itinerary =
      trip?.tripData?.itinerary ||
      trip?.tripData?.travelPlan?.itinerary ||
      trip?.tripData?.travel_plan?.itinerary ||
      trip?.tripData?.schedule;

    // If it's an array, return it directly
    if (Array.isArray(itinerary)) {
      return itinerary;
    }

    // If it's an object (e.g., { day1: {...}, day2: {...} }), convert to array
    if (typeof itinerary === "object" && itinerary !== null) {
      return Object.entries(itinerary).map(([key, value]) => ({
        day: key, // Use key as day if missing in value
        ...value,
      }));
    }

    return [];
  };

  const itineraryList = getItineraryData();

  return (
    <section className="mt-6">
      <h2 className="font-semibold text-xl tracking-tight">Places To Visit</h2>

      <div className="mt-4 space-y-8">
        {itineraryList.map((item, index) => (
          <div key={index} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {typeof (item.day || item.Day) === "string" &&
              (item.day || item.Day).toLowerCase().includes("day")
                ? `${item.day || item.Day} : ${
                    item.theme || item.title || item.Theme || ""
                  }`
                : `Day ${
                    item.day ||
                    item.dayNumber ||
                    item.day_number ||
                    item.Day ||
                    index + 1
                  }: ${item.theme || item.title || item.Theme || ""}`}
            </h3>

            <div className="grid gap-6 md:grid-cols-2">
              {(
                item.plan ||
                item.activities ||
                item.places ||
                item.schedule ||
                item.Activities ||
                item.items
              )?.map((place, i) => (
                <div key={i}>
                  {(place.bestTimeToVisit ||
                    place.best_time_to_visit ||
                    place.time_to_visit) && (
                    <p className="text-xs font-medium text-orange-700 mb-1">
                      Best time:{" "}
                      {place.bestTimeToVisit ||
                        place.best_time_to_visit ||
                        place.time_to_visit}
                    </p>
                  )}

                  <PlaceCardItem place={place} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default PlaceToVisit;
