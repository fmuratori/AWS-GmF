const MIN_DIST_KM = 0.01;

function toRad(Value) {
  return (Value * Math.PI) / 180;
}

function calcCrow(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const lat1Rad = toRad(lat1);
  const lat2Rad = toRad(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) *
      Math.sin(dLon / 2) *
      Math.cos(lat1Rad) *
      Math.cos(lat2Rad);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
}

export default {
  areCoordinatesNear(
    c1Lat: number,
    c1Lng: number,
    c2Lat: number,
    c2Lng: number
  ) {
    return calcCrow(c1Lat, c1Lng, c2Lat, c2Lng) < MIN_DIST_KM;
  },
};
