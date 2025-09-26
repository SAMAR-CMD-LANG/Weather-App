const API_KEY = process.env.API_KEY;
const searchBtn=document.getElementById("search-btn");
const cityInput=document.getElementById("city-input");
const currentWeatherDiv=document.getElementById("current-weather");
const forecastDiv=document.getElementById("forecast");


//event listener for search button
searchBtn.addEventListener("click",()=>{
    const city=cityInput.value.trim();
    if (city !==""){
        fetchWeather(city);
    }
});
 

async function fetchWeather(city){
  // Clear old content & show loader
    currentWeatherDiv.innerHTML = "";
    forecastDiv.innerHTML = "";
    const loader = document.createElement("div");
    loader.className = "loader";
    loader.innerHTML = `<div class="spinner"></div>`;
    currentWeatherDiv.appendChild(loader);

    // Artificial delay to see loader (optional)
    await new Promise((resolve) => setTimeout(resolve, 4000));

    try{
       await new Promise((resolve)=>{
        setTimeout(resolve,4000);

    });

        const weatherRes=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const weatherData=await weatherRes.json();
        const forecastRes=await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`);
        const forecastData=await forecastRes.json();
        
           // Remove loader before displaying data
    currentWeatherDiv.innerHTML = "";
    forecastDiv.innerHTML = "";

        displayCurrentWeather(weatherData);
        displayForecast(forecastData);
        console.log("data fetch successful");
    }
    catch(error){
        currentWeatherDiv.innerHTML=`<p class="error">Error fetching weather data. Please try again.</p>`;
        forecastDiv.innerHTML="";
}
}

function displayCurrentWeather(data){
    currentWeatherDiv.innerHTML=`
    <h3>${data.name},${data.sys.country}</h3>
    <p class="title">Weather condition:</p>
    <p class="temp">🌡 Temp:  ${data.main.temp} °C</p>
    <p class="condition">☁ Condition: ${data.weather[0].description}
    <img class="currentimg" src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" />
    </p>
    `;
}
function displayForecast(data) {
  forecastDiv.innerHTML = "";

  // Filter the list so we only keep the forecasts at 12:00:00 (noon) each day
  const forecastList = data.list.filter(function(item) {
    // Get the time string for this forecast (e.g. "2025-09-19 12:00:00")
    const forecastTime = item.dt_txt;

    // Check if the string includes "12:00:00"
    const isNoonForecast = forecastTime.includes("12:00:00");

    if (isNoonForecast) {
      // ✅ Keep this item in the new list
      return true;
    } else {
      // ❌ Discard this item
      return false;
    }
  });

  // Now loop through the filtered list and display each day's forecast
  forecastList.forEach(function(day) {
    const date = new Date(day.dt_txt).toDateString();
    

    forecastDiv.innerHTML += `
      <div class="forecast-day">
        <h4>${date}</h4>
        <p>🌡 ${day.main.temp} °C</p>
        <p>${day.weather[0].description}</p>
        <img  src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" />
      </div>
    `;
    console.log(forecastDiv);
    })
}