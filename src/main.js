import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

let currentQuery = '';
let currentPage = 1;
let totalHits = 0;

const form = document.querySelector('#search-form');
const loadMoreBtn = document.querySelector('.load-more');

form.addEventListener('submit', async e => {
  e.preventDefault();
  const query = e.target.searchQuery.value.trim();

  if (!query) return;

  currentQuery = query;
  currentPage = 1;
  clearGallery();
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    totalHits = data.totalHits;

    if (data.hits.length === 0) {
      iziToast.info({
        title: 'Info',
        message: 'Sorry, no images found. Try again.',
        position: 'topRight',
      });
      return;
    }

    createGallery(data.hits);
    if (totalHits > 15) showLoadMoreButton();
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong!',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
});

loadMoreBtn.addEventListener('click', async () => {
  currentPage += 1;
  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    createGallery(data.hits);

    scrollPage();

    const loadedImages = (currentPage - 1) * 15 + data.hits.length;
    if (loadedImages >= totalHits) {
      hideLoadMoreButton();
      iziToast.info({
        title: 'End',
        message: `We're sorry, but you've reached the end of search results.`,
        position: 'topRight',
      });
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong!',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
});

function scrollPage() {
  const { height: cardHeight } = document
    .querySelector('.gallery a')
    .getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
