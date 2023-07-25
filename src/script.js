function displayDate() {
  let now = new Date();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let curr_time = document.querySelector(".time");
  let day = days[now.getDay()];
  let hour = now.getHours();
  if (hour < 10) {
    hour = ("0" + hour).slice(-2);
  }
  let minute = now.getMinutes();
  if (minute < 10) {
    minute = ("0" + minute).slice(-2);
  }
  curr_time.innerHTML = `${day} ${hour}:${minute}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector(".weather-forcast");

  let forecastHTML = `<div class="forecast row">`;

  forecast.forEach(function (day, index) {
    if (index > 0 && index < 6) {
      forecastHTML += `<div class="col unit">
  <div class="date">${formatDay(day.time)}</div>
  <img class="forecast-icon" src=${day.condition.icon_url} alt=${
        day.condition.icon
      }>
  <div class="temp-list">
    <span class="high">${Math.round(day.temperature.maximum)}°</span>
    <span class="low"> / ${Math.round(day.temperature.minimum)}°</span>
  </div>
  </div>`;
    }
  });

  forecastHTML += `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coords) {
  let apiKey = "2b32f63e3t5dbc4a0f214f150o0d2cf2";
  let units = "metric";

  let apiEndpoint = "https://api.shecodes.io/weather/v1/forecast";
  let apiUrl = `${apiEndpoint}?lon=${coords.lon}&lat=${coords.lat}&key=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayForecast);
}

function showTempterature(response) {
  let temp = Math.round(response.data.main.temp);
  let currTemp = document.querySelector("header .temp");
  currTemp.innerHTML = `${temp}°C`;

  // main high
  let tempMax = Math.round(response.data.main.temp_max);
  let currTempMax = document.querySelector("header .high");
  currTempMax.innerHTML = `H: ${tempMax}°`;

  // main low
  let tempMin = Math.round(response.data.main.temp_min);
  let currTempLow = document.querySelector("header .low");
  currTempLow.innerHTML = ` &nbsp L: ${tempMin}°`;

  // change displayed city
  let city = response.data.name;
  let currCity = document.querySelector(".city");
  currCity.innerHTML = city.toUpperCase();

  // change description
  let currDescription = document.querySelector("header .curr-weather");
  currDescription.innerHTML = response.data.weather[0].description;

  // change humidity, rain, wind
  let currHumidity = document.querySelector("#humidity");
  currHumidity.innerHTML = response.data.main.humidity;

  let currWind = document.querySelector("#wind-speed");
  currWind.innerHTML = Math.round(response.data.wind.speed);

  // change background image
  if (response.data.weather[0].main === "Clear") {
    document.getElementById("weather-background").style.backgroundImage =
      "url(./image/clear_sky.jpg)";
  }
  if (response.data.weather[0].main === "Clouds") {
    document.getElementById("weather-background").style.backgroundImage =
      "url(./image/cloudy.jpg)";
  }
  if (response.data.weather[0].icon === "50d") {
    document.getElementById("weather-background").style.backgroundImage =
      "url(./image/foggy.jpg)";
  }
  if (response.data.weather[0].main === "Thunderstorm") {
    document.getElementById("weather-background").style.backgroundImage =
      "url(./image/thunder.jpg)";
  }
  if (response.data.weather[0].main === "Drizzle") {
    document.getElementById("weather-background").style.backgroundImage =
      "url(./image/drizzle.jpg)";
  }
  if (response.data.weather[0].main === "Rain") {
    document.getElementById("weather-background").style.backgroundImage =
      "url(./image/drizzle.jpg)";
  }
  if (response.data.weather[0].main === "Snow") {
    document.getElementById("weather-background").style.backgroundImage =
      "url(./image/snow.jpg)";
  }

  getForecast(response.data.coord);
}

function changeCity(event) {
  event.preventDefault();

  let newCity = document.querySelector("#search-bar").value;

  let apiKey = "4c9b53e4f8f5eb00df5915bdca340605";
  let units = "metric";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
  let apiUrl = `${apiEndpoint}?q=${newCity}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showTempterature);
}

// change temp in between celcius and farenheit
function calcFahr(celsius) {
  return Math.round((celsius * 9) / 5 + 32);
}
function calcCel(fahr) {
  return Math.round(((fahr - 32) * 5) / 9);
}

function changeTemp(event) {
  event.preventDefault();
  // temp
  let mainTemp = document.querySelector(".temp");
  let tempStr_m = mainTemp.innerHTML;
  let tempNum_m = Number(tempStr_m.replace(/\D/g, ""));

  // high
  let highTemp = document.querySelectorAll(".high");
  let tempArray_h = [];
  for (let i = 0; i < highTemp.length; i++) {
    let tempStr_h = highTemp[i].innerHTML;
    let tempNum_h = Number(tempStr_h.replace(/\D/g, ""));
    tempArray_h.push(tempNum_h);
  }

  // low
  let lowTemp = document.querySelectorAll(".low");
  let tempArray_l = [];
  for (let i = 0; i < lowTemp.length; i++) {
    let tempStr_l = lowTemp[i].innerHTML;
    let tempNum_l = Number(tempStr_l.replace(/\D/g, ""));
    tempArray_l.push(tempNum_l);
  }

  // f to c
  if (clicks % 2 === 0) {
    event.target.innerHTML = "°C";
    mainTemp.innerHTML = `${calcFahr(tempNum_m)}°F`;

    let headerHigh = document.querySelector("header .high");
    headerHigh.innerHTML = `H: ${calcFahr(tempArray_h[0])}°`;
    let sectionHigh = document.querySelectorAll("section .high");
    for (let i = 0; i < sectionHigh.length; i++) {
      sectionHigh[i].innerHTML = `${calcFahr(tempArray_h[i + 1])}°`;
    }

    let headerLow = document.querySelector("header .low");
    headerLow.innerHTML = ` &nbsp L: ${calcFahr(tempArray_l[0])}°`;
    let sectionLow = document.querySelectorAll("section .low");
    for (let i = 0; i < sectionLow.length; i++) {
      sectionLow[i].innerHTML = ` / ${calcFahr(tempArray_l[i + 1])}°`;
    }
  } else {
    // c to f
    event.target.innerHTML = "°F";

    mainTemp.innerHTML = `${calcCel(tempNum_m)}°C`;

    let headerHigh = document.querySelector("header .high");
    headerHigh.innerHTML = `H: ${calcCel(tempArray_h[0])}°`;
    let sectionHigh = document.querySelectorAll("section .high");
    for (let i = 0; i < sectionHigh.length; i++) {
      sectionHigh[i].innerHTML = `${calcCel(tempArray_h[i + 1])}°`;
    }

    let headerLow = document.querySelector("header .low");
    headerLow.innerHTML = ` &nbsp L: ${calcCel(tempArray_l[0])}°`;
    let sectionLow = document.querySelectorAll("section .low");
    for (let i = 0; i < sectionLow.length; i++) {
      sectionLow[i].innerHTML = ` / ${calcCel(tempArray_l[i + 1])}°`;
    }
  }

  clicks += 1;
}

function showLoc(location) {
  let lat = location.coords.latitude;
  let lon = location.coords.longitude;

  let apiKey = "1dbf926d3b4417bf379db7043bec1047";
  let units = "metric";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
  let apiUrl = `${apiEndpoint}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(showTempterature);
}

function getGeoLoc() {
  navigator.geolocation.getCurrentPosition(showLoc);
}

function defaultDisplay(city) {
  let apiKey = "4c9b53e4f8f5eb00df5915bdca340605";
  let units = "metric";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
  let apiUrl = `${apiEndpoint}?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showTempterature);
}

let searchCity = document.querySelector("#search-form");
searchCity.addEventListener("submit", changeCity);

let clicks = 0;
let tempF = document.querySelector(".fahrenheit");
tempF.addEventListener("click", changeTemp);

let currLoc = document.querySelector("footer .curr_loc");
currLoc.addEventListener("click", getGeoLoc);

defaultDisplay("Guangzhou");
displayDate();
