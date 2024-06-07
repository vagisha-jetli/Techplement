const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  const query = req.body.cityName;
  const apikey = "72e4092e44ba84c60bf81429299152f0";
  const unit = "metric";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apikey}&units=${unit}`;

  https.get(url, function (response) {
    console.log(response.statusCode);

    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;

      res.send(`
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
      `);
    });
  });
});

app.listen(3000, function () {
  console.log("Server is running on port 3000.");
});
