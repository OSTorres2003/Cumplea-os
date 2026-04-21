const introPhotos = [
  { src: "Img2/foto.png", caption: "Una ternura que conquista corazones" },
  { src: "Img2/foto1.png", caption: "Pequenos momentos llenos de magia" },
  { src: "Img2/Foto3.png", caption: "La sonrisa mas linda de la fiesta" },
  { src: "Img2/Foto4.png", caption: "Un protagonista lleno de dulzura" }
];

const photos = [
  { src: "img/adescarga.jpg", caption: "Dulzura que ilumina el dia" },
  { src: "img/asdescarga.jpg", caption: "Una sonrisa que roba miradas" },
  { src: "img/asdfimages.jpg", caption: "Pequenos momentos, gran magia" },
  { src: "img/descarga.png", caption: "Ternura en cada aventura" },
  { src: "img/dsescarga.png", caption: "Un festejo lleno de amor" }
];

const celebrationPage = document.getElementById("celebrationPage");
const carouselTrack = document.getElementById("carouselTrack");
const carouselDots = document.getElementById("carouselDots");
const prevSlideButton = document.getElementById("prevSlide");
const nextSlideButton = document.getElementById("nextSlide");
const slideshow = document.getElementById("slideshow");
const startButton = document.getElementById("startButton");
const progressFill = document.getElementById("progressFill");
const music = document.getElementById("backgroundMusic");
const introFinish = document.getElementById("introFinish");
const introStage = document.getElementById("introStage");

const INTRO_DURATION = 20000;
const SLIDE_DURATION = INTRO_DURATION / introPhotos.length;

let currentIndex = -1;
let intervalId = null;
let introEndTimeoutId = null;
let carouselIndex = 0;
let carouselIntervalId = null;

function buildSlides() {
  introPhotos.forEach((photo, index) => {
    const slide = document.createElement("article");
    slide.className = "slide";
    slide.dataset.index = index;

    const card = document.createElement("div");
    card.className = "photo-card";

    const image = document.createElement("img");
    image.src = photo.src;
    image.alt = `Foto ${index + 1} del bebe`;
    image.className = "photo-main";

    const backdrop = document.createElement("img");
    backdrop.src = photo.src;
    backdrop.alt = "";
    backdrop.className = "photo-backdrop";
    backdrop.setAttribute("aria-hidden", "true");

    const overlay = document.createElement("div");
    overlay.className = "photo-overlay";

    const caption = document.createElement("div");
    caption.className = "caption";
    caption.textContent = photo.caption;

    card.append(backdrop, overlay, image, caption);
    slide.append(card);
    slideshow.append(slide);
  });
}

function updateProgress(index) {
  if (!progressFill) {
    return;
  }

  const progress = ((index + 1) / introPhotos.length) * 100;
  progressFill.style.width = `${progress}%`;
}

function showSlide(nextIndex) {
  const slides = document.querySelectorAll(".slide");
  const previous = slides[currentIndex];
  const next = slides[nextIndex];

  if (previous) {
    previous.classList.remove("active");
    previous.classList.add("exiting");
    setTimeout(() => previous.classList.remove("exiting"), 1200);
  }

  next.classList.add("active");
  currentIndex = nextIndex;
  updateProgress(nextIndex);
}

function startSlideshow() {
  if (intervalId) {
    return;
  }

  showSlide(0);

  intervalId = window.setInterval(() => {
    const nextIndex = (currentIndex + 1) % introPhotos.length;
    showSlide(nextIndex);
  }, SLIDE_DURATION);
}

function finishIntro() {
  if (!introStage) {
    return;
  }

  if (intervalId) {
    window.clearInterval(intervalId);
    intervalId = null;
  }

  if (progressFill) {
    progressFill.style.width = "100%";
  }
  introFinish.classList.add("visible");

  const activeSlide = document.querySelector(".slide.active");
  if (activeSlide) {
    activeSlide.classList.add("exiting");
    activeSlide.classList.remove("active");
  }

  document.body.classList.remove("is-intro");
  document.body.classList.add("page-active");

  window.setTimeout(() => {
    introStage.setAttribute("aria-hidden", "true");
    introStage.classList.add("is-hidden");
    window.location.href = "index.html";
  }, 800);
}

function buildCarousel() {
  photos.forEach((photo, index) => {
    const item = document.createElement("article");
    item.className = "carousel-item";
    if (index === 0) {
      item.classList.add("active");
    }

    item.innerHTML = `
      <img class="carousel-backdrop" src="${photo.src}" alt="" aria-hidden="true">
      <div class="carousel-shade"></div>
      <div class="carousel-photo">
        <img src="${photo.src}" alt="Foto ${index + 1} del bebe en el carrusel">
      </div>
      <div class="carousel-caption">${photo.caption}</div>
    `;

    carouselTrack.append(item);

    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Ir a la foto ${index + 1}`);
    if (index === 0) {
      dot.classList.add("active");
    }
    dot.addEventListener("click", () => {
      showCarouselSlide(index);
      restartCarousel();
    });
    carouselDots.append(dot);
  });
}

function showCarouselSlide(index) {
  const items = carouselTrack.querySelectorAll(".carousel-item");
  const dots = carouselDots.querySelectorAll("button");

  items.forEach((item, itemIndex) => {
    item.classList.toggle("active", itemIndex === index);
  });

  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === index);
  });

  carouselIndex = index;
}

function nextCarouselSlide() {
  const nextIndex = (carouselIndex + 1) % photos.length;
  showCarouselSlide(nextIndex);
}

function previousCarouselSlide() {
  const nextIndex = (carouselIndex - 1 + photos.length) % photos.length;
  showCarouselSlide(nextIndex);
}

function startCarousel() {
  if (carouselIntervalId) {
    return;
  }

  carouselIntervalId = window.setInterval(nextCarouselSlide, 3600);
}

function restartCarousel() {
  if (carouselIntervalId) {
    window.clearInterval(carouselIntervalId);
    carouselIntervalId = null;
  }
  startCarousel();
}

function getNextBirthdayTarget() {
  const now = new Date();
  const currentYear = now.getFullYear();
  let target = new Date(currentYear, 4, 4, 0, 0, 0);

  if (now > target) {
    target = new Date(currentYear + 1, 4, 4, 0, 0, 0);
  }

  return target;
}

function updateCountdown() {
  const target = getNextBirthdayTarget();
  const now = new Date();
  const diff = target - now;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById("days").textContent = String(days).padStart(2, "0");
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}

function setupRevealAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll(".reveal").forEach((section) => observer.observe(section));
}

async function startMusic() {
  if (!music) {
    return;
  }

  try {
    if (music.paused && music.currentTime === 0) {
      music.currentTime = 0;
    }
    music.volume = 0.55;
    await music.play();
    if (startButton) {
      startButton.classList.add("hidden");
    }
  } catch (error) {
    if (startButton) {
      startButton.textContent = "Toca aqui para activar la musica";
      startButton.classList.remove("hidden");
    }
  }
}

if (slideshow) {
  buildSlides();
  startSlideshow();
  if (startButton) {
    startButton.addEventListener("click", startMusic);
  }
  introEndTimeoutId = window.setTimeout(finishIntro, INTRO_DURATION);
  window.addEventListener("focus", () => {
    if (music && music.paused) {
      startMusic().catch(() => {});
    }
  });
  document.addEventListener("pointerdown", () => {
    if (music && music.paused) {
      startMusic().catch(() => {});
    }
  }, { once: true });
  document.addEventListener("keydown", () => {
    if (music && music.paused) {
      startMusic().catch(() => {});
    }
  }, { once: true });
  document.addEventListener("DOMContentLoaded", () => {
    startMusic().catch(() => {});
  });

  window.addEventListener("load", () => {
    showSlide(0);
    startMusic().catch(() => {});
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      music.pause();
      return;
    }

    if (intervalId && music.paused) {
      music.play().catch(() => {});
    }
  });
}

if (carouselTrack) {
  buildCarousel();
  startMusic().catch(() => {});
  window.addEventListener("load", () => {
    startMusic().catch(() => {});
  });
  document.addEventListener("pointerdown", () => {
    if (music && music.paused) {
      startMusic().catch(() => {});
    }
  }, { once: true });
  document.addEventListener("keydown", () => {
    if (music && music.paused) {
      startMusic().catch(() => {});
    }
  }, { once: true });
  document.addEventListener("visibilitychange", () => {
    if (!music) {
      return;
    }

    if (document.hidden) {
      music.pause();
      return;
    }

    if (music.paused) {
      music.play().catch(() => {});
    }
  });
  prevSlideButton.addEventListener("click", () => {
    previousCarouselSlide();
    restartCarousel();
  });
  nextSlideButton.addEventListener("click", () => {
    nextCarouselSlide();
    restartCarousel();
  });

  startCarousel();
  updateCountdown();
  window.setInterval(updateCountdown, 1000);
  setupRevealAnimations();
}
