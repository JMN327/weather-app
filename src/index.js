import "./styles.css";
import storageAvailable from "./local-storage.js";
import ClassTemplate from "./class-template.js";

console.log("Hello World!)");
console.log(`Storage available: ${storageAvailable("localStorage")}`);



const img = document.querySelector("img");
const btn = document.querySelector("#btn");
let search = document.querySelector("#search");
let dateBox = document.querySelector("#date1");
btn.addEventListener("click", (event) => testing(event));
btn.addEventListener("click", fetchNewPic);

function fetchNewPic() {
  console.log("fetching weather...");
  let searchString
  console.log("date:" + dateBox.value, !dateBox.value)
  if (dateBox.value) {
    searchString =`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${search.value}/${dateBox.value}?key=TNK3W4F4DRB846HC8URN7GCNE`
  } else {
    searchString =`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${search.value}?key=TNK3W4F4DRB846HC8URN7GCNE&iconSet=icons1`
  }
  console.log(searchString)
  fetch(
    searchString,
    { mode: "cors" }
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      //img.style.display = "block";
      //img.src = response.data.images.original.url;
      console.log(response.days.map((day) =>(day.description)))
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


