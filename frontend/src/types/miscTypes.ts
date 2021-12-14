export interface TableField {
  key: string;
  label: string;
  sortable: boolean;
  formatter?: any;
}


export interface MapOptions {
  zoomControl: boolean;
  mapTypeControl: boolean;
  scaleControl: boolean;
  streetViewControl: boolean;
  rotateControl: boolean;
  fullscreenControl: boolean;
  disableDefaultUi: boolean;
  clickableIcons: boolean;
};

export interface Coordinates {
  x: number;
  y: number;
}