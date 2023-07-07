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

    const weatherImage = document.querySelector('.temperature-info');

    const tableBody = document.querySelector('.weekly-section tbody');
    const rowTemplate = document.querySelector('#weekly-row-template');

    const searchInput = document.querySelector(".search-input input");
    const searchButton = document.querySelector(".search-input button");
    const btnMetric = document.querySelector('.btn-metric');
    const btnImperial = document.querySelector('.btn-imperial');

    const weatherArrow = document.querySelector('.weather-arrow');
    const errorMessage = document.querySelector('.error-message');

    let units = "metric";
    let lastSearchedCity = "Brisbane";
    const apiKey = "ded01c248c627baaa344663e4262c277";

    searchButton.addEventListener("click", () => {
        if (searchInput.value !== "") {
            lastSearchedCity = searchInput.value;
            checkCurrentWeather(searchInput.value);
            checkWeeklyForecast(searchInput.value);
            searchInput.value = '';
        } else {
            errorMessage.style.opacity = "1";
            errorMessage.textContent = "Please Enter Zip, City or Place";
        }
    });

    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            if (searchInput.value !== '') {
                lastSearchedCity = searchInput.value;
                checkCurrentWeather(searchInput.value);
                checkWeeklyForecast(searchInput.value);
                searchInput.value = '';
            } else {
                errorMessage.style.opacity = '1';
                errorMessage.textContent = 'Please Enter Zip, City or Place';
            }
        }
    });
    
    btnMetric.addEventListener("click", () => {
        units = "metric";
        checkCurrentWeather(lastSearchedCity);
        checkWeeklyForecast(lastSearchedCity);
        btnMetric.classList.add('btn-active');
        btnImperial.classList.remove('btn-active');
    });
    
    btnImperial.addEventListener("click", () => {
        units = "imperial";
        checkCurrentWeather(lastSearchedCity);
        checkWeeklyForecast(lastSearchedCity);
        btnImperial.classList.add('btn-active');
        btnMetric.classList.remove('btn-active');
    });

    async function checkCurrentWeather(city) {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?&units=${units}&q=${city}&appid=${apiKey}`);
            if (!response.ok) {
                throw new Error(`An error occurred: ${response.statusText}`);
            }
            const data = await response.json();
            if (data.cod !== 200) {
                throw new Error(`An error occurred: ${data.message}`);
            }
            currentLocation.innerHTML = data.name + ", ";
            currentCountry.innerHTML = data.sys.country;
            currentWeatherDesc.innerHTML = toTitleCase(data.weather[0].main);
            currentHumidity.innerHTML = data.main.humidity + "%";
            currentCloudiness.innerHTML = data.clouds.all + "%";
            currentLat.innerHTML = data.coord.lat; 
            currentLong.innerHTML = data.coord.lon;
            currentWindDegrees.innerHTML = data.wind.deg + "°";

            weatherArrow.style.transform = `rotate(${data.wind.deg + 180}deg)`;
            errorMessage.style.opacity = "0";
    
            formatTimeZone(data);
            convertUnits(data);
            changeWeatherImage(data);
        } catch (error) {
            console.error(error);
            errorMessage.textContent = "Location Not Found. Please Try Again."
            errorMessage.style.opacity = "1";
        }
    }

async function checkWeeklyForecast(city) {
    try {
        const weeklyApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${units}`;
        const response = await fetch(weeklyApiUrl);
        if (!response.ok) {
            throw new Error(`An error occurred: ${response.statusText}`);
        }
        const data = await response.json();
        if (data.cod !== '200') {
            throw new Error(`An error occurred: ${data.message}`);
        }
        updatedWeeklyForecast(data);
    } catch (error) {
        console.error(error);
    }
}

    function updatedWeeklyForecast(data) {
        tableBody.innerHTML = '';

        for (let i = 0; i < data.list.length; i += 8) {
            const dayData = data.list[i];
            const row = rowTemplate.content.cloneNode(true);
        
            row.querySelector('[data-icon]').src = `http://openweathermap.org/img/wn/${dayData.weather[0].icon}@4x.png`;
            row.querySelector('[data-day]').textContent = moment(dayData.dt_txt).format('dddd');
            row.querySelector('[data-rain]').textContent = `${dayData.pop * 100}%`;
            row.querySelector('[data-humidity]').textContent = `${dayData.main.humidity}%`;
            row.querySelector('[data-min-temp]').textContent = Math.round(dayData.main.temp_min);
            row.querySelector('[data-max-temp]').textContent = Math.round(dayData.main.temp_max);

            tableBody.appendChild(row);
        }
    }

    function toTitleCase(str) {
        return str.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function changeWeatherImage(data) {
    let weatherIconID = data.weather[0].icon;
    let weatherIconURL = `http://openweathermap.org/img/wn/${weatherIconID}@4x.png`;

    weatherImage.style.backgroundImage = `linear-gradient(rgba(61, 0, 141, 0.2), rgba(61, 0, 141, 0.8)), url(${weatherIconURL})`;
}

function convertUnits(data) {
    let tempUnit = units === "metric" ? "°C" : "°F";
        currentTemp.innerHTML = Math.round(data.main.temp) + tempUnit;
        currentFeelDesc.innerHTML = Math.round(data.main.feels_like) + tempUnit;
        currentMinTemp.innerHTML = Math.round(data.main.temp_min) + tempUnit;
        currentMaxTemp.innerHTML = Math.round(data.main.temp_max) + tempUnit;

        if (units === "metric") {
            currentWind.innerHTML = data.wind.speed + " km/h";
            currentVisiblity.innerHTML = (data.visibility / 1000) + " km";
        } else {
            let visibilityInMiles = (data.visibility / 1000) * 0.621371;
            currentVisiblity.innerHTML = visibilityInMiles.toFixed(1) + " mi";
            currentWind.innerHTML = data.wind.speed + " mph";
        }
}

function formatTimeZone(data) {
    let timeZoneOffset = data.timezone / 60;

        let sunriseDate = moment.unix(data.sys.sunrise).utcOffset(timeZoneOffset);
        currentSunrise.innerHTML = sunriseDate.format('LT');

        let sunsetDate = moment.unix(data.sys.sunset).utcOffset(timeZoneOffset);
        currentSunset.innerHTML = sunsetDate.format('LT');

        let currentDate = moment().utcOffset(timeZoneOffset);

        let formattedDate = currentDate.format('MMMM Do YYYY');
        let formattedTime = currentDate.format('LT');

        currentDateTime.innerHTML = formattedDate + " | ";
        currentTime.innerHTML = formattedTime;
}

    checkCurrentWeather('Brisbane');
    checkWeeklyForecast('Brisbane');
}