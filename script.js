const apiKey = "2611c03f0c70945a3b06d36fb5326b36";
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const loadingEl = document.getElementById("loading");
const errorEl = document.getElementById("error");
const weatherDisplay = document.getElementById("weatherDisplay");
const cityNameEl = document.getElementById("cityName");
const tempEl = document.getElementById("temp");
const conditionEl = document.getElementById("condition");
const humidityEl = document.getElementById("humidity");
const weatherIconEl = document.getElementById("weatherIcon");
const forecastEl = document.getElementById("forecast");
const forecastCards = document.getElementById("forecastCards");

async function fetchWeather(city) {
  try {
    showLoading(true);
    showError("");
    weatherDisplay.classList.add("hidden");
    forecastEl.classList.add("hidden");
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    if (!weatherRes.ok) throw new Error("City not found!");
    const weatherData = await weatherRes.json();
    cityNameEl.textContent = weatherData.name;
    tempEl.textContent = Math.round(weatherData.main.temp);
    conditionEl.textContent = weatherData.weather[0].main;
    humidityEl.textContent = weatherData.main.humidity;
    const iconCode = weatherData.weather[0].icon;
    weatherIconEl.src = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIconEl.alt = weatherData.weather[0].description;

    weatherDisplay.classList.remove("hidden");
    localStorage.setItem("lastCity", city);

    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    );
    const forecastData = await forecastRes.json();
    displayForecast(forecastData);

  } catch (err) {
    showError(err.message);
  } finally {
    showLoading(false);
  }
}

function displayForecast(data) {
  forecastCards.innerHTML = "";
  const daily = {};

  data.list.forEach((item) => {
    const date = item.dt_txt.split(" ")[0];
    if (!daily[date]) {
      daily[date] = item;
    }
  });

  Object.keys(daily).slice(0, 5).forEach((date) => {
    const item = daily[date];
    const card = document.createElement("div");
    card.classList.add("card");
    const iconCode = item.weather[0].icon;

    card.innerHTML = `
      <p><strong>${date}</strong></p>
      <img src="http://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${item.weather[0].description}">
      <p>${Math.round(item.main.temp)}°C</p>
      <p>${item.weather[0].main}</p>
    `;
    forecastCards.appendChild(card);
  });

  forecastEl.classList.remove("hidden");
}

function showLoading(show) {
  loadingEl.classList.toggle("hidden", !show);
}

function showError(msg) {
  errorEl.textContent = msg;
  errorEl.classList.toggle("hidden", msg === "");
}

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) fetchWeather(city);
});

cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchBtn.click();
});

window.onload = () => {
  const lastCity = localStorage.getItem("lastCity");
  if (lastCity) fetchWeather(lastCity);
};
