console.clear();

const express = require('express');
const finnhub = require('finnhub');
const config = require('config');

const app = express();

let finnhubClient;

app.get('/', (req, res) => {
  console.log('Sending request');
  finnhubClient.stockSymbols('US', (error, data, response) => {
    console.log('got response');
    console.log(response);
    if (error) {
      console.error(error);
    }
    console.log(data);
  });
  res.send('Hello');
});

app.listen(5000, () => {
  const api_key = finnhub.ApiClient.instance.authentications['api_key'];
  //   api_key.apiKey = config.get('api_key');
  api_key.apiKey = 'c7goei2ad3ibsjtt0sg0';
  finnhubClient = new finnhub.DefaultApi();
  console.log('Server has started');
});
