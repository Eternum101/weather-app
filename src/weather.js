import moment from 'moment';

export function getWeather() {
    const currentLocation = document.querySelector('[data-current-location]');
    const currentCountry = document.querySelector('[data-current-country]');
    const currentTemp = document.querySelector('[data-current-temp]');
    const currentWeatherDesc = document.querySelector('[data-current-weather-desc]');
    const currentFeelDesc = document.querySelector('[data-current-feel-desc]');
    const currentWind = document.querySelector('[data-current-wind]');
    const currentHumidity = document.querySelector('[data-current-humidity]');
    const currentCloudiness = document.querySelector('[data-current-cloudiness]');
    const currentSunrise = document.querySelector('[data-current-sunrise]');
    const currentSunset = document.querySelector('[data-current-sunset]');
    const currentMinTemp = document.querySelector('[data-current-min-temp]');
    const currentMaxTemp = document.querySelector('[data-current-max-temp]');
    const currentLat = document.querySelector('[data-current-lat]');
    const currentLong = document.querySelector('[data-current-long]');
    const currentWindDegrees = document.querySelector('[data-current-wind-degrees]');
    const currentVisiblity = document.querySelector('[data-current-visibility]');
    const currentDateTime = document.querySelector('[data-current-date]');
    const currentTime = document.querySelector('[data-current-time]');

    const apiKey = "ded01c248c627baaa344663e4262c277";
    const apiUrl = "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=";

    const searchInput = document.querySelector(".search-input input");
    const searchButton = document.querySelector(".search-input button");

    searchButton.addEventListener('click', () => {
        checkCurrentWeather(searchInput.value);
    });

    async function checkCurrentWeather(city) {
        const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
        let data = await response.json();

        console.log(data);
        currentLocation.innerHTML = data.name + ", ";
        currentCountry.innerHTML = data.sys.country;
        currentTemp.innerHTML = Math.round(data.main.temp) + "°C";
        currentWeatherDesc.innerHTML = data.weather[0].description.toUpperCase();
        currentFeelDesc.innerHTML = Math.round(data.main.feels_like) + "°C";
        currentWind.innerHTML = data.wind.speed + " km/h";
        currentHumidity.innerHTML = data.main.humidity + "%";
        currentCloudiness.innerHTML = data.clouds.all + "%";
        currentMinTemp.innerHTML = Math.round(data.main.temp_min) + "°C";
        currentMaxTemp.innerHTML = Math.round(data.main.temp_max) + "°C";
        currentLat.innerHTML = data.coord.lat; 
        currentLong.innerHTML = data.coord.lon;
        currentWindDegrees.innerHTML = data.wind.deg + "&deg";
        currentVisiblity.innerHTML = (data.visibility / 1000) + " km";

        let sunriseDate = moment.unix(data.sys.sunrise);
        currentSunrise.innerHTML = sunriseDate.format('LT');

        let sunsetDate = moment.unix(data.sys.sunset);
        currentSunset.innerHTML = sunsetDate.format('LT');

        let currentDate = moment();
        currentDateTime.innerHTML = currentDate.format('MMMM Do YYYY' + " | ");

        let getTime = moment();
        currentTime.innerHTML = getTime.format('LT');
    }

    checkCurrentWeather('Brisbane');
}