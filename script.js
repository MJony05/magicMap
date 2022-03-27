'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
let lat1, long1;
navigator.geolocation.getCurrentPosition(function (e) {
  [lat1, long1] = [e.coords.latitude, e.coords.longitude];
  var map = L.map('map').setView([lat1, long1], 20);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // L.marker([51.5, -0.09])
  //   .addTo(map)
  //   .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
  //   .openPopup();
});

setTimeout(function () {
  console.log(`Lat ${lat1}  long ${long1}`);
  console.log(`https://www.google.com/maps/@${lat1},${long1}z`);
}, 3000);
