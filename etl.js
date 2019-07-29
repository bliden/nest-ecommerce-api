require('dotenv').config();

const axios = require('axios');

let uri = `http://localhost:${process.env.PORT || 3000}/api/auth/login`;

(async () => {
  try {
    const {
      data: { token },
    } = await axios.post(uri, {
      username: 'seller',
      password: 'seller',
    });
    // const {
    //   data: { token },
    // } = await axios.post(
    //   `http://localhost:${process.env.PORT || 3000}/api/auth/register`,
    //   {
    //     username: 'seller',
    //     password: 'seller',
    //     seller: true,
    //   },
    // );

    const { data } = await axios.get(
      `http://localhost:${process.env.PORT || 3000}/api/auth/`,
      { headers: { authorization: `Bearer ${token}` } },
    );

    console.log(data);
  } catch (error) {
    console.error(error);
  }
})();
