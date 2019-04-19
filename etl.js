require('dotenv').config();

const axios = require('axios');

let uri = `http://localhost:${process.env.PORT || 3000}/auth/login`;

(async () => {
  const { data } = await axios.post(uri, {
    username: 'username',
    password: 'password',
  });

  console.log(data);
})();
