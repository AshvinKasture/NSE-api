console.clear();

const express = require('express');
const { check, validationResult } = require('express-validator');
const config = require('config');
const request = require('request');

const app = express();

let data;

app.use(express.json({ extended: false }));

const getData = () => {
  try {
    const options = {
      uri: `https://finnhub.io/api/v1/stock/symbol?exchange=NS&token=${config.get(
        'api_key'
      )}`,
      method: 'GET',
    };
    request(options, (error, response, body) => {
      if (error) {
        console.error(error);
      } else {
        data = JSON.parse(body);
        console.log('Data initialised');
      }
    });
  } catch (error) {
    console.error(error.message);
  }
};

app.get('/', (req, res) => {
  res.send('Welcome to NSE api by Ashvin Kasture');
});

app.get(
  '/query/',
  [check('term', 'Term is required').not().isEmpty()],
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(401).json({ errors: errors.array() });
      }
      let symbols = [];
      const term = req.body.term;
      const limit = req.body.limit || 10;
      data.forEach((item) => {
        if (
          item.displaySymbol.toLowerCase().startsWith(term) ||
          item.description.toLowerCase().startsWith(term)
        ) {
          symbols.push(item.displaySymbol);
        }
      });
      return res.json(symbols.slice(0, limit));
    } catch (error) {
      console.error(error.message);
      return res.status(500).send('Internal Server Error');
    }
  }
);

const PORT = process.env.port || 5000;

app.listen(PORT, () => {
  console.log('Server has started');
  getData();
});
