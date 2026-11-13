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

countryButton.addEventListener('click', () => {
    searchCountry();
    document.body.style.zoom = '100%';
});

countryInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        searchCountry();
        document.body.style.zoom = '100%';
    }
});