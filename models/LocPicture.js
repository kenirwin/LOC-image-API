const axios = require('axios');

module.exports = class LocPicture {
  constructor() {
    this.url = 'https://loc.gov/pictures/search/';
  }
  Search(query) {
    const url = this.url + '?q=' + query + '&fo=json';
    console.log('searching:', url);
    return axios.get(url);
  }
};
