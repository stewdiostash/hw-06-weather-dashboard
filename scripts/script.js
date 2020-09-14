var searchInput = $("#search-input");
var searchButton = $("#search-button");
var searchHistory = $("#search-history");
var weatherNow = $("#weather-now");
var weatherFiveDay = $("#weather-five-day");
// var recentSearches = [];

var recentSearches = JSON.parse(localStorage.getItem("recentSearches"));

loadSavedRecent();

function queryFromRecent() {
  console.log($(this).attr("data-name"));
  var cityName = $(this).attr("data-name");

  var apiKey = "731e9f8a098503cff9f880ca0083adaa";
  var currentWeatherURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&appid=" +
    apiKey +
    "&units=imperial";
  var fiveDayWeatherURL =
    "https:///api.openweathermap.org/data/2.5/forecast?q=" +
    cityName +
    "&appid=" +
    apiKey +
    "&units=imperial";
  // var currentUvi = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon" + lon + "&appid=" + apiKey;

  // currentWeather();

  weatherNow.html("");

  $.ajax({
    url: currentWeatherURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);

    var thisCity = $("<H3>").text(response.name + " " + response.dt);
    var tempNow = $("<p>").text("Temperature: " + response.main.temp);
    var humidityNow = $("<p>").text("Humidity: " + response.main.humidity);
    var windSpeedNow = $("<p>").text("Wind Speed: " + response.wind.speed);
    var uvIndex = "UV Index: ";
    var lat = response.coord.lat;
    var lon = response.coord.lon;

    weatherNow.append(thisCity, tempNow, humidityNow, windSpeedNow, uvIndex);
  });
}

$(document).on("click", ".list-group-item", queryFromRecent);

function loadSavedRecent() {
  if (recentSearches) {
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

$("#search-button").on("click", function (event) {
  event.preventDefault();

  var cityName = $("#search-input").val().trim();

  recentSearches.unshift(cityName);
  localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
  addToRecent();
  console.log(cityName);

  var apiKey = "731e9f8a098503cff9f880ca0083adaa";
  var currentWeatherURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&appid=" +
    apiKey +
    "&units=imperial";
  var fiveDayWeatherURL =
    "https:///api.openweathermap.org/data/2.5/forecast?q=" +
    cityName +
    "&appid=" +
    apiKey +
    "&units=imperial";
  // var currentUvi = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon" + lon + "&appid=" + apiKey;

  // currentWeather();

  weatherNow.html("");

  $.ajax({
    url: currentWeatherURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);

    var thisCity = $("<H3>").text(response.name + " " + response.dt);
    var tempNow = $("<p>").text("Temperature: " + response.main.temp);
    var humidityNow = $("<p>").text("Humidity: " + response.main.humidity);
    var windSpeedNow = $("<p>").text("Wind Speed: " + response.wind.speed);
    var uvIndex = "UV Index: ";
    var lat = response.coord.lat;
    var lon = response.coord.lon;

    weatherNow.append(thisCity, tempNow, humidityNow, windSpeedNow, uvIndex);
  });
});

function getDate(unixTimestamp) {
  var date = new Date(unixTimestamp * 1000);
  var month = date.getMonth();
  var day = date.getDay();
  var year = date.getFullYear();

  console.log(month + "/" + day + "/" + year);
  return month + "/" + day + "/" + year;
}

function currentWeather() {
  $.ajax({
    url: currentWeatherURL,
    method: "GET",
  }).then(function (response) {
    var thisCity = $("<H3>").text(response.name + response.dt);
    // var thisDate = $("<H3>").text(response.dt);
    // var cityDate = thisCity + thisDate;
    var tempNow = $("<p>").text("Temperature: " + response.main.temp);
    var humidityNow = $("<p>").text("Humidity: " + response.main.humidity);
    var windSpeedNow = $("<p>").text("Wind Speed: " + response.wind.speed);
    var uvIndex = "UV Index: ";
    var lat = response.coord.lat;
    var lon = response.coord.lon;

    // var name = response.name;
    // var temp = response.main.temp;
    // var humidity = response.main.humidity;
    // var wind = response.wind.speed;

    weatherNow.append(thisCity, tempNow, humidityNow, windSpeedNow, uvIndex);

    console.log(response);
    // console.log(name);
    // console.log(temp);
    // console.log(humidity);
    // console.log(wind);
    // console.log(lat);
    // console.log(lon);
  });
}

// function currentUvi() {
//     $.ajax({
//         url: currentUviURL,
//         method: "GET"
//       }).then(function(response) {

//         var lat;
//         var long;
//         var uvIndex;

//         console.log(response);

//       });
// }

// function fiveDayWeather(cityName) {
//     $.ajax({
//         url: fiveDayWeatherURL,
//         method: "GET"
//       }).then(function(response) {

//         var thisCity = cityName;
//         var dayOne = response;

//         console.log(response);
//         console.log(response.list);

//       });
// }

// fiveDayWeather("Atlanta");
