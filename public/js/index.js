/* eslint-disable */
import { login } from './login';
// import 'core-js/stable';
// import 'regenerator-runtime/runtime';

document.querySelector('.form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password);
});
