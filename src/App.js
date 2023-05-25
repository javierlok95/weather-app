import './App.css';
import Search from './components/search/search';
import CurrentWeather from './components/current-weather/current-weather';
import CurrentTime from './components/current-time/current-time';
import Forecast from './components/forecast/forecast';
import { WEATHER_API_URL, WEATHER_API_KEY, GEO_API_URL, geoApiOptions } from './api';
import { useState, useEffect } from 'react';

function App() {
  function getNewDate(timeString) {
    const [hour, minute, second] = timeString.split(":");
    const hourIndex = hour - 1;
    const secondRoundedUp = Math.floor(second);
    const date = new Date();
    // add 1 second
    date.setHours(hourIndex, minute, secondRoundedUp + 1);

    const newHours = date.getHours() + 1;
    const newMinutes = date.getMinutes();
    const newSeconds = date.getSeconds();
    // if its before 6pm and after 6am, then it's day time
    setIsDayTime(hour <= 18 && hour >= 6)
    return `${newHours}:${newMinutes}:${newSeconds}`;
  }

  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);
  const [isDayTime, setIsDayTime] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      // Update timer
      if (currentTime) {
        const newDate = getNewDate(currentTime)
        setCurrentTime(newDate);
      }
      // 1000ms = 1s
    }, 1000);

    // remove the interval
    return () => clearInterval(interval);
  }, [currentTime]);

  const handleOnSearchChange = (searchData) => {
    const [lat, lon] = searchData.value.split(" ");
    const { id } = searchData

    const currentWeatherFetch = fetch(`${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );
    const forecastFetch = fetch(`${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );
    const currentTimeFetch = fetch(`${GEO_API_URL}/cities/${id}/time`, geoApiOptions);

    Promise.all([currentWeatherFetch, forecastFetch, currentTimeFetch])
      .then(async (response) => {
        const weatherResponse = await response[0].json();
        const forecastResponse = await response[1].json();
        const currentTimeResponse = await response[2].json();
        setCurrentWeather({ city: searchData.label, ...weatherResponse });
        setForecast({ city: searchData.label, ...forecastResponse });

        const [hour, minute, second] = currentTimeResponse.data.split(":");
        const secondRoundedDown = Math.floor(second);
        const newUpdatedTime = `${hour}:${minute}:${secondRoundedDown}`
        setCurrentTime(newUpdatedTime);
      })
      .catch((err) => console.log(err));
  }

  let containerClassName = 'container';

  if (isDayTime === true) {
    containerClassName += ' day-time';
  } else if (isDayTime === false) {
    containerClassName += ' night-time';
  }

  return (
    <div className={containerClassName}>
      <Search onSearchChange={handleOnSearchChange} />
      <div className="weather-time-container" >
        {currentWeather && <CurrentWeather data={currentWeather} />}
        {currentTime && <CurrentTime currentTime={currentTime} />}
      </div>
      {forecast && <Forecast data={forecast} />}
    </div>
  );
}

export default App;