
const axios = require('axios');

const cookie =
  'express:sess=eyJqd3QiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKcFpDSTZJalZtWVRGaFpqaGpZMlEzTVdZMU1EQXlNelZsTmpVNE5DSXNJbVZ0WVdsc0lqb2lZMjlqWVdOdlFHTnZZMkZqYnk1amIyMGlMQ0pwWVhRaU9qRTJNRFEwTXpFM05UWjkuVTd4LTlIWnlnaVIxNUZVYVhVNDV0Umo1bU91Z0diN2w5UkVybXhQQUZnZyJ9';

const doRequest = async () => {
  const {data} = await axios.post(
    `http://ticket-cocaco.com/api/tickets`,
    { title: 'ticket', price: 5 },
    {
      headers: { cookie },
    }
  );

  await axios.put(
    `http://ticket-cocaco.com/api/tickets/${data.id}`,
    { title: 'ticket', price: 10 },
    {
      headers: { cookie },
    }
  );

  await axios.put(
    `http://ticket-cocaco.com/api/tickets/${data.id}`,
    { title: 'ticket', price: 15 },
    {
      headers: { cookie },
    }
  );

  console.log('Request complete');
};

(async () => {
  for (let i = 0; i < 400; i++) {
    await doRequest();
  }
})();
