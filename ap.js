const express = require("express");
const https = require("https");
const fs = require("fs");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  const indexHTML = fs.readFileSync(__dirname + "/public/index.html", "utf8");
  res.send(indexHTML);
});

app.post("/", function (req, res) {
  const query = req.body.cityName;
  const apiKey = "72e4092e44ba84c60bf81429299152f0";
  const unit = "metric";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=${unit}`;

  https.get(url, function (response) {
    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;

      const weatherHTML = `
        <!DOCTYPE html>
        <html lang="en" dir="ltr">
        <head>
          <meta charset="UTF-8">
          <title>Weather App</title>
          <link rel="stylesheet" href="/style.css">
        </head>
        <body>
          <div class="container">
            <h1>Weather App</h1>
            <form action="/" method="post" class="weather-form">
              <label for="cityInput">Enter City Name:</label>
              <input id="cityInput" type="text" name="cityName" placeholder="e.g., London" required>
              <button type="submit">Get Weather</button>
            </form>
            <div class="weather-info">
              <p class="weather-description">The weather is currently ${weatherDescription}</p>
              <h1 class="temperature">The temperature in ${query} is ${temp}°C</h1>
              <img src="${imageURL}" alt="Weather icon" class="weather-icon">
            </div>
          </div>
        </body>
        </html>
      `;

      // Save the generated HTML file to the public directory
      fs.writeFileSync(__dirname + "/public/weather.html", weatherHTML);

      // Send response
      res.sendFile(__dirname + "/public/weather.html");
    });
  });
});

app.listen(3000, function () {
  console.log("Server is running on port 3000.");
});

