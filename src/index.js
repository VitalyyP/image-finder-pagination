import FetchImages from './js/apiService';
import createCard from './templates/card.hbs';
import createPagination from './templates/pagination.hbs';
import * as basicLightbox from 'basiclightbox';

import '../node_modules/basiclightbox/dist/basicLightbox.min.css';
import './style.css';

const refForm = document.querySelector('#search-form');
const refGallery = document.querySelector('.gallery');
const refPagination = document.querySelector('.pagination');

const newImage = new FetchImages();

let currentSearchValue = '';
let currentNumberOfPage = 1;
let selectedRef = '';

refForm.addEventListener('submit', makeGallery);
refGallery.addEventListener('click', openImgInModal);
refPagination.addEventListener('click', showPageOfNumber);
refPagination.addEventListener('click', changeClassActive);

async function makeGallery(e) {
  e.preventDefault();
  newImage.page = 1;
  currentNumberOfPage = 1;
  getQueryFromInput(e);
  newImage.searchQuery = currentSearchValue;
  addImagestoGallery();
  await addPagination(e);
   selectedRef = document.querySelector('.number-of-page');
   selectedRef.classList.add('number-of-page__active');
}

async function showPageOfNumber(e) {
  e.preventDefault();

  getNumberOfPage(e);
  newImage.page = currentNumberOfPage;
  addImagestoGallery();

 await addPagination(e);
 
  // changeClassActive(e);
  // e.target.classList.add('number-of-page__active');
}

function getQueryFromInput(e) {
  currentSearchValue = e.currentTarget.elements.query.value;
}

function getNumberOfPage(e) {
  if (e.target.nodeName !== 'SPAN') {
    return;
  }
  // console.log(e.srcElement.outerText);
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

// function addPagination(e) {
//   newImage.fetchAllImages().then(data => {
//     let total = data.total;
//     let pages = Math.ceil(total / 12);
//     // console.log(total);
//     // console.log(pages);
//     let array = [];
//     for (let i = 0; i < pages && i < 7; i += 1) {
//       array.push(i + 1);
//     }

//     if (pages > 7) {
//       array[5] = '...';
//       array[6] = pages;
//       if (currentNumberOfPage > 4 && currentNumberOfPage < pages - 3) {
//         array[1] = '...';
//         array[2] = currentNumberOfPage - 1;
//         array[3] = currentNumberOfPage;
//         array[4] = currentNumberOfPage + 1;
//       }

//       if (currentNumberOfPage >= pages - 3) {
//         array[1] = '...';
//         array[2] = pages - 4;
//         array[3] = pages - 3;
//         array[4] = pages - 2;
//         array[5] = pages - 1;
//         // array[6] = pages;
//       }
//     }

//     refPagination.innerHTML = createPagination(array);
//     const refNumberOfPage = document.querySelector('.number-of-page');
//     refNumberOfPage.classList.add('number-of-page__active');
//   });
//   e.target.classList.add('number-of-page__active');
// }

async function addPagination(e) {
  const data = await newImage.fetchAllImages();
  let total = data.total;
  let pages = Math.ceil(total / 12);
  let array = [];
  for (let i = 0; i < pages && i < 7; i += 1) {
    array.push(i + 1);
  }

  if (pages > 7) {
    array[5] = '...';
    array[6] = pages;
    if (currentNumberOfPage > 4 && currentNumberOfPage < pages - 3) {
      array[1] = '...';
      array[2] = currentNumberOfPage - 1;
      array[3] = currentNumberOfPage;
      array[4] = currentNumberOfPage + 1;
    }

    if (currentNumberOfPage >= pages - 3) {
      array[1] = '...';
      array[2] = pages - 4;
      array[3] = pages - 3;
      array[4] = pages - 2;
      array[5] = pages - 1;
      // array[6] = pages;
    }
  }
  console.log('before innerHTML')
  refPagination.innerHTML = createPagination(array);
  console.log('after innerHTML');
  // selectedRef = refPagination.querySelector('.number-of-page');
  // selectedRef.classList.add('number-of-page__active');
  // console.log(e.target.outerText);
  // e.target.classList.add('number-of-page__active');
}

function changeClassActive(e) {
  if (selectedRef) {
    selectedRef.classList.remove('number-of-page__active');
    console.log('class removed');
  }
  selectedRef = e.target;
  e.target.classList.add('number-of-page__active');
  console.log('class added');
};
  

function openImgInModal(e) {
  if (e.target.nodeName !== 'IMG') {
    return;
  }
  const instance = basicLightbox.create(`
    <img src=${e.target.dataset.src} width="800" height="600">
`);
  instance.show();
}
