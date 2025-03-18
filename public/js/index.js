/* eslint-disable */
// import 'core-js/stable';
// import 'regenerator-runtime/runtime';
import { login, logout } from './login';
import { displayMap } from './mapbox';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';
import { showAlert } from './alert';
// console.log('Hi from the bundle');

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');
// DELEGATION
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Values
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logOutBtn) {
  logOutBtn.addEventListener('click', logout);
}

if (userDataForm)
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    // console.log(form);
    // const name = document.getElementById('name').value;
    // const email = document.getElementById('email').value;
    // updateSettings({ name, email }, 'data');
    updateSettings(form, 'data');
  });

if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );
    document.querySelector('.btn--save-password').textContent = 'Save Password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });

if (bookBtn)
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });

const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) showAlert('success', alertMessage, 20);

// console.log('ssss');

// document.addEventListener('DOMContentLoaded', () => {
//   const overlay = document.getElementById('recruiter-overlay');
//   const closeBtn = document.querySelector('.overlay-close');

//   const getCookie = (name) => {
//     return document.cookie
//       .split('; ')
//       .find((row) => row.startsWith(name + '='))
//       ?.split('=')[1];
//   };

//   const setCookie = (name, value, days) => {
//     const expires = new Date();
//     expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
//     document.cookie = `${name}=${value}; path=/; expires=${expires.toUTCString()}`;
//   };

//   // Show overlay only if the cookie is not set
//   if (!getCookie('overlayShown')) {
//     setTimeout(() => {
//       overlay.style.display = 'flex'; // Use 'flex' to keep centering
//     }, 100); // Small delay to avoid flicker
//     setCookie('overlayShown', 'true', 1);
//   }

//   closeBtn.addEventListener('click', () => {
//     overlay.style.display = 'none';
//   });

//   overlay.addEventListener('click', (event) => {
//     if (event.target.id === 'recruiter-overlay') {
//       overlay.style.display = 'none';
//     }
//   });
// });

document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('recruiter-overlay');
  const closeBtn = document.querySelector('.overlay-close');
  const helpBtn = document.getElementById('help-btn');

  const getCookie = (name) => {
    return document.cookie
      .split('; ')
      .find((row) => row.startsWith(name + '='))
      ?.split('=')[1];
  };

  const setCookie = (name, value, days) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value}; path=/; expires=${expires.toUTCString()}`;
  };

  // Show overlay only once per day
  if (!getCookie('overlayShown')) {
    setTimeout(() => {
      overlay.style.display = 'flex';
    }, 100);
    setCookie('overlayShown', 'true', 1);
  }

  // Help button toggles the overlay
  helpBtn.addEventListener('click', (event) => {
    event.preventDefault();
    overlay.style.display = 'flex';
  });

  // Close button hides the overlay
  closeBtn.addEventListener('click', () => {
    overlay.style.display = 'none';
  });

  // Click outside the overlay content hides it
  overlay.addEventListener('click', (event) => {
    if (event.target.id === 'recruiter-overlay') {
      overlay.style.display = 'none';
    }
  });
});
