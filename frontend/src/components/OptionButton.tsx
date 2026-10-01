import { useState } from "react";

interface OptionButtonProps {
  name: string;
  icon: string;
  onChange: (isSelected: boolean) => void;
}

const OptionButton: React.FC<OptionButtonProps> = ({ name, icon, onChange }) => {
  // State to track if the button is clicked
  const [isClicked, setIsClicked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle button click
  const handleClick = () => {
    setIsClicked((prev) => {
      const newState = !prev;
      onChange(newState);
      return newState;
    });
    
  };

  const handleMouseDown = () => {
    setIsAnimating(true);
  }

  const handleMouseUp = () => {
    // ensures full animation even if mouse is released prematurely
    setTimeout(() => {
      setIsAnimating(false);
    }, 100)
  }

  return (
    <button
      className={"optionButton"}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
      style={{
        display: "flex",
        alignItems: "center",
        width: "fit-content",
        backgroundColor: isClicked ? "rgba(150, 150, 150, .2)" : "white", // Change style based on state
        cursor: "pointer",
        padding: "8px 16px",
        border: isClicked? "1px solid black" : "1px solid grey",
        borderRadius: "15px",
        transition: "transform 0.1s ease-in-out", // Smooth transition for contraction
        transform: isAnimating ? "scale(0.96)" : "scale(1)", // Apply contraction on click
      }}
    >
      <img src = {icon}
        style={{
          width: "20px", // Set image width
          height: "20px", // Set image height
          marginRight: "10px", // Add space between image and text
        }}
       alt={name}/>
        {name}
    </button>
  );
};

export default OptionButton;
