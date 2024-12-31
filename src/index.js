import "./styles.css";
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
  const conditions = APIResponse.days.map((day) => day.conditions);
  const description = APIResponse.days.map((day) => day.description);
  const icon = APIResponse.days.map((day) => day.icon);
  const temp = APIResponse.days.map((day) => day.temp);
  const tempmax = APIResponse.days.map((day) => day.tempmax);
  const tempmin = APIResponse.days.map((day) => day.tempmin);
  const winddir = APIResponse.days.map((day) => day.winddir);
  const windspeed = APIResponse.days.map((day) => day.windspeed);
  const sunrise = APIResponse.days.map((day) => day.sunrise);
  const sunset = APIResponse.days.map((day) => day.sunset);

  return {
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
    displayWeather(response);
  } catch (error) {
    console.log(error);
  }
}

function addElement(tag = "div", classes = [], parent = null) {
  let element = document.createElement(tag);
  element.classList.add(classes);
  if (parent) {
    parent.appendChild(element);
  }
  return element;
}

function displayWeather(response) {
  removeAllChildNodes(resultContents);
  let data = dayData(response);
  let day = addElement("div", "day", resultContents);
  let icon = addElement("img", "day-icon", resultContents);
  icon.src = getIcon(data.icon[0]);
  icon.style.width = "6rem";
  icon.style.aspectRatio = 1;
  day.textContent = data.description[0];
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
