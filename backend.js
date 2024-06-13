const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { Sequelize } = require('sequelize');

dotenv.config();

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) {
    console.error('Database connection failed: ', err);
  } else {
    console.log('Connected to the database');
  }
});

// Set up Sequelize for session management
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
});

const sessionStore = new SequelizeStore({
  db: sequelize,
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
  })
);

sessionStore.sync();

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    connection.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
      if (error) return done(error);

      if (results.length === 0) {
        return done(null, false, { message: 'Incorrect email.' });
      }

      const user = results[0];
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) return done(err);
        if (isMatch) return done(null, user);
        return done(null, false, { message: 'Incorrect password.' });
      });
    });
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  connection.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
    if (err) return done(err);
    done(null, results[0]);
  });
});

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
};

app.get('/', ensureAuthenticated, (req, res) => {
  res.sendFile(__dirname + '/public/inside.html');
});

app.post('/register', (req, res) => {
  const user = req.body;

  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      console.error('Error hashing password:', err);
      res.status(500).send('Error registering user');
      return;
    }

    connection.query(
      'INSERT INTO users (name, email, password, age, height, weight) VALUES (?, ?, ?, ?, ?, ?)',
      [user.name, user.email, hash, user.age, user.height, user.weight],
      (error, results) => {
        if (error) {
          console.error('Error registering user:', error);
          res.status(500).send('Error registering user');
        } else {
          res.status(200).send('User registered successfully');
        }
      }
    );
  });
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
}));

app.post('/totalCalories', ensureAuthenticated, (req, res) => {
  const cartItems = req.body.cartItems;
  if (!cartItems || cartItems.length === 0) {
    return res.status(400).send('No items in the cart to calculate calories');
  }

  let query = `SELECT SUM(calories) AS total_calories FROM (
                SELECT VegCalorie AS calories FROM Vegetable WHERE VegName IN (${cartItems.map(item => `'${item}'`).join(',')})
                UNION ALL
                SELECT FruitCalorie AS calories FROM Fruit WHERE FruitName IN (${cartItems.map(item => `'${item}'`).join(',')})
                UNION ALL
                SELECT NutCalorie AS calories FROM Nuts WHERE NutName IN (${cartItems.map(item => `'${item}'`).join(',')})
                UNION ALL
                SELECT GrainCalorie AS calories FROM Grains WHERE GrainName IN (${cartItems.map(item => `'${item}'`).join(',')})
                UNION ALL
                SELECT DrinkCalorie AS calories FROM Drinks WHERE DrinkName IN (${cartItems.map(item => `'${item}'`).join(',')})
              ) AS all_foods`;

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error retrieving total calories: ', error);
      res.status(500).send('Error retrieving total calories');
    } else {
      const totalCalories = results[0].total_calories || 0;
      res.json({ total_calories: totalCalories });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
