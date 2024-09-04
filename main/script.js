
angular.module('calorieApp', [])
        .controller('CalorieController', ['$scope', '$http', function($scope, $http) {
            $scope.foodItems = {
                "Vegetables": ["Carrot", "Spinach", "Tomato", "Broccoli", "Cucumber", "Bell Pepper", "Zucchini", "Lettuce", "Cabbage", 
                                "Kale", "Cauliflower", "Asparagus", "Green Beans", "Brussels Sprouts", "Eggplant", "Potato", "Sweet Potato", 
                                "Onion", "Garlic", "Mushroom"],
                "Fruits": ["Apple", "Banana", "Orange", "Grapes", "Strawberry", "Watermelon", "Mango", "Pineapple", "Kiwi", "Peach", 
                            "Plum", "Cherry", "Pear", "Grapefruit", "Cantaloupe", "Blueberry", "Raspberry", "Blackberry", "Apricot", "Coconut"],
                "Nuts": ["Almonds", "Walnuts", "Cashews", "Peanuts", "Pistachios", "Hazelnuts", "Brazil Nuts", "Macadamia Nuts", "Pecans", 
                            "Chestnuts", "Sunflower Seeds", "Pumpkin Seeds", "Flaxseeds", "Chia Seeds", "Sesame Seeds"],
                "Grains": ["Rice", "Wheat", "Ragi (Finger Millet)", "Jowar (Sorghum)", "Bajra (Pearl Millet)", "Quinoa", "Barley", "Oats", 
                            "Corn", "Brown Rice", "Maize", "Buckwheat", "Semolina (Sooji)", "Millet (Bajra)", "Amaranth (Rajgira)"],
                "Drinks": ["Water", "Green Tea", "Black Coffee", "Milk", "Orange Juice", "Apple Juice", "Carrot Juice", "Coconut Water", 
                            "Lemonade", "Vegetable Smoothie", "Protein Shake", "Iced Tea", "Soda", "Cranberry Juice", "Pomegranate Juice"]
            };
            $scope.foodCategories = Object.keys($scope.foodItems);
            $scope.cart = [];
            $scope.addToCart = function() {
                if ($scope.selectedItem) {
                    $scope.cart.push($scope.selectedItem);
                }
            };
            
            $scope.estimateCalories = function() {
    $http.post('/totalCalories', { cartItems: $scope.cart })
    .then(function(response) {
        $scope.calorieResult = "Estimated Calories: " + response.data.total_calories +" Calories ";
    })
    .catch(function(error) {
        console.error('Error:', error);
    });
};
        }]);

angular.module('loginApp', [])
        .controller('LoginController', ['$scope', '$http','$window', function($scope, $http, $window ) {
            $scope.loginUser = function() {
                const userData = {
                    email: $scope.email,
                    password: $scope.password
                };

                $http.post('/login', userData)
                    .then(function(response) {
                        alert('User logged in successfully successfully');
                    // Clear the form fields after successful registration
                    // Redirect to the login page
                    $window.location.href = '/home.html';
                })
                    .catch(function(error) {
                        alert('Error logging in. Please check your credentials.');
                        console.error('Error logging in:', error);
                    });
            };
        }]);
angular.module('registrationApp', [])
        .controller('RegistrationController', ['$scope', '$http','$window', function($scope, $http, $window) {
            $scope.user = {};

            $scope.registerUser = function() {
                $http.post('/register', $scope.user)
                    .then(function(response) {
                        alert('User registered successfully');
                        // Clear the form fields after successful registration
                        $window.location.href = '/front.html';
                    })
                    .catch(function(error) {
                        console.error('Error registering user:', error);
                        alert('Error registering user. Please try again.');
                    });
            };
        }]);
function calculateBMI() {
            var weight = parseFloat(document.getElementById('weight').value);
            var height = parseFloat(document.getElementById('height').value) / 100; // Convert height to meters
            var bmi = weight / (height * height);

            if (isNaN(bmi)) {
                document.getElementById('result').innerText = "Please enter valid values.";
                return;
            }

            var bmiResult = "Your BMI is " + bmi.toFixed(2) + ". ";

            if (bmi < 18.5) {
                bmiResult += "You are underweight.";
            } else if (bmi < 25) {
                bmiResult += "You have a normal weight.";
            } else if (bmi < 30) {
                bmiResult += "You are overweight.";
            } else {
                bmiResult += "You are obese.";
            }

            document.getElementById('result').innerText = bmiResult;
        }
  