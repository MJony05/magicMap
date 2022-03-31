'use strict';

// prettier-ignore
// const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
let latt, longg;
let mapEvent = '';
let map;

// Ota class
class Joy {
  date = new Date();
  id = (Date.now() + '').slice(-7);
  constructor(distance, duration, coords) {
    this.distance = distance;
    this.duration = duration;
    this.coords = coords;
  }
  _setTavsif() {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    this.malumot = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }
}
// Vorislar
class Piyoda extends Joy {
  type = 'running';
  constructor(distance, duration, coords, cadance) {
    super(distance, duration, coords);
    this.cadance = cadance;
    this.calcTime();
    this._setTavsif();
  }
  calcTime() {
    this.tezlik = this.distance / this.duration / 60;
    return this.tezlik;
  }
}
class Velic extends Joy {
  type = 'cycling';
  constructor(distance, duration, coords, elevation) {
    super(distance, duration, coords);
    this.elevation = elevation;
    this.calcSpeed();
    this._setTavsif();
  }
  calcSpeed() {
    this.tezlik = this.distance / this.duration / 60;
    return this.tezlik;
  }
}

class App {
  constructor() {
    this._getPosition();
    form.addEventListener('submit', this._createObject.bind(this));
    inputType.addEventListener('change', this._toggleSelect);
  }
  // Hozirgi ornimiz koordinatalarinin olish
  _getPosition() {
    navigator.geolocation.getCurrentPosition(
      this._showMap.bind(this),
      function () {
        alert('Sizni turgan orningizni aniqlay olmadim');
      }
    );
  }

  //  ornimiz olgan koordinatalarinin mapga berish
  _showMap(e) {
    [latt, longg] = [e.coords.latitude, e.coords.longitude];
    // console.log(
    //   `https://www.google.com/maps/dir///@${e.coords.latitude},${e.coords.longitude}z`
    // );
    map = L.map('map', {
      boxZoom: false,
      zoomControl: false,
    }).setView([latt, longg], 18);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    this._showForm();
  }
  // formani ochish
  _showForm() {
    map.on('click', function (e) {
      mapEvent = e;
      form.classList.remove('hidden');
      inputDistance.focus();
    });
  }
  // marker chiqarish
  _submitMap(mashq) {
    L.marker([mashq.coords[0], mashq.coords[1]], {
      draggable: true,
    })
      .addTo(map)
      .bindPopup(
        L.popup({
          maxWidth: 300,
          minWidth: 100,
          autoClose: true,
          closeOnClick: false,
          className: 'running-popup',
        })
          .setLatLng([mashq.coords[0], mashq.coords[1]])
          .setContent('Working')
          .openOn(map)
      )
      .openPopup();

    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';
  }
  _toggleSelect() {
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  }
  //form malumotlarinni konstructor orqali obekt yaratish
  _createObject(e) {
    e.preventDefault();
    let mashq = '';
    const checkNumber = (...inputs) => {
      return inputs.every(val => Number.isFinite(val));
    };
    const checkPositive = (...inputs) => {
      return inputs.every(val => val > 0);
    };
    let distance = +inputDistance.value;
    let duration = +inputDuration.value;
    let type = inputType.value;
    if (type === 'running') {
      let cadance = +inputCadence.value;
      if (
        !checkNumber(distance, duration, cadance) &&
        !checkPositive(distance, duration, cadance)
      ) {
        return alert('Musbat sonlarni kiriting');
      }
      if (distance == 0 || duration == 0 || cadance == 0) {
        return alert('Musbat sonlarni kiriting');
      }
      mashq = new Piyoda(
        distance,
        duration,
        [mapEvent.latlng.lat, mapEvent.latlng.lng],
        cadance
      );

      console.log(mashq);
    }
    if (type === 'cycling') {
      let elevation = inputElevation.value;
      let cadance = +inputCadence.value;
      if (
        !checkNumber(distance, duration, elevation) &&
        !checkPositive(distance, duration)
      ) {
        return alert('Musbat sonlarni kiriting');
      }
      if (distance == 0 || duration == 0 || cadance == 0) {
        return alert('Musbat sonlarni kiriting');
      }
      mashq = new Velic(
        distance,
        duration,
        [mapEvent.latlng.lat, mapEvent.latlng.lng],
        elevation
      );

      console.log(mashq);
    }
    // Mashq obyektini Marker yasash uchun berish
    this._submitMap(mashq);
  }

  // Royxatni shakllantirish
  _renderList(obj) {
    let html = `<li class="workout workout--running" data-id="1234567890">
  <h2 class="workout__title">Running on April 14</h2>
  <div class="workout__details">
    <span class="workout__icon">🏃‍♂️</span>
    <span class="workout__value">5.2</span>
    <span class="workout__unit">km</span>
  </div>
  <div class="workout__details">
    <span class="workout__icon">⏱</span>
    <span class="workout__value">24</span>
    <span class="workout__unit">min</span>
  </div>`;
  }
}

const a = new App();
