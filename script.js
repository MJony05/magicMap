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
    this.tezlik = (this.distance / this.duration / 60).toFixed(2);
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
    this.tezlik = (this.distance / this.duration / 60).toFixed(2);
    return this.tezlik;
  }
}

class App {
  #mashqlar = [];
  constructor() {
    this._getPosition();
    form.addEventListener('submit', this._createObject.bind(this));
    inputType.addEventListener('change', this._toggleSelect);
    containerWorkouts.addEventListener('click', this._moveCenter.bind(this));
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

    // let yul = L.Routing.control({
    //   waypoints: [L.latLng(latt, longg), L.latLng(latt + 0.01, longg + 0.01)],
    //   lineOptions: {
    //     styles: [{ color: 'green', opacity: 1, weight: 5 }],
    //   },
    // })
    //   .on('routesfound', function (e) {
    //     console.log(e.routes[0].summary.totalDistance);
    //     console.log(e);
    //   })
    //   .addTo(map);
    // console.log(e);

    let btn = document.querySelector('.leaflet-control');
    btn.addEventListener('click', function () {
      btn.classList.toggle('leaflet-routing-container-hide');
    });
    this._showForm();
    this._getLocalStg();
  }
  // formani ochish
  _showForm() {
    map.on('click', function (e) {
      mapEvent = e;
      form.classList.remove('hidden');
      inputDistance.focus();
    });
  }
  // forma toldirilgandan keyin uni ochirish
  _hideForm() {
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';
    form.classList.add('hidden');
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
          className: `${mashq.type}-popup`,
        })
          .setLatLng([mashq.coords[0], mashq.coords[1]])
          .setContent(mashq.malumot)
          .openOn(map)
      )
      .openPopup();
    this._hideForm();
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
        !checkNumber(distance, duration, cadance) ||
        !checkPositive(distance, duration, cadance)
      ) {
        return alert('Musbat sonlarni kiriting');
      }
      // if (distance == 0 || duration == 0 || cadance == 0) {
      //   return alert("Musbat sonlarni kiriting");
      // }
      mashq = new Piyoda(
        distance,
        duration,
        [mapEvent.latlng.lat, mapEvent.latlng.lng],
        cadance
      );
    }
    if (type === 'cycling') {
      let elevation = +inputElevation.value;
      if (
        !checkNumber(distance, duration, elevation) ||
        !checkPositive(distance, duration, elevation)
      ) {
        return alert('Musbat sonlarni kiriting');
      }
      // if (distance == 0 || duration == 0 || elevation == 0) {
      //   return alert("Musbat sonlarni kiriting");
      // }
      mashq = new Velic(
        distance,
        duration,
        [mapEvent.latlng.lat, mapEvent.latlng.lng],
        elevation
      );
    }
    // Mashq obyektini Marker yasash uchun berish
    this._submitMap(mashq);

    // Html ga formani chiqarish metodini chaqiramiz
    this._renderList(mashq);

    this.#mashqlar.push(mashq);

    this._setLocalStg();
  }

  // Royxatni shakllantirish
  _renderList(obj) {
    let html = `<li class="workout workout--${obj.type}" data-id="${obj.id}">
  <h2 class="workout__title">${obj.malumot}</h2>
  <div class="workout__details">
    <span class="workout__icon">${obj.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'}</span>
    <span class="workout__value">${obj.distance}</span>
    <span class="workout__unit">km</span>
  </div>
  <div class="workout__details">
    <span class="workout__icon">⏱</span>
    <span class="workout__value">${obj.duration}</span>
    <span class="workout__unit">min</span>
  </div>`;
    if (obj.type === 'running') {
      html += `<div class="workout__details">
    <span class="workout__icon">⚡️</span>
    <span class="workout__value">${obj.tezlik}</span>
    <span class="workout__unit">min/km</span>
  </div>
  <div class="workout__details">
    <span class="workout__icon">🦶🏼</span>
    <span class="workout__value">${obj.cadance}</span>
    <span class="workout__unit">spm</span>
  </div>
</li>`;
    }
    if (obj.type === 'cycling') {
      html += `<div class="workout__details">
    <span class="workout__icon">⚡️</span>
    <span class="workout__value">${obj.tezlik}</span>
    <span class="workout__unit">km/h</span>
  </div>
  <div class="workout__details">
    <span class="workout__icon">⛰</span>
    <span class="workout__value">${obj.elevation}</span>
    <span class="workout__unit">m</span>
  </div>
</li>`;
    }
    form.insertAdjacentHTML('afterend', html);
  }

  _setLocalStg() {
    localStorage.setItem('kalla', JSON.stringify(this.#mashqlar));
  }

  _getLocalStg() {
    let data = JSON.parse(localStorage.getItem('kalla'));

    if (!data) return;
    this.#mashqlar = data;
    this.#mashqlar.forEach(val => {
      this._submitMap(val);
      this._renderList(val);
    });
  }

  _moveCenter(e) {
    let el = e.target.closest('.workout');
    console.log(el);
    let objs = this.#mashqlar.find(val => {
      return el.getAttribute('data-id') == val.id;
    });
    let coordina = objs.coords;
    map.setView(coordina, 18, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
  }
}

const magicMap = new App();
