var searchInput = $("#search-input");
var searchButton = $("#search-button");
var searchHistory = $("#search-history");
var weatherReport = $("#weather-report");
var weatherNow = $("#weather-now");
var weatherFiveDay = $("#weather-five-day");
var dateNow = moment().format('MM/DD/YYYY');
var tomorrow = moment().add(1,'days').format('MM/DD/YYYY');
console.log(dateNow);
console.log(tomorrow);

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
    // console.log(response);
    // console.log(response.weather[0].icon);

    
    var thisCity = $("<H3>").text(response.name + " " + "(" + moment().add(1,'days').format('MM/DD/YYYY') + ")" );
    var tempNow = $("<p>").text("Temperature: " + response.main.temp);
    var humidityNow = $("<p>").text("Humidity: " + response.main.humidity);
    var windSpeedNow = $("<p>").text("Wind Speed: " + response.wind.speed);
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
    // console.log(response);

    var uvIndex = $("<p>").text("UV Index: " + response.value);
    weatherNow.append(uvIndex);

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

    var forecastDate;
    var forecastIcon = $("<img>").attr("src", "http://openweathermap.org/img/wn/"+ response.list[0].weather[0].icon + "@2x.png");
    var forecastTemp = $("<p>").text("Temp: " + response.list[0].main.temp + " °F");
    var forecastHumidity = $("<p>").text("Humidity: " + response.list[0].main.humidity + " %");

    weatherFiveDay.html("");


    for (var i = 0; i < response.list.length; i += 8 ) {
      var newCard = $("<div>").addClass("col-xl card");
      var newCardLiner = $("<div>").addClass("card-body");



      newCardLiner.append(
        $("<p>").text(response.list[i].dt_txt),
        $("<img>").attr("src", "http://openweathermap.org/img/wn/"+ response.list[i].weather[0].icon + ".png"),
        $("<p>").text("Temp: " + response.list[i].main.temp + " °F"),
        $("<p>").text("Humidity: " + response.list[i].main.humidity + " %")
      );
      newCard.append(newCardLiner);
      weatherFiveDay.append(newCard);
  
    }

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
  searchHistory.show();
  getCurrentWeather(cityName);
  getForecast(cityName);
}

function queryFromRecent() {
  var cityName = $(this).attr("data-name");
  getCurrentWeather(cityName);
  getForecast(cityName);
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