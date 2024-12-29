import "./styles.css";
import storageAvailable from "./local-storage.js";
import ClassTemplate from "./class-template.js";

console.log("Hello World!)");
console.log(`Storage available: ${storageAvailable("localStorage")}`);



const img = document.querySelector("img");
const btn = document.querySelector("#btn");
let search = document.querySelector("#search");
btn.addEventListener("click", (event) => testing(event));
btn.addEventListener("click", fetchNewPic);

function fetchNewPic() {
  console.log("fetching pic...");
  fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${search.value}?key=TNK3W4F4DRB846HC8URN7GCNE`,
    { mode: "cors" }
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      //img.style.display = "block";
      //img.src = response.data.images.original.url;
      console.log(response)
    });
}

function testing(event) {
  console.log("test:", search.value);
}

async function fetchNewPicAA() {
  console.log("fetching pic async...");

  try {
    const responsePromise = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${search.value}?key=TNK3W4F4DRB846HC8URN7GCNE`,
      { mode: "cors" }
    );
    const response = await responsePromise.json();
    img.style.display = "block";
    img.src = response.data.images.original.url;
  } catch (error) {
    console.log(error)
  }

}


