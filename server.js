const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const { response } = require('express');

const signin = require('./controllers/signin');
const register = require('./controllers/register');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0; 

const db = knex({
  client: 'pg',
  connection: {
    connectionString : process.env.DATABASE_URL,
    ssl: true
  }
});

// const db = knex({
//   client: 'pg',
//   connection: {
//     host : '127.0.0.1',
//     user : 'revitalsirotkin',
//     password : '',
//     database : 'smart-brain'
//   }
// });

const app = express();
app.use(express.json());


app.use(cors());

// app.get('/', (req, res) =>{
//     res.send('it is working');
// })

//signin
app.post('/signin', (req, res) => signin.handleSignin(req, res, db, bcrypt));

//register
app.post('/register', (req, res) => register.handleRegister(req, res, db, bcrypt));

app.get('/profile/:id', (req,res) => profile.handleProfileGet(req, res, db));

app.put('/image', (req, res) => image.handleImage(req, res, db));

app.post('/imageurl', (req, res) => image.handleApiCall(req, res));


app.listen(process.env.PORT || 3000, ()=> {
    console.log(`app is running on port ${process.env.PORT}`);
})