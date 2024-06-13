
# Nutrition Estimation Project

## Overview
The Nutrition Estimation Project is a web application designed to help users estimate their nutritional needs. The application includes features such as BMI calculation and a calorie estimator. This project is built using AngularJS for the front end, Node.js for the back end, CSS for styling, and SQL for database management.

## Features
- **BMI Calculator:** Calculate Body Mass Index based on height and weight.
- **Calorie Estimator:** Estimate daily caloric needs based on user input.
- **User Authentication:** Secure login and registration system.
- **Responsive Design:** Optimized for various devices using CSS.

## Technologies Used
- **Frontend:**
  - AngularJS
  - HTML5
  - CSS3
- **Backend:**
  - Node.js
- **Database:**
  - SQL (MySQL/PostgreSQL)
- **Tools:**
  - npm
  - Express.js


## Installation

### Prerequisites
- Node.js and npm installed on your machine.
- MySQL or PostgreSQL installed and running.

### Steps
1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/nutrition-estimation.git
   cd nutrition-estimation
   ```

2. **Backend Setup:**
   ```sh
   cd backend
   npm install
   ```

3. **Database Setup:**
   - Create a database and import the schema:
     ```sql
     CREATE DATABASE nutrition_db;
     USE nutrition_db;
     SOURCE path/to/schema.sql;
     SOURCE path/to/seed.sql;
     ```

4. **Frontend Setup:**
   ```sh
   cd ../frontend
   npm install
   ```

5. **Run the Application:**
   - Start the backend server:
     ```sh
     cd backend
     node app.js
     ```
   - Open `index.html` in your web browser or use a local server to serve the frontend files.

## Usage
- **BMI Calculator:** Navigate to the BMI Calculator section, enter your height and weight, and click "Calculate" to view your BMI.
- **Calorie Estimator:** Navigate to the Calorie Estimator section, enter your consumption of food and click "Estimate" to view your daily caloric needs.

## Contributing
We welcome contributions! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact
For any questions or suggestions, please contact [bhuvanarao2003@gmail.com].
