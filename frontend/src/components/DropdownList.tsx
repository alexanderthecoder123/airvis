import React, {useState, useEffect} from 'react';
import {useGlobalState} from "../context/state.tsx";

// DropdownList component
function DropdownList() {

  // List of options for the dropdown
  const [optionData, setOptionData] = useState<string[]>([]);

  const {filters, setFilter} = useGlobalState();

  // Update the global state with the selected location
  const handleLocationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter('location', event.target.value);
  };

  // load data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await fetch('http://localhost:8000/area');
        const data = await resp.json();
        setOptionData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <div className={"d-flex align-items-end"}>
        <div className={"col-7"}>
          <h3>ZÜRICH</h3>
          <select className={"form-select"} style={{margin: "auto"}} value={filters.location || ''}
                  onChange={handleLocationChange}>
            {optionData.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default DropdownList;
