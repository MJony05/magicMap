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
let eventMap = 0;
let map;
navigator.geolocation.getCurrentPosition(function (e) {
  [lat1, long1] = [e.coords.latitude, e.coords.longitude];
  map = L.map('map').setView([lat1, long1], 20);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
  L.marker([lat1, long1]).addTo(map).bindPopup('Siz shotta').openPopup();
  map.on('click', function (e) {
    eventMap = e;
    form.classList.remove('hidden');
    inputDistance.focus();
    // let a = prompt('nima deb saqlaysiz');
  });
});

form.addEventListener('submit', function (e) {
  e.preventDefault();
  inputDistance.value =
    inputCadence.value =
    inputDuration.value =
    inputElevation.value =
      '';
  L.marker([eventMap.latlng.lat, eventMap.latlng.lng])
    .addTo(map)
    .bindPopup(
      L.popup({
        maxWidth: 2000,
        minWidth: 20,
        autoClose: false,
        closeOnClick: false,
        className: 'running-popup',
      }).setContent(`qayer`)
    )
    .openPopup();
});
inputType.addEventListener('change', function () {
  inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
});
