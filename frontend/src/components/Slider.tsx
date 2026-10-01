import {useGlobalState} from "../context/state.tsx";
import {useState} from "react";

// Slider component
const InputSlider = () => {

    const [rangeParams, setRangeParams] = useState<{
      minPrice: string,
      maxPrice: string,
      offsetLeft: number,
      offsetRight: number
    }>({
      minPrice: "0",
      maxPrice: "1000",
      offsetLeft: 0,
      offsetRight: 1000,
    });

    // subscribe to global context
    const {setFilter} = useGlobalState();
    // Handle slider value change

  // also check for out of range value
    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>, type: number) => {
      let value: string = e.target.value;

      // minimum
      if (type === 0) {
        if (Number(value) >= Number(rangeParams.maxPrice)) {
          value = rangeParams.maxPrice;
        }
        setRangeParams((prev) => ({...prev, minPrice: value, offsetLeft: Number(value)}));
        // maximum
      } else if (type === 1) {
        if (Number(value) <= Number(rangeParams.minPrice)) {
          value = rangeParams.minPrice;
        }
        setRangeParams((prev) => ({...prev, maxPrice: value, offsetRight: Number(value)}));
      }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, type: number) => {
      const value: string = e.target.value;

      // minimum
      if (type == 0) {
        setRangeParams((prev) => ({...prev, minPrice: value}));
        // maximum
      } else if (type == 1) {
        /*
        if (Number(value) >= Number(rangeParams.maxPrice))
          value = rangeParams.maxPrice;
          */
        setRangeParams((prev) => ({...prev, maxPrice: value}));
      }
    }

    const numericKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
      const key = e.key;

      // Allow only numbers (0-9), backspace, delete, tab, arrow keys, etc.
      if (
        !/^[0-9]$/.test(key) && // Only numbers
        key !== "Backspace" && // Allow backspace
        key !== "Delete" && // Allow delete
        key !== "ArrowLeft" && // Allow arrow left
        key !== "ArrowRight" && // Allow arrow right
        key !== "Tab" && // Allow tab
        key !== "ArrowUp" && // Allow up arrow
        key !== "ArrowDown" // Allow down arrow
      ) {
        console.log(key);
        e.preventDefault(); // Prevent the default action for other keys
      }
    };

//currently hardcoded max range of 1000 for price diff. Should be changed
    return (
      <div className="range">
        <p style={{fontWeight : "bold"}}>Price Range</p>
        <p>Total price for one night</p>
        <div className="range-slider">
        <span className="range-selected"
              style={{
                left: (Number(rangeParams.offsetLeft)) / 10 + "%",
                right: (1000 - Number(rangeParams.offsetRight)) / 10 + "%"
              }}></span>
        </div>

        <div className="range-input">
          <input type="range" onChange={(e) => handleSliderChange(e, 0)} className="min" min="0" max="1000"
                 value={rangeParams.offsetLeft} onMouseUp={() => {
            setFilter('minPrice', rangeParams.minPrice)
          }}
                 step="10"/>
          <input type="range" onChange={(e) => handleSliderChange(e, 1)} className="max" min="0" max="1000"
                 value={rangeParams.offsetRight} onMouseUp={() => {
            setFilter('maxPrice', rangeParams.maxPrice)
          }}
                 step="10"/>
        </div>
        <div className="range-price justify-content-between"
             style={{margin: "auto", paddingTop: "20px"}}>
          <div className={'labels'}>
            <label htmlFor="min">Min</label>
            <input type="text" onKeyDown={numericKey} name="min" value={rangeParams.minPrice}
                   onBlur={(e) => {
                     const val = e.target.value;
                     if (val.length == 0) {
                       setRangeParams((prev) => ({
                         ...prev,
                         minPrice: "0",
                         offsetLeft: 0
                       }))
                     } else if (Number(val) >= Number(rangeParams.maxPrice)) {
                       setRangeParams((prev) => ({
                         ...prev,
                         minPrice: rangeParams.maxPrice,
                         offsetLeft: Number(rangeParams.maxPrice)
                       }))
                     } else {
                       setRangeParams((prev) => ({...prev, offsetLeft: Number(rangeParams.minPrice)}))
                     }
                     setFilter('minPrice', rangeParams.minPrice.length == 0 ? "0" : rangeParams.minPrice);
                   }} onChange={(e) => handleInputChange(e, 0)}/>
          </div>
          <div className={'labels'}>
            <label htmlFor="max">Max</label>
            <input type="text" onKeyDown={numericKey} name="max" value={rangeParams.maxPrice}
                   onBlur={(e) => {
                     if (Number(e.target.value) <= Number(rangeParams.minPrice)) {
                       setRangeParams((prev) => ({
                         ...prev,
                         maxPrice: rangeParams.minPrice,
                         offsetRight: Number(rangeParams.minPrice)
                       }))
                     } else {
                       setRangeParams((prev) => ({...prev, offsetRight: Number(rangeParams.maxPrice)}))
                     }
                     setFilter('maxPrice', rangeParams.maxPrice)
                   }} onChange={(e) => handleInputChange(e, 1)}/>
          </div>
        </div>
        <hr/>
      </div>
    );
  }
;

export default InputSlider;
