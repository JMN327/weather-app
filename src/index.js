import "./styles.css";
import { add, format } from "date-fns";
import storageAvailable from "./storage-available.js";
//import ClassTemplate from "./class-template.js";
import gifCloudy from "./gifs/cloudy.gif";
import gifClearDay from "./gifs/clear-day.gif";
import gifClearNight from "./gifs/clear-night.gif";
import gifFog from "./gifs/fog.gif";
import gifPartlyCloudyDay from "./gifs/partly-cloudy-day.gif";
import gifPartlyCloudyNight from "./gifs/partly-cloudy-night.gif";
import gifRain from "./gifs/rain.gif";
import gifSnow from "./gifs/snow.gif";
import gifWind from "./gifs/wind.gif";

console.log("Hello World!)");
console.log(`Local storage available: ${storageAvailable("localStorage")}`);
console.log(`Session storage available: ${storageAvailable("sessionStorage")}`);

const btn = document.querySelector("#btn");
let search = document.querySelector("#search");
let dateBox1 = document.querySelector("#date1");
let dateBox2 = document.querySelector("#date2");
let result = document.querySelector(".result");
btn.addEventListener("click", (event) => testing(event));
btn.addEventListener("click", fetchWeather);

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function dayData(APIResponse) {
  const dayCount = APIResponse.days.length;
  const resolvedAddress = APIResponse.resolvedAddress;
  const date = APIResponse.days.map((day) => format(day.datetime, "EEE do"));
  const conditions = APIResponse.days.map((day) => day.conditions);
  const description = APIResponse.days.map((day) => `${day.description}`);
  const icon = APIResponse.days.map((day) => day.icon);
  const temp = APIResponse.days.map((day) => day.temp);
  const averageTemp =
  temp.reduce(function (sum, value) {
      return sum + value;
    }, 0) / temp.length;
  const tempmax = APIResponse.days.map((day) => day.tempmax);
  const tempmin = APIResponse.days.map((day) => day.tempmin);
  const winddir = APIResponse.days.map((day) => day.winddir);
  const windspeed = APIResponse.days.map((day) => day.windspeed);
  const sunrise = APIResponse.days.map((day) => day.sunrise);
  const sunset = APIResponse.days.map((day) => day.sunset);

  return {
    dayCount,
    resolvedAddress,
    averageTemp,
    date,
    conditions,
    description,
    icon,
    temp,
    tempmax,
    tempmin,
    winddir,
    windspeed,
    sunrise,
    sunset,
  };
}

function fahrenheitToCelsius(fahrenheit) {
  const celsius = `${Math.round((fahrenheit - 32) * (5 / 9))}℃`;
  return celsius;
}

function testing(event) {
  console.log("test:", search.value);
}

async function fetchWeather() {
  console.log("fetching pic async...");

  try {
    let searchString;
    console.log("date:" + dateBox1.value, !dateBox1.value);
    if (dateBox1.value) {
      if (dateBox2.value) {
        searchString = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${search.value}/${dateBox1.value}/${dateBox2.value}?key=TNK3W4F4DRB846HC8URN7GCNE`;
      } else {
        searchString = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${search.value}/${dateBox1.value}?key=TNK3W4F4DRB846HC8URN7GCNE`;
      }
    } else {
      searchString = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${search.value}?key=TNK3W4F4DRB846HC8URN7GCNE&iconSet=icons1`;
    }

    let response;
    const sessionData = sessionStorage.getItem(searchString);
    if (sessionData) {
      console.log("data retrieved from session storage");
      response = JSON.parse(sessionData);
      console.log(response);
    } else {
      console.log("data retrieved from visual crossing API");
      const responsePromise = await fetch(searchString, { mode: "cors" });
      response = await responsePromise.json();
      sessionStorage.setItem(searchString, JSON.stringify(response));
      console.log(response);
    }

    displayWeather(response);
  } catch (error) {
    console.log(error);
  }
}

function addBasicElement(
  tag = "div",
  classes = [],
  parent = null,
  textContent = ""
) {
  let element = document.createElement(tag);
  element.classList.add(classes);
  if (textContent) {
    element.textContent = textContent;
  }
  if (parent) {
    parent.appendChild(element);
  }
  return element;
}

function displayWeather(response) {
  removeAllChildNodes(result);
  let data = dayData(response);
  let place = addBasicElement(
    "div",
    "result__place",
    result,
    data.resolvedAddress
  );
  console.log("av. temp.: " + data.averageTemp)
  place.style.borderTopColor = `hsl(${getHue(data.averageTemp)},60%,86%)`;
  place.style.borderLeftColor = `hsl(${getHue(data.averageTemp)},60%,81%)`;
  place.style.borderRightColor = `hsl(${getHue(data.averageTemp)},60%,81%)`;
  place.style.borderBottomColor = `hsl(${getHue(data.averageTemp)},60%,75%)`;

  let resultContents = addBasicElement("div", "result__contents", result);
  for (let i = 0; i < data.dayCount; i++) {
    let day = addBasicElement("div", "day", resultContents);
    day.style.borderTopColor = `hsl(${getHue(data.temp[i])},60%,86%)`;
    day.style.borderLeftColor = `hsl(${getHue(data.temp[i])},60%,81%)`;
    day.style.borderRightColor = `hsl(${getHue(data.temp[i])},60%,81%)`;
    day.style.borderBottomColor = `hsl(${getHue(data.temp[i])},60%,75%)`;
    let date = addBasicElement("div", "day__date", day, data.date[i]);
    let description = addBasicElement(
      "div",
      "day__description",
      day,
      data.description[i]
    );
    let graphics = addBasicElement("div", "day__graphics", day);
    let icon = addBasicElement("img", "day__icon", graphics);
    icon.src = getIcon(data.icon[i]);
    icon.style.borderColor = `hsl(${getHue(data.temp[i])},60%,75%)`;
    //console.table({hue: getHue(data.temp[i]),temp:data.temp[i]})
    let temps = addBasicElement("div", "day__temps", graphics);
    let tempmax = addBasicElement(
      "div",
      "day__tempmax",
      temps,
      fahrenheitToCelsius(data.tempmax[i])
    );
    let tempmin = addBasicElement(
      "div",
      "day__tempmin",
      temps,
      fahrenheitToCelsius(data.tempmin[i])
    );
  }
}

function getIcon(iconData) {
  switch (iconData) {
    case "cloudy":
      return gifCloudy;
      break;
    case "clear-day":
      return gifClearDay;
      break;
    case "clear-night":
      return gifClearNight;
      break;
    case "fog":
      return gifFog;
      break;
    case "partly-cloudy-day":
      return gifPartlyCloudyDay;
      break;
    case "partly-cloudy-night":
      return gifPartlyCloudyNight;
      break;
    case "rain":
      return gifRain;
      break;
    case "snow":
      return gifSnow;
      break;
    case "wind":
      return gifWind;
      break;
    default:
      break;
  }
}

function getHue(nowTemp) {
  var maxHsl = 0; // maxHsl maps to max temp (here: 20deg past 360)
  var minHsl = 210; //  minhsl maps to min temp counter clockwise
  var rngHsl = maxHsl - minHsl; // = 170

  var maxTemp = 77;
  var minTemp = 28;
  var rngTemp = maxTemp - minTemp; // 125
  var degCnt = maxTemp - nowTemp; // 0
  var hslsDeg = rngHsl / rngTemp; //170 / 125 = 1.68 Hsl-degs to Temp-degs
  var returnHue = 360 - (degCnt * hslsDeg - (maxHsl - 360));
  returnHue = Math.max(maxHsl, returnHue);
  returnHue = Math.min(minHsl, returnHue);
  return returnHue;
}
