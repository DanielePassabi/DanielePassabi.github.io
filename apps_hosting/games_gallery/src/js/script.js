let selectedButton = null;  // to keep track of the currently selected button
const years = ['2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'];  // you can dynamically populate this later

window.addEventListener('DOMContentLoaded', () => {
    const yearsContainer = document.getElementById('years-container');
    let currentYearButton = null;  // To store the button for the current year

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
        
        if (year === years[years.length - 1]) {  // Check if this is the last (current) year
            currentYearButton = yearButton;
        }

        yearsContainer.appendChild(yearButton);
    });

    // Click the button for the current year to set it as the default
    if (currentYearButton) {
        currentYearButton.click();
    }
});


/**
 * Asynchronously load images and display them on the web page.
 * 
 * @param {number} year - The year for which to load images.
 */
async function loadImages(year) {
    const imagesContainer = document.getElementById('images-container');
    imagesContainer.innerHTML = '';  // clear previous images

    try {
        const response = await fetch(`/.netlify/functions/get-images?year=${year}`);
        const imageFiles = await response.json();

        if (Array.isArray(imageFiles)) {
            imageFiles.forEach(file => {
                // Create and configure img element
                const imgElement = document.createElement('img');
                imgElement.src = `functions/images/${year}/${file}`;
                imgElement.alt = `${year} - ${file}`;

                // Initialize variables to hold extracted information
                // let number = "missing!";
                // let name = "missing!";
                // let time = "missing!";

                // Extract information from filename
                const [number, name, time, ranking] = file.split('_');

                // Create label with extracted info
                const labelElement = createImageLabel(number, name, time);

                // Create and configure aspect-ratio box
                const aspectRatioBox = document.createElement('div');
                aspectRatioBox.className = 'aspect-ratio-box';

                // Check for "best" ranking and apply special style if applicable
                if (ranking === 'best') {
                    aspectRatioBox.classList.add('best-image');
                }

                if (ranking === 'not-completed') {
                    aspectRatioBox.classList.add('not-completed-image');
                }

                aspectRatioBox.appendChild(imgElement);
                aspectRatioBox.appendChild(labelElement);

                // Create and configure column element
                const colElement = document.createElement('div');
                colElement.className = 'col-lg-3 col-md-4 col-sm-6 mb-4';
                colElement.appendChild(aspectRatioBox);

                imagesContainer.appendChild(colElement);
            });
        } else {
            console.error('Unexpected response:', imageFiles);
        }
    } catch (error) {
        console.error('Error fetching images:', error);
    }
}

/**
 * Create a label for an image.
 * 
 * @param {string} number - The image number.
 * @param {string} name - The image name.
 * @param {string} time - The image time.
 * @returns {Element} - The label element.
 */
function createImageLabel(number, name, time) {
    const labelElement = document.createElement('div');
    labelElement.className = 'image-label';

    const numberElement = document.createElement('p');
    numberElement.className = 'image-number';
    numberElement.textContent = number;

    const nameElement = document.createElement('p');
    nameElement.className = 'image-name';
    nameElement.textContent = name;

    const timeIcon = document.createElement('img');
    timeIcon.src = 'icons/hourglass.png';
    timeIcon.alt = 'Time Icon';
    timeIcon.style.width = '1.25vw';  // You can adjust this value based on your design preferences
    timeIcon.style.height = '1.25vw'; // Same here

    const timeElement = document.createElement('p');
    timeElement.className = 'image-time';
    timeElement.appendChild(timeIcon);
    timeElement.innerHTML += ` ${time}`;  // Appending the time after the icon

    // Uncomment to add the number element.
    // labelElement.appendChild(numberElement);

    labelElement.appendChild(nameElement);
    labelElement.appendChild(timeElement);

    return labelElement;
}