import { useState } from 'react';

interface Props {
  defaultValue: any;
  onChange: any;
}

const StarRating = ({ defaultValue, onChange }: Props) => {
  const [rating, setRating] = useState(defaultValue || 1);

  const handleClick = (value: any) => {
    setRating(value);
    onChange && onChange(value);
  };

  return (
    <div>
      {[1, 2, 3, 4, 5]?.map((value) => (
        <span
          key={value}
          className={value <= rating ? 'star-filled' : 'star'}
          onClick={() => handleClick(value)}
        >
          &#9733;
        </span>
      ))}
    </div>
  );
};

export default StarRating;
