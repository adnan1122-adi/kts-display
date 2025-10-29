const params = new URLSearchParams(window.location.search);
const screenId = params.get("id"); // e.g., ?id=7A

const apiUrl = "https://script.google.com/macros/s/AKfycbycKA3R2b38kD1_SYTglNqRznRDbX756xuxmSyx0DXEKj9DK2KFu5MT0Y9zxC6kNgzCrA/exec" + "?id=" + screenId;

let images = [], index = 0;
let slideTime = 10000;   // default 10s
let refreshTime = 600000; // default 10min

async function loadConfig() {
  try {
    const res = await fetch(apiUrl);
    const data = await res.json();

    if (data.error) {
      console.error(data.error);
      return;
    }

    images = data.images;
    slideTime = data.slideTime * 1000;
    refreshTime = data.refreshTime * 60000;
    index = 0;

    showImage();
  } catch (err) {
    console.error("Failed to load config:", err);
  }
}

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

// Reload config from sheet every refreshTime
setInterval(loadConfig, refreshTime);

// Initial load
loadConfig();
