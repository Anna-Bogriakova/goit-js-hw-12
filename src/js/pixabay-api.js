import axios from 'axios';

const API_KEY = '50807902-002d645a27b80276fb895a01b';
const BASE_URL = 'https://pixabay.com/api/';

export async function getImagesByQuery(query, page = 1, perPage = 15) {
  const params = {
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page,
    per_page: perPage,
  };

  const response = await axios.get(BASE_URL, { params });
  return response.data;
}
