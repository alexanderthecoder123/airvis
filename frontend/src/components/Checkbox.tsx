// CheckboxList.tsx

import React, { useState, useEffect } from "react";
import OptionButton from "./OptionButton";
import { useGlobalState } from "../context/state";

const CheckboxList: React.FC = () => {
  const amenitiesList = [
    { name: "Pool", icon: "/src/assets/pool.svg" },
    { name: "Wifi", icon: "/src/assets/wifi.svg" },
    { name: "Kitchen", icon: "/src/assets/kitchen.svg" },
    { name: "Free Cancellation", icon: "/src/assets/calendar.svg" },
    { name: "Free Parking", icon: "/src/assets/parking.svg" },
    { name: "Breakfast", icon: "/src/assets/breakfast.svg" },
  ];

  const { filters, setFilter } = useGlobalState();
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(filters.amenitiesFilter || []);

  // Sync local state with global state on mount
  useEffect(() => {
    setSelectedAmenities(filters.amenitiesFilter || []);
  }, [filters.amenitiesFilter]);

  const handleAmenityChange = (amenityName: string, isSelected: boolean) => {
    let newSelectedAmenities: string[];
    if (isSelected) {
      newSelectedAmenities = [...selectedAmenities, amenityName];
    } else {
      newSelectedAmenities = selectedAmenities.filter((name) => name !== amenityName);
    }
    setSelectedAmenities(newSelectedAmenities);
    // Update the global filters
    setFilter('amenitiesFilter', newSelectedAmenities);
  };

  return (
    <div>
      <p style={{ fontWeight: "bold" }}>Amenities</p>
      <div className={"d-flex flex-wrap gap-2"}>
        {amenitiesList.map((amenity) => (
          <OptionButton
            key={amenity.name}
            name={amenity.name}
            icon={amenity.icon}
            onChange={(isSelected) => handleAmenityChange(amenity.name, isSelected)}
          />
        ))}
      </div>
      <hr />
    </div>
  );
};

export default CheckboxList;