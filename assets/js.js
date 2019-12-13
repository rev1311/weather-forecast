$(function() {

var momentJs = moment().format('(MM / DD / YYYY)');


if (!localStorage.getItem("userHistory")) {
    var userHistory = [];
} else {
    var userHistory = JSON.parse(localStorage.getItem("userHistory"));
}


currentCity();


$("#newCityBtn").on("click", function() {
    event.preventDefault();
    var newCity = $("#input").val();
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + newCity +"&APPID=a9cb1a256ff4757d9f731b125d92cbce";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        currentWeather(response);
        uvIndex(response);
        fiveDay(response)
        console.log(response)
        var imgSrc = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + response.list[0].weather[0].icon + "@2x.png");
        $("#city").append(imgSrc);
    });

    userHistory.push(newCity);
    saveToLocal();
    currentCity();
});

// on click to recall history city, query API
$(document).on("click", ".cityBtn", function() {
    event.preventDefault();
    var userCity = $(this).val();
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + userCity +"&APPID=a9cb1a256ff4757d9f731b125d92cbce";
                    
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        currentWeather(response);
        uvIndex(response);
        fiveDay(response)
    });
});

function currentWeather(response) {
    $("#currentWeather").empty();
    var temp = (((response.main.temp - 273.15) * 1.8) + 32).toFixed(1);
    var humid = response.main.humidity;
    var wind = response.wind.speed;
console.log(temp);
    $("#city").text(`${response.name} ${momentJs}`);
    $("#temp").text(`Temperature: ${temp}`);
    $("#humid").text(`Humidity: ${humid}`);
    $("#wind").text(`Wind Speed: ${wind}`);
}

function uvIndex(response) {
    var lat = response.coord.lat;
    var lon = response.coord.lon;
    var queryURL ="http://api.openweathermap.org/data/2.5/uvi?APPID=a9cb1a256ff4757d9f731b125d92cbce&lat=" + lat + "&lon=" + lon;
  
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {  
      var uvIndex = response.value;
      $("#uvIndex").text(`UV index: ${uvIndex}`);
    });
}

function currentCity() {
    $("#cityHistory").empty();
    for (var i = 0; i < userHistory.length; i++) {
        var cityBtn = $("<button>").addClass("cityBtn").attr("value", userHistory[i]).text(userHistory[i]);
console.log(userHistory[i])
        $("#cityHistory").prepend(cityBtn);
    }
}


function fiveDay(response) {
    $("#fiveDay").empty();
    
    var lat = response.coord.lat;
    var lon = response.coord.lon;
    var queryURL ="http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&APPID=a9cb1a256ff4757d9f731b125d92cbce";
    
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        console.log(response)
        for (var i = 0; i < response.list.length; i += 8) {
        
        var card = $("<div>").addClass("card");
        var img = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + response.list[i.toString()].weather[0].icon + "@2x.png");
        var textF = (((response.list[i.toString()].main.temp - 273.15) * 1.8) + 32).toFixed(1);
        var text = $("<p>").text(`Temperature: ${textF} F`);
        var humis = $("<p>").text(`Humidity: ${response.list[i.toString()].main.humidity}`);
        var days = moment(momentJs).add(1, 'days');
        
        var date = moment(days++).format('MM / DD / YYYY');
        var datePlus = momentJs;
        console.log(momentJs[i])
       
        
        card.append(date);
        card.append(img);
        card.append(text);
        card.append(humis);
        $("#fiveDay").prepend(card);
        }
    });
}



function saveToLocal() {
    localStorage.setItem("userHistory", JSON.stringify(userHistory));
}


});






