import "./styles.css";
import { add, format } from "date-fns";
import storageAvailable from "./local-storage.js";
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
console.log(`Storage available: ${storageAvailable("localStorage")}`);

const btn = document.querySelector("#btn");
let search = document.querySelector("#search");
let dateBox = document.querySelector("#date1");
let resultContents = document.querySelector(".result-contents");
btn.addEventListener("click", (event) => testing(event));
btn.addEventListener("click", fetchWeather);

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function dayData(APIResponse) {
  const dayCount = APIResponse.days.length;
  const date = APIResponse.days.map((day) => format(day.datetime, "EEE do"));
  const conditions = APIResponse.days.map((day) => day.conditions);
  const description = APIResponse.days.map((day) => `${day.description}`);
  const icon = APIResponse.days.map((day) => day.icon);
  const temp = APIResponse.days.map((day) => day.temp);
  const tempmax = APIResponse.days.map((day) => day.tempmax);
  const tempmin = APIResponse.days.map((day) => day.tempmin);
  const winddir = APIResponse.days.map((day) => day.winddir);
  const windspeed = APIResponse.days.map((day) => day.windspeed);
  const sunrise = APIResponse.days.map((day) => day.sunrise);
  const sunset = APIResponse.days.map((day) => day.sunset);

  return {
    dayCount,
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
    console.log("date:" + dateBox.value, !dateBox.value);
    if (dateBox.value) {
      searchString = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${search.value}/${dateBox.value}?key=TNK3W4F4DRB846HC8URN7GCNE`;
    } else {
      searchString = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${search.value}?key=TNK3W4F4DRB846HC8URN7GCNE&iconSet=icons1`;
    }
    const responsePromise = await fetch(searchString, { mode: "cors" });
    const response = await responsePromise.json();
    console.log(response);
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
  removeAllChildNodes(resultContents);
  let data = dayData(response);
  console.log(data);
  for (let i = 0; i < data.dayCount; i++) {
    let day = addBasicElement("div", "day", resultContents);
    let date = addBasicElement("div", "day__date", day, data.date[i]);
    let description = addBasicElement(
      "div",
      "day__description",
      day,
      data.description[i]
    );
    let graphics = addBasicElement("div", "day__graphics", day)
    let icon = addBasicElement("img", "day__icon", graphics);
    icon.src = getIcon(data.icon[i]);
    let temp = addBasicElement("div", "day__temp", graphics, fahrenheitToCelsius(data.temp[i]) );
    
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
