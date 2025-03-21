// ProductMediaSlider.js
import React, { useState } from 'react';
import './ProductMediaSlider.css';

const ProductMediaSlider = ({ mediaItems }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % mediaItems.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      (prevIndex - 1 + mediaItems.length) % mediaItems.length
    );
  };

  const currentMedia = mediaItems[currentIndex];

  return (
    <div className="media-slider-container">
      <div className="media-background">
        {currentMedia.match(/\.(jpeg|jpg|gif|png)$/) ? (
          <img
            src={`http://localhost:5000/${currentMedia}`}
            alt="Product media"
            className="media-image"
          />
        ) : currentMedia.match(/\.(mp4|webm|ogg)$/) ? (
          <video controls className="media-video">
            <source src={`http://localhost:5000/${currentMedia}`} type="video/mp4" />
          </video>
        ) : null}
      </div>
      <div className="slider-controls">
        <button onClick={handlePrev} className="prev-button">
          &#10094;
        </button>
        <button onClick={handleNext} className="next-button">
          &#10095;
        </button>
      </div>
    </div>
  );
};

export default ProductMediaSlider;
