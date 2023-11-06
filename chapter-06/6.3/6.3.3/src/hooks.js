import { useState } from 'react';

// export const useInput = initialValue => {
//   const [value, setValue] = useState(initialValue);
//   return [
//     { value, onChange: e => setValue(e.target.value) },
//     () => setValue(initialValue)
//   ];
// };

// initialValueを受け取って[props, initailizer]を返す
export const userInput = (initialValue) => {
  const [value, setValue] = useState(initialValue);
  return [
    { value, onChange: (e) => setValue(e.target.value) },
    () => setValue(initialValue),
  ];
};
