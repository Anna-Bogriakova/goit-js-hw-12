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

const PER_PAGE = 15;

let currentQuery = '';
let currentPage = 1;
let totalHits = 0;

const form = document.querySelector('#search-form');
const loadMoreBtn = document.querySelector('.load-more');

form.addEventListener('submit', async e => {
  e.preventDefault();
  const query = e.target.searchQuery.value.trim();

  if (!query) {
    iziToast.warning({
      title: 'Увага',
      message: 'Поле пошуку не може бути порожнім.',
      position: 'topRight',
    });
    return;
  }

  currentQuery = query;
  currentPage = 1;
  clearGallery();
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage, PER_PAGE);
    totalHits = data.totalHits;

    if (data.hits.length === 0) {
      iziToast.info({
        title: 'Info',
        message: 'На жаль, зображень не знайдено. Спробуйте інший запит.',
        position: 'topRight',
      });
      return;
    }

    createGallery(data.hits);
    if (totalHits <= PER_PAGE || data.hits.length < PER_PAGE) {
      iziToast.info({
        title: 'End',
        message: `Це всі результати за запитом (показано ${data.hits.length}).`,
        position: 'topRight',
      });
    } else {
      showLoadMoreButton();
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Щось пішло не так!',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
});

loadMoreBtn.addEventListener('click', async () => {
  currentPage += 1;
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage, PER_PAGE);
    createGallery(data.hits);
    scrollPage();

    const loadedImages = (currentPage - 1) * PER_PAGE + data.hits.length;

    if (data.hits.length < PER_PAGE || loadedImages >= totalHits) {
      iziToast.info({
        title: 'End',
        message: `Це всі результати за запитом.`,
        position: 'topRight',
      });
    } else {
      showLoadMoreButton();
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Щось пішло не так!',
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
