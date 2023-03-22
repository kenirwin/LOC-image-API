const LocPicture = require('./models/LocPicture');
const locPicture = new LocPicture();
const express = require('express');
const ejs = require('ejs');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.get('/', (req, res) => res.render('index'));

app.get('/search', async (req, res) => {
  let data = await locPicture.Search(req.query.q);
  res.json(data.data);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
