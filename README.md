# Weather Broadcast App

This project is a 5-day, three-hour weather broadcast app based on the city name. It uses the OpenWeather API to fetch weather data.

## Local Installation

Follow these steps to run the project locally:

### 1. Clone the Repository

```bash
git clone https://github.com/M-YasirGhaffar/openweather-api
```

### 2. Navigate to the Project Directory

```bash
cd openweather-api
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Get OpenWeather API Key

To use the OpenWeather API, you need an API key. You can obtain one by following these steps:

1. Go to the [OpenWeatherMap website](https://openweathermap.org/).
2. Sign up for a free account or log in if you already have one.
3. Once logged in, go to the "API keys" section in your account settings.
4. Generate a new API key.
5. Copy the API key.

### 5. Create a .env File

Create a file named `.env` in the project's root directory and add your OpenWeather API key:

```env
OPEN_WEATHER_API=your_openweather_api_key
```

Replace `your_openweather_api_key` with the API key.

### 6. Start the Application

Run the following command to start the application:

```bash
npm start
```

### 7. Access the Application

Open your web browser and navigate to [http://localhost:3000](http://localhost:3000) to access the application.

## Usage

1. Select a city from the dropdown menu.
2. Click the "Submit" button.
3. View the 5-day, three-hour weather broadcast for the selected city.

## Dependencies

- body-parser: ^1.20.2
- dotenv: ^16.3.1
- ejs: ^3.1.9
- express: ^4.18.2
