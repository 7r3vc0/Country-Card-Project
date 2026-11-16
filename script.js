const countryInput = document.querySelector('.country-input');
const countryButton = document.querySelector('.country-button');
const countryName = document.querySelector('.country-name');
const countryCapital = document.querySelector('.country-capital strong');
const countryRegion = document.querySelector('.country-region strong');
const countryPopulation = document.querySelector('.country-population strong');
const countryLanguage = document.querySelector('.country-language strong');
const countryCurrency = document.querySelector('.country-currency strong');
const costOfLivingMarker = document.querySelector('.meter-marker');
const countryBanner = document.querySelector('.country-banner');
const countryError = document.querySelector('.country-error');
const flagBackground = document.querySelector('.flag-background');
const startButton = document.querySelector('.start-button');
const timerDisplay = document.querySelector('#timer-display');
const nameInput = document.querySelector('.country-name-input-field');
const capitalInput = document.querySelector('.country-capital-input-field');
const regionInput = document.querySelector('.country-region-input-field');
const populationInput = document.querySelector('.country-population-input-field');
const languageInput = document.querySelector('.country-language-input-field');
const currencyInput = document.querySelector('.country-currency-input-field');


let allCountriesForGame = null;
let startTime = null;
let timerId = null;
let currentCountryData = null;

const gameCountries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
  "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
  "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
  "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)", "Costa Rica",
  "Croatia", "Cuba", "Cyprus", "Czechia (Czech Republic)", "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador",
  "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau",
  "Guyana", "Haiti", "Holy See", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq",
  "Ireland", "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati",
  "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania",
  "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius",
  "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia",
  "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway",
  "Oman", "Pakistan", "Palau", "Palestine State", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland",
  "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino",
  "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands",
  "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland",
  "Syria", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey",
  "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States of America", "Uruguay", "Uzbekistan", "Vanuatu",
  "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

async function loadAllCountriesForGame() {
    if (allCountriesForGame) return;

    const response = await fetch('https://restcountries.com/v3.1/all');
    console.log('restcountries response ok?', response.ok, response.status);

    if (!response.ok) {
        console.error('Failed to load all countries:', response.status);
        return;
    }

    const data = await response.json();
    console.log('type of data from restcountries:', Array.isArray(data), data.length);
    allCountriesForGame = data;
    console.log('Loaded countries for game, stored array length:', allCountriesForGame.length);
}

async function searchCountry() {
    const newName = countryInput.value.trim();
    if (newName === '') return;

    const url = `https://countries.dev/name/${newName}`;
    
    let response;
    try{
        response = await fetch(url);
    } catch (error) {
        console.error('Network error:', error);
        countryError.textContent = 'Network error. Please try again.';
        countryError.classList.remove('hidden');
        return;
    }

    
    if (!response.ok) {
        console.warn('bad status for', newName, response.status);
        countryError.textContent = 'No country found. Try the full country name.';
        countryError.classList.remove('hidden');
        return;
    }



    const data = await response.json();
    console.log('Raw data from API:', data);
    
    if (!Array.isArray(data) || data.length === 0) {
        console.warn('No country found for', newName);
        countryError.textContent = 'No country found. Try the full country name.';
        countryError.classList.remove('hidden');
        return;
    }
    
    const country = data[0];
    
    if (!country) {
        console.warn('Invalid country object for:', newName, country);
        countryError.textContent = 'No country found. Try the full country name.';
        countryError.classList.remove('hidden');
        return;
    }


    countryError.classList.add('hidden');
    countryBanner.src = country.flags.svg;
    countryBanner.alt = `${country.name} flag`;
    if (flagBackground && country.flags && country.flags.svg) {
        flagBackground.style.backgroundImage = `radial-gradient(circle at center, rgba(0, 0, 0, .35), rgba(0, 0, 0, 0.5)), url(${country.flags.svg})`;
    }
    countryName.textContent = country.name;
    countryCapital.textContent = country.capital;
    countryRegion.textContent = country.region;
    countryPopulation.textContent = country.population.toLocaleString();
    
    let markerPositionClass;

    if (country.population < 10_000_000) {
        markerPositionClass = 'low-position';
    } else if (country.population < 50_000_000) {
        markerPositionClass = 'medium-position';
    } else {
        markerPositionClass = 'high-position';
    }

    costOfLivingMarker.classList.remove('low-position', 'medium-position', 'high-position');
    costOfLivingMarker.classList.add(markerPositionClass);

    const mainLanguage = country.languages?.[0]?.name || 'Unknown';
    countryLanguage.textContent = mainLanguage;

    const mainCurrency = country.currencies?.[0];
    countryCurrency.textContent = mainCurrency ? `${mainCurrency.name} (${mainCurrency.code})` : 'Unknown';


    countryInput.value = '';

}

async function startGame() {
    try {
        // 1. pick a random country name from your array
        const randomIndex = Math.floor(Math.random() * gameCountries.length);
        const randomName = gameCountries[randomIndex];

        const url = `https://countries.dev/name/${encodeURIComponent(randomName)}`;
        const response = await fetch(url);

        if (!response.ok) {
            console.error('Bad status for random fetch:', response.status);
            return;
        }

        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) {
            console.error('No country data for', randomName);
            return;
        }

        const country = data[0];
        currentCountryData = country;

        // === update left card + background (same pattern as searchCountry) ===
        countryError.classList.add('hidden');
        countryBanner.src = country.flags.svg;
        countryBanner.alt = `${country.name} flag`;

        if (flagBackground && country.flags && country.flags.svg) {
            flagBackground.style.backgroundImage =
                `radial-gradient(circle at center, rgba(0, 0, 0, .35), rgba(0, 0, 0, 0.5)), url(${country.flags.svg})`;
        }

        countryName.textContent = country.name;
        countryCapital.textContent = country.capital;
        countryRegion.textContent = country.region;
        countryPopulation.textContent = country.population.toLocaleString();

        let markerPositionClass;
        if (country.population < 10_000_000) {
            markerPositionClass = 'low-position';
        } else if (country.population < 50_000_000) {
            markerPositionClass = 'medium-position';
        } else {
            markerPositionClass = 'high-position';
        }

        costOfLivingMarker.classList.remove('low-position', 'medium-position', 'high-position');
        costOfLivingMarker.classList.add(markerPositionClass);

        const mainLanguage = country.languages?.[0]?.name || 'Unknown';
        countryLanguage.textContent = mainLanguage;

        const mainCurrency = country.currencies?.[0];
        countryCurrency.textContent = mainCurrency ? `${mainCurrency.name} (${mainCurrency.code})` : 'Unknown';

        // === clear right-side inputs ===
        nameInput.value = '';
        capitalInput.value = '';
        regionInput.value = '';
        populationInput.value = '';
        languageInput.value = '';
        currencyInput.value = '';

        // === start timer ===
        startTimer();

    } catch (error) {
        console.error('Network error when starting game:', error);
    }
}

startButton.addEventListener('click', startGame);

function resetAfterSearch(){
    countryInput.blur();

    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
}

countryButton.addEventListener('click', () => {
    searchCountry();
    resetAfterSearch();
});

countryInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        searchCountry();
        resetAfterSearch();
    }
});