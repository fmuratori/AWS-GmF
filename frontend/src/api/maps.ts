import axios from "axios";

export default {
  async getLocationCoordinates(location: string) {
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
      params: { address: location, key: process.env.VUE_APP_MAPS_API_KEY },
    });
  },

  //   async getCoordinatesLocation(coordinates) {
  //     return axios.get(
  //       `https://maps.googleapis.com/maps/api/geocode/json`,
  //       { params: { address: location, key: process.env.VUE_APP_MAPS_API_KEY } }
  //     );
  //   },
};
