// Get the screen ID from URL, e.g., ?id=7A
const params = new URLSearchParams(window.location.search);
const screenId = params.get("id"); 

// Replace with your deployed Apps Script URL
const apiUrl = "https://script.google.com/macros/s/AKfycbycKA3R2b38kD1_SYTglNqRznRDbX756xuxmSyx0DXEKj9DK2KFu5MT0Y9zxC6kNgzCrA/exec?id=" + screenId;

let images = [], index = 0;
let slideTime = 8000;   // default 8 seconds
let refreshTime = 60000; // default 1 minute

// Load configuration and images from Apps Script
async function loadConfig() {
  try {
    const res = await fetch(apiUrl);
    const data = await res.json();

    if (!data.images || data.images.length === 0) return;

    images = data.images;
    slideTime = data.slideTime * 1000;      // convert to ms
    refreshTime = data.refreshTime * 60000; // convert to ms
    index = 0;

    showImage();
  } catch (err) {
    console.error("Failed to load config:", err);
  }
}

// Display the current image
function showImage() {
  if (!images || images.length === 0) return;

  const img = document.getElementById("display");
  img.style.opacity = 0;

  setTimeout(() => {
    img.src = images[index];
    img.onload = () => img.style.opacity = 1;
    index = (index + 1) % images.length;
  }, 500);
}

// Change image every slideTime
setInterval(showImage, slideTime);

// Reload config from Google Sheet every refreshTime
setInterval(loadConfig, refreshTime);

// Initial load
loadConfig();
