declare module 'react-image-gallery' {
    import * as React from 'react';
  
    interface ImageGalleryProps {
      items: Array<{
        original: string;
        thumbnail: string;
        originalClass?: string;
        thumbnailClass?: string;
        renderItem?: (item: any) => React.ReactNode;
        renderThumbInner?: (item: any) => React.ReactNode;
        onImageError?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;
        description?: string;
        originalAlt?: string;
        thumbnailAlt?: string;
      }>;
      showNav?: boolean;
      autoPlay?: boolean;
      lazyLoad?: boolean;
      infinite?: boolean;
      showIndex?: boolean;
      showBullets?: boolean;
      showThumbnails?: boolean;
      showPlayButton?: boolean;
      showFullscreenButton?: boolean;
      slideDuration?: number;
      slideInterval?: number;
      slideOnThumbnailOver?: boolean;
      additionalClass?: string;
      useWindowKeyDown?: boolean;
      defaultImage?: string;
      disableArrowKeys?: boolean;
      disableThumbnailScroll?: boolean;
      onErrorImageURL?: string;
      onThumbnailClick?: (event: React.MouseEvent, index: number) => void;
      onSlide?: (currentIndex: number) => void;
      onScreenChange?: (fullScreenElement: HTMLElement | null) => void;
      onPause?: (currentIndex: number) => void;
      onPlay?: (currentIndex: number) => void;
      renderCustomControls?: () => React.ReactNode;
      renderLeftNav?: (onClick: (event: React.MouseEvent | React.KeyboardEvent) => void, disabled: boolean) => React.ReactNode;
      renderRightNav?: (onClick: (event: React.MouseEvent | React.KeyboardEvent) => void, disabled: boolean) => React.ReactNode;
      renderPlayPauseButton?: (onClick: (event: React.MouseEvent | React.KeyboardEvent, isPlaying: boolean) => void, isPlaying: boolean) => React.ReactNode;
      renderFullscreenButton?: (onClick: (event: React.MouseEvent | React.KeyboardEvent, isFullscreen: boolean) => void, isFullscreen: boolean) => React.ReactNode;
      onClick?: (event: React.MouseEvent) => void;
    }
  
    export default class ImageGallery extends React.Component<ImageGalleryProps, any> {}
  }
  