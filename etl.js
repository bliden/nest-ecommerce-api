require('dotenv').config();

const axios = require('axios');

let uri = `http://localhost:${process.env.PORT || 3000}/auth/login`;

(async () => {
  const {
    data: { token },
  } = await axios.post(uri, {
    username: 'username',
    password: 'password',
  });

  const { data } = await axios.get(
    `http://localhost:${process.env.PORT || 3000}/auth`,
    { headers: { authorization: `Bearer ${token}` } },
  );

  console.log(data);
})();
