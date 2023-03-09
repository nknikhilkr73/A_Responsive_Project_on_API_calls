('use strict');

const burger = document.querySelector('.burger img');
const nav = document.querySelector('.nav_items');
const navLinks = document.querySelectorAll('.nav_items li');
const cityInputDetails = document.querySelector('.city_name');
const Search = document.querySelector('.submit');
const live = document.querySelector('.live');
const forecast = document.querySelectorAll('.forecast div');

////////////////////////////////////////////////////////
const weather = document.querySelector('.weather');
const container = document.querySelector('.container');
const liveAstronomy = document.querySelector('.astronomy');
navLinks[1].classList.add('activated');
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

let value = 0;

const renderCity = function (data) {
  const html = `<div class="live_weather">
  <div class="weather_icon"><img src="${data.current.condition.icon}" alt="Weather icon"> <h3> ${data.current.condition.text}</h3></div>
<div class="location">
<div class="weather_city"><h3>City</h3> <h2>:</h2> <h2>${data.location.name}</h2></div>
<div class="weather_state"><h3>State</h3> <h2>:</h2> <h2>${data.location.region}</h2></div>
<div class="weather_country"><h3>Country</h3> <h2>:</h2> <h2>${data.location.country}</h2></div>
</div>

<div class="weather_temp"><h1> ${data.current.temp_c}</h1> <h3><span class="degree">°</span> C</h3></div>

<div class="temp" >
<div class="weather_feels"><h2>Feels like <h2> <h1>${data.current.feelslike_c}</h1> <h3> <span class="degree">°</span> C</h3></div>

<div class="weather_windSpeed"><h2>Wind Speed</h2>  <h1>${data.current.wind_kph}</h1> <h3>km/hr</h3></div>
</div>
</div>
`;

  weather.insertAdjacentHTML('beforeend', html);
};

const astronomy = function (data) {
  let moonrise = data.forecast.forecastday[0].astro.moonrise;
  let moonset = data.forecast.forecastday[0].astro.moonset;
  let sunrise = data.forecast.forecastday[0].astro.sunrise;
  let sunset = data.forecast.forecastday[0].astro.sunset;
  let Mintemp = data.forecast.forecastday[0].day.mintemp_c;
  let Maxtemp = data.forecast.forecastday[0].day.maxtemp_c;
  const html = `  <div class="live_astronomy">
         <div ><h3>Sun rise</h3> <h2>--></h2> <h1>${sunrise}</h1></div>
         <div><h3>Sun set</h3> <h2>--></h2> <h1>${sunset}</h1></div>
         <div><h3>Moon rise</h3> <h2>--></h2> <h1>${moonrise}</h1></div>
         <div><h3>Moon set</h3> <h2>--></h2> <h1>${moonset}</h1></div>
         <div><h3>Min Temp </h3> <h2>--></h2> <h1>${Mintemp} ° C</h1></div>
         <div><h3>Max Temp </h3> <h2>--></h2> <h1>${Maxtemp} ° C</h1></div>
        </div>
      </div>
      `;

  liveAstronomy.insertAdjacentHTML('beforeend', html);
  let x = -1;
  for (let i = 0; i < 2; i++) {
    let dataValue = data;
    forecast[i].addEventListener('click', function () {
      if (x != i) {
        liveAstronomy.innerHTML = '';
        let moonrise = data.forecast.forecastday[i].astro.moonrise;
        let moonset = data.forecast.forecastday[i].astro.moonset;
        let sunrise = data.forecast.forecastday[i].astro.sunrise;
        let sunset = data.forecast.forecastday[i].astro.sunset;
        let Mintemp = data.forecast.forecastday[i].day.mintemp_c;
        let Maxtemp = data.forecast.forecastday[i].day.maxtemp_c;
        const html = `  <div class="live_astronomy">
             <div ><h3>Sun rise</h3> <h2>--></h2> <h1>${sunrise}</h1></div>
             <div><h3>Sun set</h3> <h2>--></h2> <h1>${sunset}</h1></div>
             <div><h3>Moon rise</h3> <h2>--></h2> <h1>${moonrise}</h1></div>
             <div><h3>Moon set</h3> <h2>--></h2> <h1>${moonset}</h1></div>
             <div><h3>Min Temp </h3> <h2>--></h2> <h1>${Mintemp} ° C</h1></div>
             <div><h3>Max Temp </h3> <h2>--></h2> <h1>${Maxtemp} ° C</h1></div>
            </div>
          </div>
          `;

        liveAstronomy.insertAdjacentHTML('beforeend', html);
        x = i;
      }
    });
  }
};

navigator.geolocation.getCurrentPosition(function (pos) {
  const latt = pos.coords.latitude;
  const lngg = pos.coords.longitude;
  const liveWeather = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '34e0a20976msh02a130f153af6d2p1078cbjsn0a7dbc8bdae7',
      'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com',
    },
  };

  if (
    live.addEventListener('click', function () {
      weather.innerHTML = '';
      liveAstronomy.innerHTML = '';
      fetch(
        `https://weatherapi-com.p.rapidapi.com/forecast.json?q=${latt},${lngg}&days=3`,
        liveWeather
      )
        .then(response => response.json())
        .then(function (data) {
          renderCity(data);
          astronomy(data);
        })
        .catch(err => alert('Please enter a valid place '));
    })
  ) {
  }

  if (
    Search.addEventListener('click', function () {
      if (cityInputDetails.value === '') {
        alert('Please Enter the Place name');
      } else {
        weather.innerHTML = '';
        liveAstronomy.innerHTML = '';
        value = cityInputDetails.value;
        cityInputDetails.value = '';
        fetch(
          `https://weatherapi-com.p.rapidapi.com/forecast.json?q=${value}&days=3`,
          liveWeather
        )
          .then(response => response.json())
          .then(function (data) {
            renderCity(data);
            astronomy(data);
          })
          .catch(err => alert('Please enter a valid place '));
      }
    })
  ) {
  } else {
    fetch(
      `https://weatherapi-com.p.rapidapi.com/forecast.json?q=${latt},${lngg}&days=3`,
      liveWeather
    )
      .then(response => response.json())
      .then(function (data) {
        renderCity(data);
        astronomy(data);
      })
      .catch(err => console.error(err));
  }

  /////////////////////////////////////////////////////////////
  //forcast
});
