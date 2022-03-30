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
class Joy {
  id = (Date.now() + '').slice(-7);

  constructor(distance, duration, coords) {
    this.distance = distance;
    this.duration = duration;
    this.coords = coords;
  }
}

class Yugur extends Joy {
  constructor(distance, duration, coords, cadence) {
    super(distance, duration, coords);
    this.cadence = cadence;
  }
}
class Velik extends Joy {
  constructor(distance, duration, coords, elev) {
    super(distance, duration, coords);
    this.elev = elev;
  }
}

class App {
  constructor() {
    this.__getPosition();
    form.addEventListener('submit', this.__submitForm.bind(this));
    inputType.addEventListener('change', this.__toggleSelect);
  }

  // metod -- get current position coords
  __getPosition() {
    navigator.geolocation.getCurrentPosition(
      this.__showMap.bind(this), // bu __showmapni ichidagi __showFormniyam tanitadi yozmasak this.__showForm ishlamaydi
      function () {
        alert('failed I need your permission to use your geo');
      }
    );
  }
  // metod -- urnimizni coordsni mapga berish
  __showMap(e) {
    [lat1, long1] = [e.coords.latitude, e.coords.longitude];
    map = L.map('map').setView([lat1, long1], 20);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    L.marker([lat1, long1]).addTo(map).bindPopup('Siz shotta').openPopup();
    this.__showForm();
  }
  // metod -- creat form
  __showForm() {
    map.on('click', function (e) {
      eventMap = e;
      form.classList.remove('hidden');
      inputDistance.focus();
      // let a = prompt('nima deb saqlaysiz');
    });
  }
  // metod -- forma submit bolsa metka qoyish
  __submitForm(e) {
    e.preventDefault();

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
    this.__createObj();
    inputDistance.value =
      inputCadence.value =
      inputDuration.value =
      inputElevation.value =
        '';
  }

  // metod -- option ozgarganda formani ozgartirish

  __toggleSelect() {
    if (inputType.value == 'cycling') {
      document.querySelector('.form__label').style.color = 'red';
    }
    if (inputType.value == 'nimadir') {
      document.querySelector('.form__label').style.color = 'blue';
    }
    if (inputType.value == 'running') {
      document.querySelector('.form__label').style.color = 'green';
    }
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  }

  // forma malumotlarini Construktor orqali obyekt yaratish

  __createObj() {
    let ex = '';
    const checkNum = (...inputs) => {
      return inputs.every(val => Number.isFinite(val));
    };
    const musbat = (...inputs) => {
      return inputs.every(val => val > 0);
    };

    let distance = +inputDistance.value;
    let duration = +inputDuration.value;
    let type = inputType.value;
    if (type === 'running') {
      console.log('aa');
      let cadence = +inputCadence.value;
      if (
        !checkNum(distance, duration, cadence) &&
        !musbat(distance, duration, cadence)
      ) {
        return alert('Errorr!');
      }
      ex = new Yugur(
        distance,
        duration,
        [eventMap.latlng.lat, eventMap.latlng.lng],
        cadence
      );
      console.log(ex);
    }
    if (type == 'cycling') {
      let cadence = inputElevation.value;
    }
  }
}

function isIsogram(str) {
  let s = str.toLowerCase();
  for (let i = 0; i < s.length; i++) {
    for (let j = i + 1; j < s.length; j++) {
      if (s[i] == s[j]) {
        return false;
      }
    }
  }
  return true;
}

console.log(isIsogram('saloms'));

const magicMap = new App();
