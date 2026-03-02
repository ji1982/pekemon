// 图片缓存工具，减少重复的网络请求并实现图片懒加载
const imageCache: Map<number, string> = new Map();
const loadingImages: Set<number> = new Set();
const errorImages: Set<number> = new Set();

// 默认图片（加载中）
export const DEFAULT_LOADING_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNDAiIGZpbGw9IiMzMzMiLz48dGV4dCB4PSI1MCIgeT0iNTUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0id2hpdGUiPkxvYWRpbmc8L3RleHQ+PC9zdmc+';

// 错误图片
export const DEFAULT_ERROR_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNDAiIGZpbGw9IiMzMzMiLz48dGV4dCB4PSI1MCIgeT0iNTUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0id2hpdGUiPkVycjwvdGV4dD48L3N2Zz4=';

// 获取宝可梦图片URL
export const getPokemonImageUrl = (pokedexId: number): string => {
  return `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${pokedexId.toString().padStart(3, '0')}.png`;
};

// 获取缓存的图片URL
export const getCachedPokemonImage = (pokedexId: number): string => {
  const key = pokedexId;
  if (!imageCache.has(key)) {
    const imageUrl = getPokemonImageUrl(pokedexId);
    imageCache.set(key, imageUrl);
  }
  return imageCache.get(key)!;
};

// 预加载图片
export const preloadPokemonImage = (pokedexId: number): Promise<void> => {
  if (loadingImages.has(pokedexId) || errorImages.has(pokedexId)) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    loadingImages.add(pokedexId);
    const img = new Image();
    img.src = getCachedPokemonImage(pokedexId);
    
    img.onload = () => {
      loadingImages.delete(pokedexId);
      resolve();
    };
    
    img.onerror = () => {
      loadingImages.delete(pokedexId);
      errorImages.add(pokedexId);
      resolve(); // 即使加载失败也resolve，避免阻塞
    };
  });
};

// 批量预加载图片
export const preloadPokemonImages = (pokedexIds: number[]): Promise<void[]> => {
  return Promise.all(pokedexIds.map(id => preloadPokemonImage(id)));
};

// 检查图片是否已加载
export const isImageLoaded = (pokedexId: number): boolean => {
  return !loadingImages.has(pokedexId) && !errorImages.has(pokedexId);
};

// 清除缓存
export const clearImageCache = (): void => {
  imageCache.clear();
  loadingImages.clear();
  errorImages.clear();
};

// 清除特定图片的缓存
export const clearImageCacheById = (pokedexId: number): void => {
  imageCache.delete(pokedexId);
  loadingImages.delete(pokedexId);
  errorImages.delete(pokedexId);
};