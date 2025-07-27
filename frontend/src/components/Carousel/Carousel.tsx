import React, { useState, useEffect } from 'react';
import styles from './Carousel.module.css';

interface CarouselProps {
  images: string[];
  altTexts: string[];
}

const Carousel: React.FC<CarouselProps> = ({ images, altTexts }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    console.log('Current Index:', currentIndex);
  }, [currentIndex]);

  const goToNext = () => {
    const newIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(newIndex);
    console.log('Go to Next - New Index:', newIndex);
  };

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    console.log('Go to Previous - New Index:', newIndex);
  };

  return (
    <div className={styles.carouselContainer}>
      <button onClick={goToPrevious} className={`${styles.carouselButton} ${styles.carouselButtonLeft}`}>&lt;</button>
      <img
        src={images[currentIndex]}
        alt={altTexts[currentIndex]}
        className={styles.carouselImage}
      />
      <button onClick={goToNext} className={`${styles.carouselButton} ${styles.carouselButtonRight}`}>&gt;</button>
      <div className={styles.dotsContainer}>
        {images.map((_, index) => (
          <span
            key={index}
            className={`${styles.dot} ${currentIndex === index ? styles.activeDot : ''}`}
            onClick={() => {
              setCurrentIndex(index);
              console.log('Dot Clicked - New Index:', index);
            }}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
