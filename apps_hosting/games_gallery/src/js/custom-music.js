// List of songs in the music folder
const songs = [
    "Undertale OST 001 - Once Upon A Time.mp3",
    "Undertale OST 002 - Start Menu.mp3",
    "Undertale OST 003 - Your Best Friend.mp3",
    "Undertale OST 004 - Fallen Down.mp3",
];

// Function to get a random song from the array
function getRandomSong() {
    const index = Math.floor(Math.random() * songs.length);
    return songs[index];
}

// Function to toggle background music on and off
function toggleMusic() {
    const music = document.getElementById('bg-music');
    const songNameElement = document.getElementById('song-name');

    if (music.paused) {
        const randomSong = getRandomSong();
        const displayName = randomSong.replace('.mp3', ' 🎷');  // Remove .mp3 from the name
        music.src = `music/${randomSong}`;
        music.play();
        songNameElement.textContent = displayName;
    } else {
        music.pause();
        songNameElement.textContent = "Play Some Music 🎸";
    }
}