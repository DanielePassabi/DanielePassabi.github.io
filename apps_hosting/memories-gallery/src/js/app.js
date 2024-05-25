document.addEventListener('DOMContentLoaded', () => {
    const contentDiv = document.getElementById('content');
    const breadcrumbsDiv = document.getElementById('breadcrumbs');

    // Function to fetch and display folders and images
    function displayContents(path) {
        fetch(`/.netlify/functions/getContents?directory=${path}`)
            .then(response => response.json())
            .then(data => {
                contentDiv.innerHTML = '';
                updateBreadcrumbs(path);

                data.forEach(item => {
                    if (item.type === 'folder') {
                        const folderDiv = document.createElement('div');
                        folderDiv.className = 'folder';
                        folderDiv.textContent = item.name;
                        folderDiv.onclick = () => navigateTo(`${path ? path + '/' : ''}${item.name}`);
                        contentDiv.appendChild(folderDiv);
                    } else if (item.type === 'image') {
                        const imageDiv = document.createElement('div');
                        imageDiv.className = 'image';
                        const img = document.createElement('img');
                        img.src = `functions/pictures/${path ? path + '/' : ''}${item.name}`;
                        img.onclick = () => toggleImageExpansion(imageDiv);
                        imageDiv.appendChild(img);
                        contentDiv.appendChild(imageDiv);
                    }
                });
            });
    }

    // Function to update breadcrumbs
    function updateBreadcrumbs(path) {
        const parts = path.split('/').filter(Boolean);
        breadcrumbsDiv.innerHTML = '';

        // Add Home link
        const homeSpan = document.createElement('span');
        homeSpan.textContent = 'Home 🏠';
        homeSpan.id = 'home-breadcrumb';
        homeSpan.onclick = () => navigateTo('');
        breadcrumbsDiv.appendChild(homeSpan);

        // Add separator and current path parts
        if (parts.length > 0) {
            const separator = document.createTextNode(' / ');
            breadcrumbsDiv.appendChild(separator);

            const currentPathSpan = document.createElement('span');
            currentPathSpan.textContent = parts.join(' / ');
            breadcrumbsDiv.appendChild(currentPathSpan);
        }
    }

    // Function to toggle image expansion
    function toggleImageExpansion(imageDiv) {
        if (imageDiv.classList.contains('fullscreen')) {
            imageDiv.classList.remove('fullscreen');
        } else {
            const expanded = document.querySelector('.fullscreen');
            if (expanded) expanded.classList.remove('fullscreen');
            imageDiv.classList.add('fullscreen');
        }
    }

    // Function to handle navigation and update the URL
    function navigateTo(path) {
        window.history.pushState({ path }, '', `?path=${path}`);
        displayContents(path);
    }

    // Handle back and forward browser navigation
    window.onpopstate = (event) => {
        if (event.state) {
            displayContents(event.state.path);
        } else {
            displayContents('');
        }
    };

    // Initial load
    const urlParams = new URLSearchParams(window.location.search);
    const initialPath = urlParams.get('path') || '';
    displayContents(initialPath);
});
