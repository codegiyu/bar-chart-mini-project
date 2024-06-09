console.log({countries: countries_data});

const subtitleEl = document.querySelector(".subtitle");
const languagesBtn = document.querySelector(".languages");
const populationBtn = document.querySelector(".population");
const graphTitleEl = document.querySelector(".graph-title");
const btns = document.querySelectorAll(".btn");
const graphWrapper = document.querySelector(".graph-wrapper");

subtitleEl.innerHTML = `Currently, we have ${countries_data.length} countries`;
showLanguages();
setTimeout(() => {console.log("JoJo")}, 4000);
setTimeout(() => {console.log("JoJo")}, 6000);

btns.forEach(btn => {
    btn.addEventListener("click", (e) => {
        const type = e.target.getAttribute("data-btn");
        console.log({type});
        type === "languages" ? showLanguages() : showPopulation();
    })
})

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
    const languages = countries_data.map(item => item.languages).flat();
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

    const sortedPopulation = countries_data
    .map(item => ({
        name: replacements[item.name] || item.name,
        population: item.population
    })).sort((a, b) => b.population - a.population);

    const totalPopulation = sortedPopulation.reduce((acc, curr) => acc + curr.population, 0);

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
// {title: "", width: 10, value: 3878373}