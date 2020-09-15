var searchInput = $("#search-input");
var searchButton = $("#search-button");
var searchHistory = $("#search-history");
var weatherReport = $("#weather-report");
var weatherNow = $("#weather-now");
var weatherFiveDay = $("#weather-five-day");

var recentSearches = JSON.parse(localStorage.getItem("recentSearches"));

init();

// Functions

function getCurrentWeather(cityName) {
  
  var apiKey = "731e9f8a098503cff9f880ca0083adaa";
  var currentWeatherURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&appid=" +
    apiKey +
    "&units=imperial";

  weatherNow.html("");

  $.ajax({
    url: currentWeatherURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    console.log(response.weather[0].icon);

    var thisCity = $("<H3>").text(response.name + " " + response.dt);
    var tempNow = $("<p>").text("Temperature: " + response.main.temp);
    var humidityNow = $("<p>").text("Humidity: " + response.main.humidity);
    var windSpeedNow = $("<p>").text("Wind Speed: " + response.wind.speed);
    var iconCode = response.weather[0].icon;
    var icon = $("<img>").attr("src", "http://openweathermap.org/img/wn/"+ response.weather[0].icon + "@2x.png");
    var lat = response.coord.lat;
    var lon = response.coord.lon;

    weatherNow.append(thisCity, icon, tempNow, humidityNow, windSpeedNow);

    getCurrentUvi(lat, lon);

    weatherReport.show();

  });

}

function getCurrentUvi(lat, lon) {

  var apiKey = "731e9f8a098503cff9f880ca0083adaa";
  var currentUviURL =
    "https://api.openweathermap.org/data/2.5/uvi?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=" +
    apiKey;

  $.ajax({
    url: currentUviURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);

    var uvIndex = $("<p>").text("UV Index: " + response.value);
    weatherNow.append(uvIndex);

    searchHistory.show();

  });
}

function getForecast(cityName) {
  var apiKey = "731e9f8a098503cff9f880ca0083adaa";

  var forecastURL =
    "https:///api.openweathermap.org/data/2.5/forecast?q=" +
    cityName +
    "&appid=" +
    apiKey +
    "&units=imperial";

  weatherNow.html("");

  $.ajax({
    url: forecastURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);
  });

  // weatherReport.show();
}

function queryFromInput(event) {
  event.preventDefault();
  var cityName = $("#search-input").val().trim();
  recentSearches.unshift(cityName);
  localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
  addToRecent();
  console.log(cityName);
  getCurrentWeather(cityName);
}

function queryFromRecent() {
  console.log($(this).attr("data-name"));
  var cityName = $(this).attr("data-name");
  getCurrentWeather(cityName);
}

function init() {
  weatherReport.hide();
  searchHistory.hide();
  if (recentSearches) {
    searchHistory.show();
    for (var i = 0; i < recentSearches.length; i++) {
      var savedRecent = $("<li>");
      savedRecent.addClass("list-group-item");
      savedRecent.text(recentSearches[i]);
      savedRecent.attr("data-name", recentSearches[i]);
      searchHistory.append(savedRecent);
    }
  } else {
    recentSearches = [];
  }
}

function addToRecent() {
  searchHistory.empty();
  for (var i = 0; i < recentSearches.length; i++) {
    var newRecent = $("<li>");
    newRecent.addClass("list-group-item");
    newRecent.text(recentSearches[i]);
    newRecent.attr("data-name", recentSearches[i]);
    searchHistory.append(newRecent);
  }
}

function getDate(unixTimestamp) {
  var date = new Date(unixTimestamp * 1000);
  var month = date.getMonth();
  var day = date.getDay();
  var year = date.getFullYear();

  console.log(month + "/" + day + "/" + year);
  return month + "/" + day + "/" + year;
}

// Click events

$("#search-form").on("submit", queryFromInput);

$(document).on("click", ".list-group-item", queryFromRecent);