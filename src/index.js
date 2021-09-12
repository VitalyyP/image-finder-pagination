import FetchImages from './js/apiService';
import createCard from './templates/card.hbs';
import createPagination from './templates/pagination.hbs';
import * as basicLightbox from 'basiclightbox';

import '../node_modules/basiclightbox/dist/basicLightbox.min.css';
import './style.css';

const refForm = document.querySelector('#search-form');
const refGallery = document.querySelector('.gallery');
const refPagination = document.querySelector('.pagination');
// const refNumberOfPage = document.querySelector('.number-of-page');

const newImage = new FetchImages();

let currentSearchValue = '';
let currentNumberOfPage = 1;

refForm.addEventListener('submit', makeGallery);
refGallery.addEventListener('click', openImgInModal);
refPagination.addEventListener('click', showPageOfNumber);

function makeGallery(e) {
  e.preventDefault();
  newImage.page = 1;
  currentNumberOfPage = 1;
  getQueryFromInput(e);
  newImage.searchQuery = currentSearchValue;
  addImagestoGallery();
  addPagination();
}

function showPageOfNumber(e) {
  e.preventDefault();

  getNumberOfPage(e);
  newImage.page = currentNumberOfPage;
  addImagestoGallery();
  addPagination();
}

function getQueryFromInput(e) {
  currentSearchValue = e.currentTarget.elements.query.value;
}

function getNumberOfPage(e) {
  if (e.target.nodeName !== 'SPAN') {
    return;
  }
  console.log(e.srcElement.outerText);
  currentNumberOfPage = +e.srcElement.outerText;
}

function addImagestoGallery() {
  newImage.fetchImage().then(data => {
    refGallery.innerHTML = createCard(data.hits);
    // console.log(data.hits);
    // if (data.hits.length > 11) {
    //   refBtn.style.visibility = 'visible';
    // }
  });
}

function addPagination() {
  newImage.fetchAllImages().then(data => {
    let total = data.total;
    let pages = Math.ceil(total / 4);
    // console.log(total);
    // console.log(pages);
    let array = [];
    for (let i = 0; i < pages && i < 7; i += 1) {
      array.push(i + 1);
    }

    if (pages > 7) {
      array[5] = '...';
      array[6] = pages;
    }

    if (currentNumberOfPage > 4) {
      array[1] = '...';
      array[2] = currentNumberOfPage - 1;
      array[3] = currentNumberOfPage;
      array[4] = currentNumberOfPage + 1;
    }

    if (currentNumberOfPage > pages - 2) {
      
      // array[4] = pages - 2;
      array[5] = pages - 1;
      array[6] = pages;
    }

    refPagination.innerHTML = createPagination(array);
  });
}

function openImgInModal(e) {
  if (e.target.nodeName !== 'IMG') {
    return;
  }
  const instance = basicLightbox.create(`
    <img src=${e.target.dataset.src} width="800" height="600">
`);
  instance.show();
}
