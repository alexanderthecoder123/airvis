import Chart from './components/PriceHist.tsx'
import 'bootstrap/dist/css/bootstrap.min.css';

import PieChart from './components/pieChart.tsx'
import './App.css'
import CheckboxList from "./components/Checkbox.tsx";
import DropdownList from "./components/DropdownList.tsx";
import Slider from "./components/Slider.tsx";
import HeaderBar from "./components/Header.tsx";
import Map from "./components/Map.tsx";
import {useEffect, useState} from "react";
import RoomsAndBeds from "./components/RoomsAndBeds.tsx";
import ToggleFilter from "./components/ToggleFilters.tsx";
import { useGlobalState } from "./context/state";
import ShortTermRentals from "./components/ShortTermRentals.tsx";


function App() {

  const [sidebarWidth, setSidebarWidth] = useState<number | null>(null); // Initial sidebar width
  const [isResizing, setIsResizing] = useState(false);
  
  const globalState = useGlobalState();
  const totalListings = globalState?.listings.length || 0;
  const displayedListings = globalState?.displayData.length || 0;
  const percentageDisplayed = totalListings > 0 ? ((displayedListings / totalListings) * 100).toFixed(2) : "0";
  

  const handleResize = () => {
    setSidebarWidth(null);
    // reset width of bar on change of window size
    const sidebar: HTMLElement = document.querySelector(".sidebar")!;
    sidebar.style.width = '';
    // triger change in resizing variable that map resizes
    setIsResizing(true);
    setTimeout(() => {
      setIsResizing(false); // Set back to false after a short delay
    }, 20); // Adjust delay if needed, 10ms should be enough
  };

  useEffect(() => {
    // Add event listener on mount
    window.addEventListener('resize', handleResize);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isResizing) {
      const newWidth = Math.min(Math.max(e.clientX, 300), 800); // Minimum width of 200px
      setSidebarWidth(newWidth);
    }
  };

  const handleMouseDown = () => {
    setIsResizing(true);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  

  return (
    <>
      <div
        className="overflow-hidden vh-100 d-flex flex-column"
        onMouseMove={handleMouseMove} // Attach to the container for smooth resizing
        onMouseUp={handleMouseUp} // Stop resizing anywhere on the screen
      >
        <HeaderBar/>
        <div className="container-fluid flex-grow-1 d-flex p-0 position-relative" style={{height: "100%"}}>
          <div className="sidebar col-4 col-xl-3 overflow-auto px-4" style={{
            maxHeight: "100%",
            marginBottom: "100px",
            width: `${sidebarWidth == null ? 'auto' : sidebarWidth}px`,
            transition: isResizing ? "none" : "width 0.3s ease",
          }}>
            <div className={"pt-4"} style={{position: "sticky", top: 0, zIndex: "100", backgroundColor: "white"}}>
              <DropdownList/>
              <hr/>
              </div>
               <div>
                <h3>Statistics</h3>
                <p>Total Listings: {totalListings}</p>
                <p>Displaying {displayedListings} ({percentageDisplayed}%)</p>
              </div>
              <ToggleFilter/>
              <Slider/>
              <CheckboxList/>
              <RoomsAndBeds/>
              <Chart/>
              <hr />
              <PieChart/>
              <hr />
              <ShortTermRentals />
            </div>

            {/* Resizer Handle */}
            <div
              onMouseDown={handleMouseDown} // Start resizing on mousedown
              style={{
                width: "5px",
                cursor: "col-resize",
                backgroundColor: "#ddd",
                zIndex: 10,
              }}
            ></div>

            <div className="flex-grow-1 col-8-lg col-12-sm">
              <Map width={isResizing}/>
            </div>

          </div>

        </div>
      </>
      )
      }

      export default App
