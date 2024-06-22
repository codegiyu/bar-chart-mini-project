console.log({countries: countries_data});

const body = document.body;
const subtitleEl = document.querySelector(".subtitle");
const sortBtns = document.querySelectorAll(".btn.sort-btn");
const goToGraphBtn = document.querySelector(".go-to-graph-btn");
const countriesWrapper = document.querySelector(".countries-wrap");
const graphSection = document.querySelector(".graph-section");
const languagesBtn = document.querySelector(".languages");
const populationBtn = document.querySelector(".population");
const graphTitleEl = document.querySelector(".graph-title");
const graphBtns = document.querySelectorAll(".btn.graph-btn");
const graphWrapper = document.querySelector(".graph-wrapper");

let filteredCountries = [...countries_data];

body.onload = () => {
    subtitleEl.innerHTML = `Currently, we have ${countries_data.length} countries`;
    displayCountryCards(filteredCountries);
    showLanguages();

    sortBtns.forEach(btn => {
        btn.addEventListener("click", sortCountries);
    });
    goToGraphBtn.addEventListener("click", goToGraph);
    
    graphBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const type = e.target.getAttribute("data-btn");
            console.log({type});
            type === "languages" ? showLanguages() : showPopulation();
        })
    })
}

function showLanguages() {
    populationBtn.classList.remove("active");
    languagesBtn.classList.add("active");
    graphTitleEl.innerHTML = "10 most spoken languages in the world";

    const sortedLanguages = countLanguages().slice(0, 10);
    console.log({sortedLanguages});
    populateGraph(sortedLanguages);
}

function showPopulation() {
    languagesBtn.classList.remove("active");
    populationBtn.classList.add("active");
    graphTitleEl.innerHTML = "10 most populated countries in the world";

    const sortedPopulation = countPopulation().slice(0, 11);
    console.log({sortedPopulation});
    populateGraph(sortedPopulation);
}

function countLanguages() {
    const languages = filteredCountries.map(item => item.languages).flat();
    let count = {};
  
    for (const language of languages) {
      if (count[language]) {
        count[language]++;
      } else {
        count[language] = 1;
      }
    }

    const sorted = Object.entries(count).sort((a,b) => b[1] - a[1]);
    const maxValue = getMaxScale(sorted[0][1]);
    const valuesArr = sorted.map(item => ({
      title: item[0],
      width: (item[1] / maxValue) * 100,
      value: item[1]
    }))
    return valuesArr;
};

function countPopulation() {
    const replacements = {
        "United States of America": "USA",
        "Russian Federation": "Russia"
    }

    const sortedPopulation = filteredCountries
    .map(item => ({
        name: replacements[item.name] || item.name,
        population: item.population
    })).sort((a, b) => b.population - a.population);

    const totalPopulation = countries_data.reduce((acc, curr) => acc + curr.population, 0);

    const valuesArr = sortedPopulation.map(item => ({
        title: item.name,
        width: (item.population / totalPopulation) * 100,
        value: item.population
    }));

    valuesArr.unshift({
        title: "World",
        width: 100,
        value: totalPopulation
    })
    return valuesArr;
}

async function populateGraph(arr) {
    graphWrapper.innerHTML = "";
    // let html = "";

    for (let i = 0; i < arr.length; i++) {
        graphWrapper.innerHTML += `
        <div class="graph-line">
            <p>${arr[i].title}</p>
            <div class="bar" id="${arr[i].title}-bar" style="width: 0%;"></div>
            <p>${arr[i].value.toLocaleString()}</p>
        </div>`
    }
    console.log({testEl: document.getElementById(`${arr[0].title}-bar`)})
    
    for  (let i = 0; i < arr.length; i++) {
        setTimeout(() => {
            const barEl = document.getElementById(`${arr[i].title}-bar`);
            barEl.style.width = `${arr[i].width}%`;
            return
        }, 100 * i);
    }

    // graphWrapper.innerHTML = html;
}

function getMaxScale(num) {
  const digits = String(num).length;
  return 10 ** digits;
}

function displayCountryCards(arr) {
    let cardList = "";

    for (let country of arr) {
        cardList += `
            <div class="country-card w-full h-full bg-white py-4 px-4">
                <img src="${country.flag}" alt="" class="w-3/4 mx-auto">
                <p class="country-name uppercase text-primary text-base font-semibold text-center mt-7 mb-4">${country.name}</p>
                <div class="grid gap-[2px]">
                    <p class="text-base leading-4 text-gray-400">Capital: ${country.capital}</p>
                    <p class="text-base leading-4 text-gray-400">Language: ${country.languages}</p>
                    <p class="text-base leading-4 text-gray-400">Population: ${country.population}</p>
                </div>
            </div>`
    }

    countriesWrapper.innerHTML = cardList;
}

function goToGraph() {
    graphSection.scrollIntoView(false, {behavior: "instant"});
}

function sortCountries(e) {
    const btn = e.currentTarget;
    const btnName = btn.dataset.btnName;
    const sortStatus = btn.querySelector(".btn-text").dataset.sort;

    sortBtns.forEach(btn => {
        btn.querySelector(".btn-text").dataset.sort = "";
    });

    const newSortStatus = sortStatus === "up" ? "down" : "up";
    btn.querySelector(".btn-text").dataset.sort = newSortStatus;

    filteredCountries.sort((a, b) => {
        if (newSortStatus === "up" && btnName === "population") {
            return a[btnName] - b[btnName];
        } else if (newSortStatus === "down" && btnName === "population") {
            return b[btnName] - a[btnName];
        } else if (newSortStatus === "up") {
            return (a[btnName] || "").localeCompare((b[btnName] || ""));
        } else {
            return (b[btnName] || "").localeCompare((a[btnName] || ""));
        }
    });

    displayCountryCards(filteredCountries);

    console.log({ btnName, sortStatus, newSortStatus, filteredCountries });
}