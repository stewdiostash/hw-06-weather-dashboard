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

  function getLatLon(cityName) {
    
    var apiKey = "731e9f8a098503cff9f880ca0083adaa";
    var currentWeatherURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      cityName +
      "&appid=" +
      apiKey +
      "&units=imperial";

    $.ajax({
      url: currentWeatherURL,
      method: "GET",
    }).then(function (response) {
      console.log(response);

      var lat = response.coord.lat;
      var lon = response.coord.lon;

      getWeather(cityName, lat, lon);
      
    });
  }

  // function getCurrentUvi(lat, lon) {

  //   var apiKey = "731e9f8a098503cff9f880ca0083adaa";
  //   var currentUviURL =
  //     "https://api.openweathermap.org/data/2.5/uvi?lat=" +
  //     lat +
  //     "&lon=" +
  //     lon +
  //     "&appid=" +
  //     apiKey;

  //   $.ajax({
  //     url: currentUviURL,
  //     method: "GET",
  //   }).then(function (response) {

  //     var uvIndex = $("<p>").text("UV Index: " + response.value);
  //     weatherNow.append(uvIndex);

  //   });
  // }

  function getWeather(cityName, lat, lon) {
    var apiKey = "731e9f8a098503cff9f880ca0083adaa";

    var forecastURL =
      "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      lat + "&lon=" + lon +
      "&appid=" +
      apiKey +
      "&units=imperial";

    weatherNow.html("");

    $.ajax({
      url: forecastURL,
      method: "GET",
    }).then(function (response) {
      console.log(response);
    
      var thisCity = $("<H3>").text(cityName + " " + "(" + moment().format('MM/DD/YYYY') + ")" ).addClass("mb-1");
      var tempNow = $("<p>").text("Temperature: " + response.current.temp);
      var humidityNow = $("<p>").text("Humidity: " + response.current.humidity);
      var windSpeedNow = $("<p>").text("Wind Speed: " + response.current.wind_speed);
      var icon = $("<img>").attr("src", "http://openweathermap.org/img/wn/"+ response.current.weather[0].icon + "@2x.png");
      var uviIs = $("<p>").text("UV Index: ");
      var uvi = $("<span>").html("&nbsp&nbsp" + response.current.uvi + "&nbsp&nbsp").css("border-radius", "3px").css("color", "white");

      if (response.current.uvi >= 11) {
        uvi = uvi.css("background-color", "#AC5C9A");
      } else if (response.current.uvi >= 8 && response.current.uvi < 11 ) {
        uvi = uvi.css("background-color", "#E12C11");
      } else if (response.current.uvi >= 6 && response.current.uvi < 8 ) {
        uvi = uvi.css("background-color", "#EF8000");
      } else if (response.current.uvi >= 3 && response.current.uvi < 6 ) {
        uvi = uvi.css("background-color", "#FFF100").css("color", "black");
      } else {
        uvi = uvi.css("background-color", "#369D28");
      };

      uviIs.append(uvi);

      weatherNow.append(thisCity, icon, tempNow, humidityNow, windSpeedNow, uviIs);

      weatherFiveDay.html("");

      for (var i = 1; i < 6; i++ ) {
        var newCard = $("<div>").addClass("col-xl card");
        var newCardLiner = $("<div>").addClass("card-body");

        newCardLiner.append(
          $("<p>").text(moment().add(i,'days').format('MM/DD/YYYY')),
          $("<img>").attr("src", "http://openweathermap.org/img/wn/"+ response.daily[i].weather[0].icon + ".png"),
          $("<p>").text("Temp: " + response.daily[i].temp.max + " °F"),
          $("<p>").text("Humidity: " + response.daily[i].humidity + " %")
        );

        newCard.append(newCardLiner);
        weatherFiveDay.append(newCard);
      }
      weatherReport.show();
    });
  }

  function queryFromInput(event) {
    event.preventDefault();
    var cityName = $("#search-input").val().trim();

    if (cityName == "") {
      alert("Enter a city name")
    } else {
      recentSearches.unshift(cityName);
      localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
      addToRecent();
      console.log(cityName);
      searchHistory.show();
      getLatLon(cityName);
    }
  }

  function queryFromRecent() {
    var cityName = $(this).attr("data-name");
    getLatLon(cityName);
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