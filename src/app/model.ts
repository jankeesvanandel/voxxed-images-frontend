export interface Speaker {
  id: string;
  name: string;
}

export interface Album {
  name: string;
  images: Image[];
}

export interface Image {
  id: string;
  match: number;
  validation?: boolean;
  image?: FlickrPhotoSize;
  albumName: string;
}

export interface FlickrPhotoSize {
  width: number;
  height: number;
  source: string;
}

export interface FlickrPhotosGetSizes {
  sizes: {
    size: FlickrPhotoSize[];
  };
}
