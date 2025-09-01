"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';

import './Masonry.css';

const useMedia = (queries, values, defaultValue) => {
  const get = () => {
    if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') {
      return defaultValue;
    }
    return values[queries.findIndex(q => window.matchMedia(q).matches)] ?? defaultValue;
  };

  const [value, setValue] = useState(get);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') return;
    const handler = () => setValue(get);
    queries.forEach(q => window.matchMedia(q).addEventListener('change', handler));
    return () => queries.forEach(q => window.matchMedia(q).removeEventListener('change', handler));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queries]);

  return value;
};

const useMeasure = () => {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  return [ref, size];
};

const preloadImages = async urls => {
  await Promise.all(
    urls.map(
      src =>
        new Promise(resolve => {
          const img = new Image();
          img.src = src;
          img.onload = img.onerror = () => resolve();
        })
    )
  );
};

const Masonry = ({
  items,
  ease = 'power3.out',
  duration = 0.6,
  stagger = 0.05,
  animateFrom = 'bottom',
  scaleOnHover = true,
  hoverScale = 0.95,
  blurToFocus = true,
  colorShiftOnHover = false
}) => {
  const columns = useMedia(
    ['(min-width:1500px)', '(min-width:1000px)', '(min-width:600px)', '(min-width:400px)'],
    [5, 4, 3, 2],
    1
  );

  const [containerRef, { width }] = useMeasure();
  const [imagesReady, setImagesReady] = useState(false);
  const [expandedImage, setExpandedImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const overlayImgRef = useRef(null);
  const overlayBgRef = useRef(null);

  const getInitialPosition = item => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return { x: item.x, y: item.y };

    let direction = animateFrom;

    if (animateFrom === 'random') {
      const directions = ['top', 'bottom', 'left', 'right'];
      direction = directions[Math.floor(Math.random() * directions.length)];
    }

    switch (direction) {
      case 'top':
        return { x: item.x, y: -200 };
      case 'bottom':
        return { x: item.x, y: window.innerHeight + 200 };
      case 'left':
        return { x: -200, y: item.y };
      case 'right':
        return { x: window.innerWidth + 200, y: item.y };
      case 'center':
        return {
          x: containerRect.width / 2 - item.w / 2,
          y: containerRect.height / 2 - item.h / 2
        };
      default:
        return { x: item.x, y: item.y + 100 };
    }
  };

  useEffect(() => {
    preloadImages(items.map(i => i.img)).then(() => setImagesReady(true));
  }, [items]);

  const grid = useMemo(() => {
    if (!width) return [];

    const colHeights = new Array(columns).fill(0);
    const columnWidth = width / columns;

    // Encuentra el índice del item principal (id: '8')
    const mainIndex = items.findIndex(item => item.main);
    let reorderedItems = [...items];
    if (mainIndex > -1) {
      // Mueve el principal al inicio para que ocupe el primer lugar
      const [mainItem] = reorderedItems.splice(mainIndex, 1);
      reorderedItems.unshift(mainItem);
    }

    return reorderedItems.map((child, idx) => {
      let col, x, y, w, h;
      if (child.main) {
        // El principal ocupa el triple de ancho y mucho más alto
        w = columnWidth * Math.min(3, columns); // máximo 3 columnas
        h = (child.height || 900) * 1.5; // mucho más alto
        // Busca la columna más baja para colocarlo
        col = colHeights.indexOf(Math.min(...colHeights));
        x = columnWidth * col;
        y = colHeights[col];
        // Ocupa varias columnas en altura
        for (let i = 0; i < Math.min(3, columns); i++) {
          colHeights[col + i] = (colHeights[col + i] || 0) + h;
        }
      } else {
        col = colHeights.indexOf(Math.min(...colHeights));
        x = columnWidth * col;
        h = (child.height || 400) * 1.1; // Agranda todas las fotos normales
        y = colHeights[col];
        colHeights[col] += h;
        w = columnWidth;
      }
      return { ...child, x, y, w, h };
    });
  }, [columns, items, width]);

  const hasMounted = useRef(false);

  useLayoutEffect(() => {
    if (!imagesReady) return;

    grid.forEach((item, index) => {
      const selector = `[data-key="${item.id}"]`;
      const animationProps = {
        x: item.x,
        y: item.y,
        width: item.w,
        height: item.h
      };

      if (!hasMounted.current) {
        const initialPos = getInitialPosition(item, index);
        const initialState = {
          opacity: 0,
          x: initialPos.x,
          y: initialPos.y,
          width: item.w,
          height: item.h,
          ...(blurToFocus && { filter: 'blur(10px)' })
        };

        gsap.fromTo(selector, initialState, {
          opacity: 1,
          ...animationProps,
          ...(blurToFocus && { filter: 'blur(0px)' }),
          duration: 0.8,
          ease: 'power3.out',
          delay: index * stagger
        });
      } else {
        gsap.to(selector, {
          ...animationProps,
          duration: duration,
          ease: ease,
          overwrite: 'auto'
        });
      }
    });

    hasMounted.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grid, imagesReady, stagger, animateFrom, blurToFocus, duration, ease]);

  const handleMouseEnter = (e, item) => {
    const element = e.currentTarget;
    const selector = `[data-key="${item.id}"]`;

    if (scaleOnHover) {
      gsap.to(selector, {
        scale: hoverScale,
        duration: 0.3,
        ease: 'power2.out'
      });
    }

    if (colorShiftOnHover) {
      const overlay = element.querySelector('.color-overlay');
      if (overlay) {
        gsap.to(overlay, {
          opacity: 0.3,
          duration: 0.3
        });
      }
    }
  };

  const handleMouseLeave = (e, item) => {
    const element = e.currentTarget;
    const selector = `[data-key="${item.id}"]`;

    if (scaleOnHover) {
      gsap.to(selector, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    }

    if (colorShiftOnHover) {
      const overlay = element.querySelector('.color-overlay');
      if (overlay) {
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.3
        });
      }
    }
  };

  // Overlay animation effect
  useEffect(() => {
    if (selectedImage && overlayImgRef.current && overlayBgRef.current) {
      gsap.fromTo(
        overlayBgRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
      gsap.fromTo(
        overlayImgRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: 'power3.out', delay: 0.1 }
      );
    }
  }, [selectedImage]);

  const handleImageClick = (item, e) => {
    e.stopPropagation();
    setSelectedImage(item);
  };

  const handleOverlayClose = () => {
    if (overlayImgRef.current && overlayBgRef.current) {
      gsap.to(overlayImgRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => setSelectedImage(null)
      });
      gsap.to(overlayBgRef.current, {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in'
      });
    } else {
      setSelectedImage(null);
    }
  };

  // Cerrar overlay con ESC
  useEffect(() => {
    if (!selectedImage) return;
    const onKeyDown = e => {
      if (e.key === 'Escape') handleOverlayClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedImage]);

  return (
    <>
      <div ref={containerRef} className="list">
        {grid.map(item => {
          return (
            <div
              key={item.id}
              data-key={item.id}
              className="item-wrapper"
              onClick={e => handleImageClick(item, e)}
              onMouseEnter={e => handleMouseEnter(e, item)}
              onMouseLeave={e => handleMouseLeave(e, item)}
              style={{ cursor: 'zoom-in' }}
            >
              <div className="item-img" style={{ backgroundImage: `url(${item.img})` }}>
                {colorShiftOnHover && (
                  <div
                    className="color-overlay"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(45deg, rgba(255,0,150,0.5), rgba(0,150,255,0.5))',
                      opacity: 0,
                      pointerEvents: 'none',
                      borderRadius: '8px'
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
      {selectedImage && (
        <div
          className="masonry-overlay-bg"
          ref={overlayBgRef}
          onClick={handleOverlayClose}
          style={{
            position: 'fixed',
            zIndex: 1000,
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(10,20,40,0.92)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s',
            cursor: 'zoom-out'
          }}
        >
          <div
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 48px 0 rgba(0,0,0,0.45)',
              borderRadius: '18px',
              overflow: 'hidden',
              background: 'rgba(20,30,60,0.98)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <img
              ref={overlayImgRef}
              src={selectedImage.img}
              alt={selectedImage.alt || ''}
              style={{
                maxWidth: '80vw',
                maxHeight: '80vh',
                width: 'auto',
                height: 'auto',
                borderRadius: '16px',
                boxShadow: selectedImage.main
                  ? '0 0 0 6px #00e0ff, 0 8px 48px 0 rgba(0,0,0,0.45)'
                  : '0 8px 48px 0 rgba(0,0,0,0.45)',
                border: selectedImage.main ? '3px solid #00e0ff' : 'none',
                background: '#111',
                objectFit: 'contain',
                transition: 'box-shadow 0.2s, border 0.2s'
              }}
            />
            <button
              onClick={handleOverlayClose}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: 'rgba(0,0,0,0.6)',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: 40,
                height: 40,
                fontSize: 24,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2,
                transition: 'background 0.2s'
              }}
              aria-label="Cerrar imagen"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Masonry;
