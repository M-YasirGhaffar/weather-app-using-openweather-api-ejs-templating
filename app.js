require('dotenv').config();
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index', { weather: null, error: null });
});

function convertUnixTime(unixTimestamp, timezoneOffset) {
  const date = new Date(unixTimestamp * 1000);

  const localTime = new Date(date.getTime() + timezoneOffset * 1000);

  return localTime.toISOString().replace('T', ' ').substring(0, 19);
}

function convertKelvinToCelsius(kelvin) {
  return kelvin - 273.15;
}

app.get('/weather', async (req, res) => {
  const { latitude, longitude, cityName } = req.query;
  const apiKey = process.env.OPEN_WEATHER_API;
  let weatherUrl, forecastUrl;

  if (cityName) {
    weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`;
    forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${apiKey}`;
  } else if (latitude && longitude) {
    weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
  } else {
    res.render('index', { error: 'Please provide a location.' });
    return;
  }

  try {
    const [weatherResponse, forecastResponse] = await Promise.all([
      axios.get(weatherUrl),
      axios.get(forecastUrl)
    ]);
    const weatherData = {
      city: weatherResponse.data.name,
      country: weatherResponse.data.sys.country,
      coordinates: `Latitude: ${weatherResponse.data.coord.lat.toFixed(4)}°, Longitude: ${weatherResponse.data.coord.lon.toFixed(4)}°`,
      condition: weatherResponse.data.weather[0].main,
      id: weatherResponse.data.weather[0].id,
      description: weatherResponse.data.weather[0].description,
      icon: weatherResponse.data.weather[0].icon,
      temp: weatherResponse.data.main.temp,
      feels_like: weatherResponse.data.main.feels_like,
      temp_min: weatherResponse.data.main.temp_min,
      temp_max: weatherResponse.data.main.temp_max,
      pressure: weatherResponse.data.main.pressure,
      humidity: weatherResponse.data.main.humidity,
      visibility: weatherResponse.data.visibility,
      wind_speed: weatherResponse.data.wind.speed,
      wind_deg: weatherResponse.data.wind.deg,
      wind_gust: weatherResponse.data.wind.gust || 'N/A',
      clouds: weatherResponse.data.clouds.all,
      dt: weatherResponse.data.dt,
      sunrise: weatherResponse.data.sys.sunrise,
      sunset: weatherResponse.data.sys.sunset,
      timezone: weatherResponse.data.timezone
    };

    weatherData.lastUpdated = convertUnixTime(weatherData.dt, weatherData.timezone);
    weatherData.sunriseTime = convertUnixTime(weatherData.sunrise, weatherData.timezone);
    weatherData.sunsetTime = convertUnixTime(weatherData.sunset, weatherData.timezone);

    const forecastData = forecastResponse.data.list.map(item => ({
      temp: item.main.temp,
      feels_like: item.main.feels_like,
      temp_min: item.main.temp_min,
      temp_max: item.main.temp_max,
      pressure: item.main.pressure,
      humidity: item.main.humidity,
      sea_level: item.main.sea_level,
      grnd_level: item.main.grnd_level,
      temp_kf: item.main.temp_kf,
      weatherCondition: item.weather[0].main,
      description: item.weather[0].description,
      icon: item.weather[0].icon, // Icon code
      clouds: item.clouds.all, // Cloudiness, percentage
      wind_speed: item.wind.speed, // Wind speed
      wind_deg: item.wind.deg, // Wind direction in degrees
      wind_gust: item.wind.gust,
      visibility: item.visibility,
      pop: (item.pop * 100).toFixed(2),
      dt: item.dt,
      dt_txt: item.dt_txt // Textual representation of dt, local time
    }));

    // Assuming forecastData is an array of forecast items
    const groupedByDay = forecastData.reduce((acc, item) => {
      const date = item.dt_txt.split(' ')[0]; // Extract the date part
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(item);
      return acc;
    }, {});

    // Now, prepare the data for the charts
    const chartsData = Object.keys(groupedByDay).map(date => {
      const items = groupedByDay[date];
      return {
        date,
        labels: items.map(item => item.dt_txt.split(' ')[1]), // Assuming you want just the time part
        data: items.map(item => item.temp) // Convert Kelvin to Celsius
      };
    });
    console.log(JSON.stringify(chartsData, null, 2)); // Add this before res.render to check the structure


    res.render('weather', { weather: weatherData, forecast: forecastData, chartsData: chartsData });

  } catch (error) {
    console.error(error);
    res.render('error', { error: 'Failed to fetch weather data.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
