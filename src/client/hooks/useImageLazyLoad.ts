import { useState, useEffect, useRef } from 'react';
import { getCachedPokemonImage, preloadPokemonImage, DEFAULT_LOADING_IMAGE, DEFAULT_ERROR_IMAGE } from '../utils/imageCache';

interface UseImageLazyLoadOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number;
}

export const useImageLazyLoad = (pokedexId: number, options: UseImageLazyLoadOptions = {}) => {
  const [src, setSrc] = useState<string>(DEFAULT_LOADING_IMAGE);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 图片进入视口，开始加载
            setIsLoading(true);
            setIsError(false);
            
            preloadPokemonImage(pokedexId)
              .then(() => {
                setSrc(getCachedPokemonImage(pokedexId));
                setIsLoading(false);
              })
              .catch(() => {
                setSrc(DEFAULT_ERROR_IMAGE);
                setIsError(true);
                setIsLoading(false);
              });
            
            // 停止观察
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: options.root || null,
        rootMargin: options.rootMargin || '200px', // 提前200px开始加载
        threshold: options.threshold || 0.1,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [pokedexId, options]);

  return {
    src,
    isLoading,
    isError,
    imgRef,
  };
};

// 批量预加载图片的hook
export const usePreloadImages = (pokedexIds: number[]) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (pokedexIds.length > 0) {
      setLoading(true);
      
      import('../utils/imageCache')
        .then(({ preloadPokemonImages }) => {
          return preloadPokemonImages(pokedexIds);
        })
        .then(() => {
          setLoaded(true);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
      setLoaded(false);
    }
  }, [pokedexIds]);

  return { loading, loaded };
};
