// *** Variables  *** //

var links = document.querySelectorAll(".nav-link");
var sections = document.querySelectorAll(".app-section");
var input = document.getElementById("apod-date-input");
var spanDate = document.querySelector(".date-input-wrapper span");
var loadBtn = document.getElementById("load-date-btn");
// *** Aside *** //
for (var i = 0; i < links.length; i++) {
  links[i].addEventListener("click", function () {
    // 1- Remove active from all links
    for (var j = 0; j < links.length; j++) {
      links[j].classList.remove("bg-blue-500/10", "text-blue-400");
      links[j].classList.add("text-slate-300", "hover:bg-slate-800");
    }

    // 2- Add active to clicked link
    this.classList.add("bg-blue-500/10", "text-blue-400");
    this.classList.remove("text-slate-300", "hover:bg-slate-800");
    for (var k = 0; k < sections.length; k++) {
      sections[k].classList.add("hidden");
    }
    var targetSec = this.getAttribute("data-section");
    document.getElementById(`${targetSec}`).classList.remove("hidden");
  });
}

// *** Today Sections *** //

async function getData() {
  await getToday();
  await getLaunches();
  await getPlanets();
}
getData();
async function getToday() {
  var response = await fetch(
    "https://api.nasa.gov/planetary/apod?api_key=rShaKG8JaGDXN5jQdilMIgUyQS95N1FiSyqJ5gfQ&thumbs=true",
  );
  var data = await response.json();
  displayData(data);
}

async function getSpecificDay(date) {
  var response = await fetch(
    `https://api.nasa.gov/planetary/apod?api_key=rShaKG8JaGDXN5jQdilMIgUyQS95N1FiSyqJ5gfQ&date=${date}&thumbs=true`,
  );
  var data = await response.json();
  displayData(data);
}

// *** Display Data *** //

function displayData(data) {
  var date = formattedDate(data.date);
  document.getElementById("apod-date").textContent =
    `Astronomy Picture of the Day - ${date}`;
  document.getElementById("apod-date-input").value = data.date;
  document.querySelector(".date-input-wrapper span").textContent = date;
  // APOD can be a video. An <img> cannot render a video URL, so use NASA's
  // thumbnail for videos and the normal URL for images.
  var imageSource = data.media_type === "video" ? data.thumbnail_url : data.url;
  document.getElementById("apod-image").src =
    imageSource || "./assets/images/placeholder.webp";
  document.getElementById("apod-image").alt = data.title;
  document.getElementById("apod-title").textContent = data.title;
  document.getElementById("apod-date-detail").innerHTML = `<i
                      class="far fa-calendar mr-2"></i>${data.date}`;
  document.getElementById("apod-explanation").textContent = data.explanation;
  document.getElementById("apod-date-info").textContent = data.date;
  document.getElementById("apod-media-type").textContent = data.media_type;
}

function formattedDate(date) {
  var newDate = new Date(date);
  var formattedDate = newDate.toLocaleDateString("en-us", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return formattedDate;
}
input.addEventListener("change", function () {
  var dateSpan = formattedDate(input.value);
  spanDate.textContent = dateSpan;
});

loadBtn.addEventListener("click", async function () {
  await getSpecificDay(input.value);
});

document.getElementById("today-apod-btn").addEventListener("click", getToday);

// ** Launches ** //

async function getLaunches() {
  var response = await fetch(
    "https://ll.thespacedevs.com/2.3.0/launches/upcoming/?format=json&limit=10",
  );
  var data = await response.json();
  console.log(data);
  displayMainLaunches(data.results[0]);
  displayOtherLaunches(data.results);
}

function displayMainLaunches(data) {
  var info = prepareLaunches(data);
  var main = `<div
              class="relative bg-slate-800/30 border border-slate-700 rounded-3xl overflow-hidden group hover:border-blue-500/50 transition-all">
              <div
                class="absolute inset-0 bg-linear-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div class="relative grid grid-cols-1 lg:grid-cols-2 gap-6 p-8">
                <div class="flex flex-col justify-between">
                  <div>
                    <div class="flex items-center gap-3 mb-4">
                      <span
                        class="px-4 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold flex items-center gap-2">
                        <i class="fas fa-star"></i>
                        Featured Launch
                      </span>
                      <span
                        class=px-4 py-1.5 bg-${info.statusColor}-500/20 text-${info.statusColor}-400 rounded-full text-sm font-semibold>
                        ${info.status}
                      </span>
                    </div>
                    <h3 class="text-3xl font-bold mb-3 leading-tight">
                      ${info.name}
                    </h3>
                    <div
                      class="flex flex-col xl:flex-row xl:items-center gap-4 mb-6 text-slate-400">
                      <div class="flex items-center gap-2">
                        <i class="fas fa-building"></i>
                        <span>${info.provider}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <i class="fas fa-rocket"></i>
                        <span>${info.rocket}</span>
                      </div>
                    </div>
                    <div
                      class="inline-flex items-center gap-3 px-6 py-3 bg-linear-to-r from-blue-500/20 to-purple-500/20 rounded-xl mb-6">
                      <i class="fas fa-clock text-2xl text-blue-400"></i>
                      <div>
                        <p class="text-2xl font-bold text-blue-400">${info.days}</p>
                        <p class="text-xs text-slate-400">Days Until Launch</p>
                      </div>
                    </div>
                    <div class="grid xl:grid-cols-2 gap-4 mb-6">
                      <div class="bg-slate-900/50 rounded-xl p-4">
                        <p
                          class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                          <i class="fas fa-calendar"></i>
                          Launch Date
                        </p>
                        <p class="font-semibold">${info.launchDate}</p>
                      </div>
                      <div class="bg-slate-900/50 rounded-xl p-4">
                        <p
                          class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                          <i class="fas fa-clock"></i>
                          Launch Time
                        </p>
                        <p class="font-semibold">${info.launchTime}</p>
                      </div>
                      <div class="bg-slate-900/50 rounded-xl p-4">
                        <p
                          class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                          <i class="fas fa-map-marker-alt"></i>
                          Location
                        </p>
                        <p class="font-semibold text-sm">${info.location}</p>
                      </div>
                      <div class="bg-slate-900/50 rounded-xl p-4">
                        <p
                          class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                          <i class="fas fa-globe"></i>
                          ${info.country}
                        </p>
                        <p class="font-semibold">USA</p>
                      </div>
                    </div>
                    <p class="text-slate-300 leading-relaxed mb-6">
                      ${info.desc}
                    </p>
                  </div>
                  <div class="flex flex-col md:flex-row gap-3">
                    <button
                      class="flex-1 self-start md:self-center px-6 py-3 bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors font-semibold flex items-center justify-center gap-2">
                      <i class="fas fa-info-circle"></i>
                      View Full Details
                    </button>
                    <div class="icons self-end md:self-center">
                      <button
                        class="px-4 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors">
                        <i class="far fa-heart"></i>
                      </button>
                      <button
                        class="px-4 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors">
                        <i class="fas fa-bell"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="relative">
                  <div
                    class="relative h-full min-h-[400px] rounded-2xl overflow-hidden bg-slate-900/50">
                    <!-- Placeholder image/icon since we can't load external images reliably without correct URLs -->
                    <div
                      class="flex items-center justify-center h-full min-h-[400px] bg-slate-800">
                        <img src=${info.image} alt ="rocket-image" class="w-full h-full"/>
                      </div>
                    <div
                      class="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent"></div>
                  </div>
                </div>
              </div>
            </div>`;
  document.getElementById("featured-launch").innerHTML = main;
}

function displayOtherLaunches(results) {
  var container = "";
  for (var i = 1; i < results.length; i++) {
    var info = prepareLaunches(results[i]);
    container += `<div
              class="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group cursor-pointer">
              <div
                class="relative h-48 bg-slate-900/50 flex items-center justify-center">
                <img src=${info.image} alt ="rocket-image" class="w-full h-full"/>
                <div class="absolute top-3 right-3">
                  <span
                    class="px-3 py-1 bg-${info.statusColor}-500/90 text-white backdrop-blur-sm rounded-full text-xs font-semibold">
                    ${info.status}
                  </span>
                </div>
              </div>
              <div class="p-5">
                <div class="mb-3">
                  <h4
                    class="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                    ${info.name}
                  </h4>
                  <p class="text-sm text-slate-400 flex items-center gap-2">
                    <i class="fas fa-building text-xs"></i>
                    ${info.provider}
                  </p>
                </div>
                <div class="space-y-2 mb-4">
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-calendar text-slate-500 w-4"></i>
                    <span class="text-slate-300">${info.launchDate}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-clock text-slate-500 w-4"></i>
                    <span class="text-slate-300"> ${info.launchTime}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-rocket text-slate-500 w-4"></i>
                    <span class="text-slate-300">${info.rocket}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-map-marker-alt text-slate-500 w-4"></i>
                    <span class="text-slate-300 line-clamp-1">${info.location}</span>
                  </div>
                </div>
                <div
                  class="flex items-center gap-2 pt-4 border-t border-slate-700">
                  <button
                    class="flex-1 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-sm font-semibold">
                    Details
                  </button>
                  <button
                    class="px-3 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                    <i class="far fa-heart"></i>
                  </button>
                </div>
              </div>
            </div>`;
  }
  document.getElementById("launches-grid").innerHTML = container;
}

function prepareLaunches(launche) {
  var name = launche.name;
  var provider = launche.launch_service_provider.name;
  var rocket = launche.rocket.configuration.name;
  var tipDate = new Date(launche.net);
  var diff = tipDate - new Date();
  var days = Math.ceil(diff / (24 * 60 * 60 * 1000));
  var launchDate = tipDate.toLocaleDateString("en-us", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  var launchTime =
    tipDate.toLocaleTimeString("en-us", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    }) + "UTC";
  var location = launche.pad.location.name;
  var country = launche.pad.country.name;
  var image = launche.image.image_url;
  var status = launche.status.abbrev;
  var statusColor = {
    Go: "green",
    TBD: "red",
    TBC: "yellow",
  }[status];
  var desc = launche.status.description;
  return {
    name,
    provider,
    rocket,
    tipDate,
    diff,
    days,
    launchDate,
    launchTime,
    location,
    country,
    image,
    status,
    statusColor,
    desc,
  };
}

// *** Planets *** //

async function getPlanets() {
  var response = await fetch(
    "https://solar-system-opendata-proxy.vercel.app/api/planets",
  );

  var data = await response.json();
  console.log(data);
  displayPlanets(data.bodies);
  displayPlanetData(data.bodies[6]);
  displayComparison(data.bodies);
}

var color = {
  mercury: "#eab308",
  venus: "#f97316",
  earth: "#3b82f6",
  mars: "#ef4444",
  jupiter: "#fb923c",
  saturn: "#facc15",
  uranus: "#06b6d4",
  neptune: "#2563eb",
};

var image = {
  mercury: "./assets/images/mercury.png",
  venus: "./assets/images/venus.png",
  earth: "./assets/images/earth.png",
  mars: "./assets/images/mars.png",
  jupiter: "./assets/images/jupiter.png",
  saturn: "./assets/images/saturn.png",
  uranus: "./assets/images/uranus.png",
  neptune: "./assets/images/neptune.png",
};

function displayPlanets(planets) {
  var container = "";
  for (var i = 0; i < planets.length; i++) {
    container += `<div
              class="planet-card bg-slate-800/50 border border-slate-700 rounded-2xl p-4 transition-all cursor-pointer group"
              data-planet-id="${planets[i].englishName.toLowerCase()}"
              style="--planet-color: ${color[planets[i].englishName.toLowerCase()]}"
              onmouseover="this.style.borderColor='${color[planets[i].englishName.toLowerCase()]}80'"
              onmouseout="this.style.borderColor='#334155'">
              <div class="relative mb-3 h-24 flex items-center justify-center">
                <img
                  class="w-20 h-20 object-contain group-hover:scale-110 transition-transform"
                  src="${image[planets[i].englishName.toLowerCase()]}"
                  alt="${planets[i].englishName}" />
              </div>
              <h4 class="font-semibold text-center text-sm">${planets[i].englishName}</h4>
              <p class="text-xs text-slate-400 text-center">${(planets[i].semimajorAxis / 149597870.7).toFixed(2)} AU</p>
            </div>`;
  }
  document.getElementById("planets-grid").innerHTML = container;
  var planetsCards = document.querySelectorAll(".planet-card");
  planetsCards.forEach((planet) => {
    planet.addEventListener("click", () => {
      var targetPlanet = planet.getAttribute("data-planet-id");
      var selectorPlanet = "";
      for (var i = 0; i < planets.length; i++) {
        if (planets[i].englishName.toLowerCase() === targetPlanet) {
          selectorPlanet = planets[i];
        }
      }
      displayPlanetData(selectorPlanet);
    });
  });
}

function displayPlanetData(planet) {
  var info = preparePlanets(planet);
  var container = `<div
              class="xl:col-span-2 bg-slate-800/50 border border-slate-700 rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8">
              <div
                class="flex flex-col xl:flex-row xl:items-start space-y-4 xl:space-y-0">
                <div
                  class="relative h-48 w-48 md:h-64 md:w-64 shrink-0 mx-auto xl:mr-6">
                  <img
                    id="planet-detail-image"
                    class="w-full h-full object-contain"
                    src="${image[info.name.toLowerCase()]}"
                    alt="${info.desc}" />
                </div>
                <div class="flex-1">
                  <div class="flex items-center justify-between mb-3 md:mb-4">
                    <h3
                      id="planet-detail-name"
                      class="text-2xl md:text-3xl font-space font-bold">
                      ${info.name}
                    </h3>
                    <button
                      class="w-10 h-10 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                      <i class="far fa-heart"></i>
                    </button>
                  </div>
                  <p
                    id="planet-detail-description"
                    class="text-slate-300 mb-4 md:mb-6 leading-relaxed text-sm md:text-base">
                    ${info.desc}
                  </p>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-2 md:gap-4 mt-4">
                <div class="bg-slate-900/50 rounded-lg p-3 md:p-4">
                  <p
                    class="text-xs text-slate-400 mb-1 flex items-center gap-1">
                    <i class="fas fa-ruler text-xs"></i>
                    <span class="text-xs">Semimajor Axis</span>
                  </p>
                  <p
                    id="planet-distance"
                    class="text-sm md:text-lg font-semibold">
                    ${info.semimajor} km
                  </p>
                </div>
                <div class="bg-slate-900/50 rounded-lg p-4">
                  <p
                    class="text-xs text-slate-400 mb-1 flex items-center gap-1">
                    <i class="fas fa-circle"></i>
                    Mean Radius
                  </p>
                  <p id="planet-radius" class="text-lg font-semibold">
                    ${info.raduis} km
                  </p>
                </div>
                <div class="bg-slate-900/50 rounded-lg p-4">
                  <p
                    class="text-xs text-slate-400 mb-1 flex items-center gap-1">
                    <i class="fas fa-weight"></i>
                    Mass
                  </p>
                  <p id="planet-mass" class="text-lg font-semibold">
                   ${info.massValue}  × 10²⁴${info.massPower} kg
                  </p>
                </div>
                <div class="bg-slate-900/50 rounded-lg p-4">
                  <p
                    class="text-xs text-slate-400 mb-1 flex items-center gap-1">
                    <i class="fas fa-compress"></i>
                    Density
                  </p>
                  <p id="planet-density" class="text-lg font-semibold">
                    ${info.density} g/cm³
                  </p>
                </div>
                <div class="bg-slate-900/50 rounded-lg p-4">
                  <p
                    class="text-xs text-slate-400 mb-1 flex items-center gap-1">
                    <i class="fas fa-sync-alt"></i>
                    Orbital Period
                  </p>
                  <p id="planet-orbital-period" class="text-lg font-semibold">
                    ${info.orbitalPeriod} days
                  </p>
                </div>
                <div class="bg-slate-900/50 rounded-lg p-4">
                  <p
                    class="text-xs text-slate-400 mb-1 flex items-center gap-1">
                    <i class="fas fa-redo"></i>
                    Rotation Period
                  </p>
                  <p id="planet-rotation" class="text-lg font-semibold">
                    ${info.rotationPeriod} hours
                  </p>
                </div>
                <div class="bg-slate-900/50 rounded-lg p-4">
                  <p
                    class="text-xs text-slate-400 mb-1 flex items-center gap-1">
                    <i class="fas fa-moon"></i>
                    Moons
                  </p>
                  <p id="planet-moons" class="text-lg font-semibold">${info.moons}</p>
                </div>
                <div class="bg-slate-900/50 rounded-lg p-4">
                  <p
                    class="text-xs text-slate-400 mb-1 flex items-center gap-1">
                    <i class="fas fa-arrows-alt-v"></i>
                    Gravity
                  </p>
                  <p id="planet-gravity" class="text-lg font-semibold">
                    ${info.gravity} m/s²
                  </p>
                </div>
              </div>
            </div>
            <div class="space-y-6">
              <div
                class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                <h4 class="font-semibold mb-4 flex items-center">
                  <i class="fas fa-user-astronaut text-purple-400 mr-2"></i>
                  Discovery Info
                </h4>
                <div class="space-y-3 text-sm">
                  <div
                    class="flex justify-between items-center py-2 border-b border-slate-700">
                    <span class="text-slate-400">Discovered By</span>
                    <span
                      id="planet-discoverer"
                      class="font-semibold text-right">${info.discoveredBy}
                      </span>
                  </div>
                  <div
                    class="flex justify-between items-center py-2 border-b border-slate-700">
                    <span class="text-slate-400">Discovery Date</span>
                    <span id="planet-discovery-date"
                      class="font-semibold">${info.discoveryDate}</span>
                  </div>
                  <div
                    class="flex justify-between items-center py-2 border-b border-slate-700">
                    <span class="text-slate-400">Body Type</span>
                    <span id="planet-body-type"
                      class="font-semibold">${info.type}</span>
                  </div>
                  <div class="flex justify-between items-center py-2">
                    <span class="text-slate-400">Volume</span>
                    <span id="planet-volume" class="font-semibold">${info.volValue}  × 10^${info.volPower}</span>
                  </div>
                </div>
              </div>
              <div
                class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                <h4 class="font-semibold mb-4 flex items-center">
                  <i class="fas fa-lightbulb text-yellow-400 mr-2"></i>
                  Quick Facts
                </h4>
                <ul id="planet-facts" class="space-y-3 text-sm">
                  <li class="flex items-start">
                    <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
                    <span class="text-slate-300">Mass: ${info.massValue}  × 10²⁴${info.massPower} kg
                      </span>
                  </li>
                  <li class="flex items-start">
                    <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
                    <span class="text-slate-300">Surface gravity: ${info.gravity} m/s²
                      </span>
                  </li>
                  <li class="flex items-start">
                    <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
                    <span class="text-slate-300"> Density: ${info.gravity} g/cm³
                      </span>
                  </li>
                  <li class="flex items-start">
                    <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
                    <span class="text-slate-300">Axial tilt: ${info.axialTilt}°
                    </span>
                  </li>
                </ul>
              </div>
              <div
                class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                <h4 class="font-semibold mb-4 flex items-center">
                  <i class="fas fa-satellite text-blue-400 mr-2"></i>
                  Orbital Characteristics
                </h4>
                <div class="space-y-3 text-sm">
                  <div
                    class="flex justify-between items-center py-2 border-b border-slate-700">
                    <span class="text-slate-400">Perihelion</span>
                    <span id="planet-perihelion" class="font-semibold">147.1M
                      km</span>
                  </div>
                  <div
                    class="flex justify-between items-center py-2 border-b border-slate-700">
                    <span class="text-slate-400">Aphelion</span>
                    <span id="planet-aphelion" class="font-semibold">152.1M
                      km</span>
                  </div>
                  <div
                    class="flex justify-between items-center py-2 border-b border-slate-700">
                    <span class="text-slate-400">Eccentricity</span>
                    <span id="planet-eccentricity"
                      class="font-semibold">0.0167</span>
                  </div>
                  <div
                    class="flex justify-between items-center py-2 border-b border-slate-700">
                    <span class="text-slate-400">Inclination</span>
                    <span id="planet-inclination"
                      class="font-semibold">0.00°</span>
                  </div>
                  <div
                    class="flex justify-between items-center py-2 border-b border-slate-700">
                    <span class="text-slate-400">Axial Tilt</span>
                    <span id="planet-axial-tilt"
                      class="font-semibold">23.44°</span>
                  </div>
                  <div
                    class="flex justify-between items-center py-2 border-b border-slate-700">
                    <span class="text-slate-400">Avg Temperature</span>
                    <span id="planet-temp" class="font-semibold">15°C</span>
                  </div>
                  <div class="flex justify-between items-center py-2">
                    <span class="text-slate-400">Escape Velocity</span>
                    <span id="planet-escape" class="font-semibold">11.2
                      km/s</span>
                  </div>
                </div>
              </div>
              <button
                class="w-full py-3 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors font-semibold">
                <i class="fas fa-book mr-2"></i>Learn More
              </button>
            </div>`;
  document.getElementById("planet-data").innerHTML = container;
}
function displayComparison(planets) {
  var container = "";
  for (var i = 0; i < planets.length; i++) {
    var info = preparePlanets(planets[i]);
    container += `<tr class="hover:bg-slate-800/30 transition-colors">
                      <td
                        class="px-4 md:px-6 py-3 md:py-4 sticky left-0 bg-slate-800 z-10">
                        <div class="flex items-center space-x-2 md:space-x-3">
                          <div
                            class="w-6 h-6 md:w-8 md:h-8 rounded-full flex-shrink-0"
                            style="background-color: ${color[info.name.toLowerCase()]}"></div>
                          <span
                            class="font-semibold text-sm md:text-base whitespace-nowrap">${info.name}</span>
                        </div>
                      </td>
                      <td
                        class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">
                        ${info.AU}
                      </td>
                      <td
                        class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">
                        ${info.raduis * 2}
                      </td>
                      <td
                        class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">
                        ${info.massForEarth}
                      </td>
                      <td
                        class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">
                        ${(info.orbitalPeriod / 365.25).toFixed(1)} years
                      </td>
                      <td
                        class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">
                        ${info.moons}
                      </td>
                      <td class="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                        <span
                          class="px-2 py-1 rounded text-xs bg-orange-500/50 text-orange-200">${info.type}</span>
                      </td>
                    </tr>`;
  }
  document.getElementById("planet-comparison-tbody").innerHTML = container;
}
function preparePlanets(planet) {
  var name = planet.englishName;
  var semimajor = planet.semimajorAxis;
  var AU = (semimajor / 149597870.7).toFixed(2);
  var raduis = planet.meanRadius;
  var massValue = planet.mass?.massValue ?? 0;
  var massPower = planet.mass?.massExponent ?? 0;
  var massForEarth = (
    (massValue * 10 ** massPower) /
    (5.97237 * 10 ** 24)
  ).toFixed(3);
  var volValue = planet.vol?.volValue ?? "N/A";
  var volPower = planet.vol?.volExponent ?? "";
  var density = planet.density ?? "N/A";
  var orbitalPeriod = planet.sideralOrbit ?? 0;
  var rotationPeriod = planet.sideralRotation ?? "N/A";
  // Mercury and Venus have no moons, and the API represents that as null.
  var moons = Array.isArray(planet.moons) ? planet.moons.length : 0;
  var gravity = planet.gravity ?? "N/A";
  var discoveredBy = planet.discoveredBy || "Known since antiquity";
  var discoveryDate = planet.discoveryDate || "Ancient times";
  var type = planet.type;
  var axialTilt = planet.axialTilt;
  var desc = planet.description;
  return {
    name,
    semimajor,
    AU,
    raduis,
    massValue,
    massPower,
    volValue,
    volPower,
    density,
    orbitalPeriod,
    rotationPeriod,
    moons,
    gravity,
    discoveredBy,
    discoveryDate,
    type,
    axialTilt,
    desc,
    massForEarth,
  };
}
