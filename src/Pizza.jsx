import { useState } from 'react';

const Pizza = (props) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    console.error(`Failed to load image for pizza: ${props.name}`, {
      providedSrc: props.image
    });
    setImageError(true);
  };

  return (
    <div className="pizza">
      <h1>{props.name}</h1>
      <p>{props.description}</p>
      <div className="pizza-image-container">
        <img
          src={props.image}
          alt={`${props.name} pizza`}
          onError={handleImageError}
          style={{ 
            opacity: imageError ? 0.5 : 1,
            maxWidth: '300px',
            borderRadius: '8px',
            border: '1px solid #ccc'
          }}
        />
        {imageError && (
          <p className="image-error">Image temporarily unavailable</p>
        )}
      </div>
    </div>
  );
};

export default Pizza;