const countryInput = document.querySelector('.country-input');
const countryButton = document.querySelector('.country-button');
const countryName = document.querySelector('.country-name');
countryButton.addEventListener('click', () => {
    const newName = countryInput.value.trim();
    if (newName !== '') {
        countryName.textContent = newName;
        countryInput.value = '';
    }
});

countryInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const newName = countryInput.value.trim();
        if (newName !== '') {
            countryName.textContent = newName;
            countryInput.value = '';
        }
    }
});