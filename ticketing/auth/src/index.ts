import express from 'express';
import {json} from 'body-parser';

const app = express();
app.use(json());

app.get('/', (req, res) => {
  res.send('Hello from auth service!');
});

app.listen(3000, () => {
  console.log('Auth service is running on port 3000');
});