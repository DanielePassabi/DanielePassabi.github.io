let selectedButton = null;  // to keep track of the currently selected button
const years = ['2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'];  // you can dynamically populate this later

window.addEventListener('DOMContentLoaded', () => {
    const yearsContainer = document.getElementById('years-container');

    years.forEach(year => {
        const yearButton = document.createElement('button');
        yearButton.textContent = year;
        yearButton.className = 'btn btn-dark me-2';
        yearButton.onclick = () => {
            // Deselect previously selected button
            if (selectedButton) {
                selectedButton.classList.remove('btn-success');
                selectedButton.classList.add('btn-dark');
            }

            // Select the clicked button
            yearButton.classList.remove('btn-dark');
            yearButton.classList.add('btn-success');

            selectedButton = yearButton;  // update the currently selected button

            loadImages(year);
        };
        yearsContainer.appendChild(yearButton);
    });
});

async function loadImages(year) {
    const imagesContainer = document.getElementById('images-container');
    imagesContainer.innerHTML = '';  // clear previous images

    try {
        const response = await fetch(`/.netlify/functions/get-images?year=${year}`);
        const imageFiles = await response.json();

        imageFiles.forEach(file => {
            const imgElement = document.createElement('img');
            imgElement.src = `../images/${year}/${file}`;
            imgElement.alt = `${year} - ${file}`;

            const aspectRatioBox = document.createElement('div');
            aspectRatioBox.className = 'aspect-ratio-box';
            aspectRatioBox.appendChild(imgElement);

            const colElement = document.createElement('div');
            colElement.className = 'col-lg-3 col-md-4 col-sm-6 mb-4';  // Added margin-bottom (mb-4) for spacing
            colElement.appendChild(aspectRatioBox);

            imagesContainer.appendChild(colElement);
        });
    } catch (error) {
        console.error('Error fetching images:', error);
    }
}