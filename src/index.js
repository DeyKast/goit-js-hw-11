import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Report } from 'notiflix/build/notiflix-report-aio';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const axios = require('axios').default;

const API_KEY = '34954973-fc5c2eab35e9f140062a5ec5a';

const formInputEl = document.querySelector('.form-input');
const searchButtonEl = document.querySelector('.search-button');
const galleryMarkup = document.querySelector('.gallery');

const loadMoreButton = document.querySelector('.load-more');
loadMoreButton.classList.add('visually-hidden');

let photosMarkup = [];
let results = [];
let i = 1;
let hits = 0;
let totalHits = 0;

Report.failure(
  'WARNING !',
  'Доброго дня !) Подивіться будь ласка я вам писав коментар до 9 Д/З та повідомлення у слаку на рахунок проблеми яка у мене виникла. А в даній домашці додаткове завдання не доробив бо не вистачило часу, пробував зробити функціонал SimpleLightBox, але він чомусь не коректно працює, буду радий якщо підкажете в чому проблема.',
  'Thanks'
);

async function searchPhotos(inputValue, i) {
  try {
    photosMarkup = [];
    const response = await axios.get(
      `https://pixabay.com/api/?key=${API_KEY}&q=${inputValue}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${i}`
    );

    if (response.data.total < 1) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadMoreButton.classList.add('visually-hidden');
    } else {
      if (i == 1) {
        Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
      }
      totalHits = response.data.totalHits;
      hits += response.data.hits.length;
      results = response.data.hits;
      loadMoreButton.classList.remove('visually-hidden');

      console.log(hits);

      console.log(response);

      createMarkup(results);
    }
    galleryMarkup.innerHTML += photosMarkup;
  } catch (error) {
    console.error(error);
  }
}

function createMarkup(results) {
  results.forEach(element => {
    const photoCard = `

<a class="gallery__item" href="${element.largeImageURL}">
<div class="photo-card">
  <img src="${element.previewURL}" alt="${element.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes ${element.likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${element.views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${element.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${element.downloads}</b>
    </p>
  </div>
</div>
</a>
    
`;
    photosMarkup += photoCard;
  });
}

loadMoreButton.addEventListener('click', event => {
  event.preventDefault();

  if (hits >= totalHits) {
    Notify.info(`We're sorry, but you've reached the end of search results.`);
    loadMoreButton.classList.add('visually-hidden');
    return;
  } else {
    i++;
    searchPhotos(formInputEl.value, i);
  }
});

searchButtonEl.addEventListener('click', event => {
  event.preventDefault();

  if (formInputEl.value.trim() == '') {
    Notify.failure('Put a request');
  } else {
    i = 1;
    hits = 0;
    galleryMarkup.innerHTML = '';
    searchPhotos(formInputEl.value.trim(), i);
  }
});

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  /* options */
});
