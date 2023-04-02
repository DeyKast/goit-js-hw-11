import { Notify } from 'notiflix/build/notiflix-notify-aio';
const axios = require('axios').default;

const API_KEY = '34954973-fc5c2eab35e9f140062a5ec5a';

const formInputEl = document.querySelector('.form-input');
const searchButtonEl = document.querySelector('.search-button');
const galleryMarkup = document.querySelector('.gallery');

const loadMoreButton = document.querySelector('.load-more');
loadMoreButton.classList.toggle('visually-hidden');

let photosMarkup = [];
let results = [];

async function searchPhotos(inputValue) {
  try {
    photosMarkup = [];
    const response = await axios.get(
      `https://pixabay.com/api/?key=${API_KEY}&q=${inputValue}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40`
    );

    if (response.data.total < 1) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      Notify.success(`Hooray! We found ${response.data.totalHits} images.`);

      results = response.data.hits;

      createMarkup(results);
    }

    galleryMarkup.innerHTML = photosMarkup;
  } catch (error) {
    console.error(error);
    console.log(inputValue);
  }
}

function createMarkup() {
  results.forEach(element => {
    const photoCard = `
        <div class="photo-card">
        <img src="${element.previewURL}" alt="" loading="lazy" />
        <div class="info">
        <p class="info-item">
        <b>Likes ${element.likes}</b>
        </p>
        <p class="info-item">
        <b>Views  ${element.views}</b>
        </p>
        <p class="info-item">
        <b>Comments  ${element.comments}</b>
        </p>
        <p class="info-item">
        <b>Downloads  ${element.downloads}</b>
        </p>
        </div>
        </div>`;
    photosMarkup += photoCard;
  });
}

loadMoreButton.addEventListener('click', event => {
  event.preventDefault();
});

searchButtonEl.addEventListener('click', event => {
  event.preventDefault();

  if (formInputEl.value == '') {
    Notify.failure('Put a request');
  } else {
    searchPhotos(formInputEl.value);
    loadMoreButton.classList.toggle('visually-hidden');
  }
});
