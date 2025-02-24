/*eslint-disable*/

// import axios from 'axios';

// const stripe = Stripe(
//   pk_test_51QvyagD3lvfKFns7SJ3vvkkloeWPES8r7kwnRcx2L8LXEVsiko3ljxKZFVWjAh5Rjy4cZzdtyU5YUi8PIBEBoM2Q00vUz0QcdC
// );

// export const bookTour = async (tourId) => {
//   // 1) Get checkout session from API
//   const session = await axios(
//     `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
//   );
//   console.log(session);
//   // 2) Create checkout form + charge credit card
// };

import axios from 'axios';
import { showAlert } from './alert';

// Load Stripe
const stripe = Stripe(
  'pk_test_51QvyagD3lvfKFns7SJ3vvkkloeWPES8r7kwnRcx2L8LXEVsiko3ljxKZFVWjAh5Rjy4cZzdtyU5YUi8PIBEBoM2Q00vUz0QcdC'
);

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const session = await axios.get(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );

    // 2) Redirect to checkout
    await stripe.redirectToCheckout({ sessionId: session.data.session.id });
  } catch (err) {
    console.error('Error booking tour:', err);
    showAlert('error', err);
  }
};
