// app.js or index.js
require('dotenv').config();

const express = require("express");
const app = express();
const https = require("https");
const bodyParser = require("body-parser");


const ejs = require("ejs");
const path = require("path");

const port = 3000;

const apiKey = process.env.OPEN_WHEATHER_API;

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs"); 
app.set("views", path.join(__dirname, "views")); 

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));


app.get("/", function (req, res) {
    res.render("index");
});

app.post("/", function (request, response) {
    let input_value = request.body.cityName;
    // console.log("In post!");
    // console.log(input_value);
    const enter_city = "Enter city name with correct spellings and first letter capital!";
    const url =
      "https://api.openweathermap.org/data/2.5/forecast?q=" +
      input_value +
      "&appid=" + apiKey + "&units=metric";
  
    https.get(url, function (res) {
    //   console.log(res.statusCode);
  
      let data = "";
      res.on("data", function (chunk) {
        data += chunk;
      });
  
      res.on("end", function () {
        const weatherData = JSON.parse(data);
  
        const forecastData = weatherData.list.map((item) => {
          const dateTime = new Date(item.dt_txt);
          const dayName = dateTime.toLocaleDateString("en-US", { weekday: "long" });
          const time = dateTime.toLocaleTimeString("en-US", { timeStyle: "short" });
          const temperature = item.main.temp;
          const feels_like = item.main.feels_like;
          const humidity = item.main.humidity;
          const precipitationProbability = Math.floor(item.pop * 100);
          const weatherStatus = item.weather[0].description;
          const weatherMain = item.weather[0].main;
          const weatherIconCode = item.weather[0].icon;
          const isDayTime = weatherIconCode.endsWith('d');
          const weatherIcon = isDayTime ? weatherIconCode.slice(0, -1) + 'd' : weatherIconCode;
          const weatherIconUrl = `https://openweathermap.org/img/wn/${weatherIcon}.png`;
            
        return {
            dayName,
            temperature,
            time,
            feels_like,
            precipitationProbability,
            weatherStatus,
            weatherIconUrl,
            weatherMain,
            humidity
          };
        });
  
        // console.log(forecastData);
  
        response.render("weather", { city: weatherData.city.name, forecast: forecastData }); // Render the weather.ejs template and pass the city name and forecast data
      });
    });
  });
  
  app.listen(port, function () {
    console.log("Listening at port " + port);
  });