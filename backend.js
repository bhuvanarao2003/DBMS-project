const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt=require('bcrypt');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'gouthu12345678',
  database: 'root_project',
});

connection.connect((err) => {
  if (err) {
    console.error('Database connection failed: ', err);
  } else {
    console.log('Connected to the database');
  }
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/inside.html');
});
app.post('/register', (req, res) => {
  const user = req.body;

  // Hash the password before storing it
  bcrypt.hash(user.password, 10, (err, hash) => {
      if (err) {
          console.error('Error hashing password:', err);
          res.status(500).send('Error registering user');
          return;
      }

      connection.query(
          'INSERT INTO users (name, email, password, age, height, weight) VALUES (?, ?, ?, ?, ?, ?)',
          [user.name, user.email, hash, user.age, user.height, user.weight],
          (error, results, fields) => {
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
    app.post('/login', (req, res) => {
      const { email, password } = req.body;
  
      // Check if the email exists in the database
      connection.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
          if (error) {
              console.error('Error retrieving user:', error);
              return res.status(500).json({ error: 'Server error' });
          }
  
          if (results.length === 0) {
              return res.status(404).json({ error: 'User not found' });
          }
  
          const user = results[0];
          bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.status(500).json({ error: 'Server error' });
            }

            if (result) {
                // Passwords match, login successful
                res.json({ message: 'Login successful', user: { id: user.id, name: user.name, email: user.email } });
            } else {
                // Passwords don't match
                res.status(401).json({ error: 'Invalid password' });
            }
        });
    });
  });
  
app.post('/totalCalories', (req, res) => {
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


  connection.query(query, (error, results, fields) => {
    if (error) {
      console.error('Error retrieving total calories: ', error);
      res.status(500).send('Error retrieving total calories');
    } else {
      const totalCalories = results[0].total_calories || 0;
      res.json({total_calories:totalCalories });
    }
  });
});



app.listen(port, () => {
  console.log('Server is running on port ${port}');
});
