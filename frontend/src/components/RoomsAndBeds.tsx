import './Counter'
import Counter from "./Counter.tsx";

function RoomsAndBeds() {
  return(
    <div  style={{display: 'flex', flexDirection: "column", gap: '10px'}}>
      <p style={{fontWeight: "bold"}}>Rooms and Beds</p>
      <Counter label={"Bedrooms"}/>
      <Counter label={"Beds"}/>
      <Counter label={"Bathrooms"}/>
      <hr/>
    </div>
  )
}

export default RoomsAndBeds;