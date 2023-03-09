'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
const inputData = document.querySelector('.inputt');
const live = document.querySelector('.live_button');
const details = document.querySelector('.country_details');
const span = document.querySelector('.cross');
const buttons = document.querySelector('.buttons');
const mapp = document.querySelector('#map');
const locationDetails = document.querySelector('.location_details');
const CountryDetails = document.querySelector('.details');
const burger = document.querySelector('.burger img');
const nav = document.querySelector('.nav_items');
const navLinks = document.querySelectorAll('.nav_items li');
const closing = document.querySelector('.closing_button');
////////////////////////////////////////////////////////

navLinks[0].classList.add('activated');
let prv = 0;
for (let i = 0; i < 3; i++) {
  navLinks[i].addEventListener('click', function () {
    if (prv != i) {
      navLinks[prv].classList.remove('activated');
      navLinks[i].classList.add('activated');
      prv = i;
    }
  });
}

let count = 0;
burger.addEventListener('click', function () {
  nav.classList.toggle('nav_active');
  navLinks.forEach((links, index) => {
    if (links.style.animation) {
      links.style.animation = '';
    } else {
      links.style.animation = `navLinkFade 0.5s ease forwards ${
        index / 7 + 0.5
      }s`;
    }
  });
  burger.classList.toggle('rotate');
  if (count === 0) {
    burger.setAttribute('src', 'icon-close.svg');
    count = 1;
  } else {
    burger.setAttribute('src', 'icon-hamburger.svg');
    count = 0;
  }
});

////////////////////////////////////////////////////
const renderCountry = function (data, className = '') {
  let language;
  if (Object.values(data.languages).length > 3) {
    language = Object.values(data.languages).slice(0, 2);
  } else {
    language = Object.values(data.languages);
  }
  let population;
  if (data.population < 1000000) {
    population = data.population;
  } else {
    population = `${(data.population / 1000000).toFixed(2)} mil`;
  }
  const html = `<article class="country ${className}">
<img class="country__img" src="${Object.values(data.flags)[0]}" />
<div class="country__data">
  <h3 class="country__name">${Object.values(data.name)[0]}</h3>
  <h4 class="country__region">${data.region}</h4>
  <p class="country__row"><span>👫</span>${population} people</p>
  <p class="country__row"><span>🗣️</span>${language}</p>
  <p class="country__row"><span>💰</span>${Object.keys(data.currencies)[0]}</p>
</div>

</article>`;

  countriesContainer.insertAdjacentHTML('beforeend', html);
};

const renderError = function (msg) {
  alert(msg);
};

const request = fetch(`https://restcountries.com/v3.1/name/india`);

const getJSON = function (url, errorMsg = 'Something went wrong') {
  return fetch(url).then(response => {
    if (!response.ok) {
      throw new Error(`${errorMsg} (${response.status})`);
    }
    return response.json();
  });
};

const getCountryData = function (country) {
  //country1
  getJSON(`https://restcountries.com/v3.1/name/${country}`, 'Country not found')
    .then(function (data) {
      renderCountry(data[0]);

      //country 2

      if (!data[0].borders) {
        throw new Error('No neighbour found');
      }
      const neighbour = data[0].borders[0];
      return getJSON(
        `https://restcountries.com/v3.1/alpha/${neighbour}`,
        'Country not found'
      );
    })
    .then(function (data) {
      renderCountry(data[0], 'neighbour');
    })
    .catch(err =>
      renderError(`Something went Wrong -->${err.message}. Try again! `)
    )
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};
btn.addEventListener('click', function () {
  countriesContainer.innerHTML = '';
  setTimeout(function () {
    closing.classList.remove('hide');
  }, 1000);

  CountryDetails.classList.add('hide');
  getCountryData(inputData.value);
  inputData.value = '';
});

const renderDetails = function (data) {
  const location_Details = `<div class="locationn">
  <p class="lction"><span class="new_span">Country : </span>${data.localityInfo.administrative[0].name}</p>
<p class="lction"><span class="new_span">State : </span>${data.localityInfo.administrative[1].name}</p>
<p class="lction"><span class="new_span">City : </span>${data.city}</p>
<p class="lction"><span class="new_span">District : </span>${data.localityInfo.administrative[2].name}</p>
</div>`;

  locationDetails.insertAdjacentHTML('beforeend', location_Details);
};

let map;
let f = 0;
live.addEventListener('click', function () {
  f = 1;
  setTimeout(function () {
    span.classList.add('zoom');
  }, 2000);
  buttons.classList.add('hide');
  span.classList.remove('hide');
  mapp.classList.remove('hide');
  locationDetails.classList.remove('hide');
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (pos) {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      // ////////////////////////////////////
      // ///////////////////////////////////////////
      map = L.map('map').setView([lat, lng], 17);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      L.marker([lat, lng]).addTo(map).bindPopup('You are here').openPopup();

      //////////////////////////////////////////////////
      ////////////////////////////////////////

      const getData = function (lat, lng) {
        fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
        )
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            renderDetails(data);
          });
      };
      getData(lat, lng);
    });
  } else {
    alert('Cannot get Your Location');
  }
});

details.addEventListener('click', function () {
  buttons.classList.add('hide');

  CountryDetails.classList.remove('hide');
  countriesContainer.classList.remove('hide');
  countriesContainer.classList.add('flex');
  setTimeout(function () {
    span.classList.add('zoom');
  }, 2000);
});
span.addEventListener('click', function () {
  buttons.classList.remove('hide');
  span.classList.add('hide');
  if (f === 1) {
    mapp.innerHTML = '';
    mapp.classList.add('hide');
    locationDetails.classList.add('hide');
    locationDetails.innerHTML = '';
    map.remove();
    f = 0;
  }
  CountryDetails.classList.add('hide');
  span.classList.remove('zoom');
});
closing.addEventListener('click', function () {
  buttons.classList.remove('hide');

  closing.classList.add('hide');
  CountryDetails.classList.add('hide');
  countriesContainer.innerHTML = '';
  countriesContainer.classList.add('hide');
  countriesContainer.classList.remove('flex');
});
//////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
//////////////////////////////////////////////////

//Weather
