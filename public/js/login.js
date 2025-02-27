/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';
export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      // url: 'http://127.0.0.1:3000/api/v1/users/login',
      data: {
        email,
        password,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

// Instructor logout
// export const logout = async () => {
//   try {
//     const res = await axios({
//       method: 'GET',
//       url: 'http://127.0.0.1:3000/api/v1/users/logout',
//     });
//     if (res.data.status === 'success') {
//       console.log(res.data);
//       location.reload(true);
//     }
//   } catch (err) {
//     showAlert('error', 'Error logging out, try again');
//     console.log(err);
//   }
// };

export const logout = async () => {
  try {
    const res = await axios.get('/api/v1/users/logout', {
      withCredentials: true, // Ensure cookies are sent
    });
    if (res.data.status === 'success') {
      window.location.assign('/'); // Redirect instead of reload
    }
  } catch (err) {
    showAlert('error', 'Error logging out, try again');
    console.log(err);
  }
};
