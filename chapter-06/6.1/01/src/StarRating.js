// import React from "react";
// import { FaStar } from "react-icons/fa";

// export default function StarRating() {
//   return [
//     <FaStar color="red" />,
//     <FaStar color="red" />,
//     <FaStar color="red" />,
//     <FaStar color="grey" />,
//     <FaStar color="grey" />
//   ];
// }

import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

const Star = ({ selected = false, onSelect }) => {
  return <FaStar color={selected ? 'red' : 'grey'} onClick={onSelect} />;
};

export default function StarRating({ styles = {}, totalStars = 5, ...props }) {
  const [selectedStars, setSelectedStars] = useState(0);

  return (
    <div style={{ padding: '5px', ...styles }} {...props}>
      {[...Array(totalStars)].map((_, i) => (
        <Star
          key={i}
          selected={selectedStars > i}
          onSelect={() => setSelectedStars(i + 1)}
        />
      ))}
      <p>
        {selectedStars} of {totalStars} stars
      </p>
    </div>
  );
}
