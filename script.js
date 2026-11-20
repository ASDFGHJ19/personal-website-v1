const buttons = [...document.querySelectorAll(".category")];
const backgrounds = [...document.querySelectorAll(".background-image")];
const categoryCopy = [
  ["乡村文旅", "RURAL CULTURE & TOURISM"],
  ["品牌设计", "BRAND IDENTITY"],
  ["字体设计", "TYPOGRAPHY"],
  ["标志设计", "LOGO & SYMBOLS"]
];
const captionCn = document.querySelector("#captionCn");
const captionEn = document.querySelector("#captionEn");
const clock = document.querySelector("#clock");

function activateCategory(index) {
  backgrounds.forEach((background, backgroundIndex) => {
    background.classList.toggle("is-visible", index === backgroundIndex);
  });
  buttons.forEach((button, buttonIndex) => {
    const selected = buttonIndex === index;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  captionCn.textContent = categoryCopy[index][0];
  captionEn.textContent = categoryCopy[index][1];
}

buttons.forEach((button, index) => {
  button.addEventListener("mouseenter", () => activateCategory(index));
  button.addEventListener("focus", () => activateCategory(index));
  button.addEventListener("click", () => activateCategory(index));
});

function updateClock() {
  clock.textContent = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Shanghai",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(new Date());
}

updateClock();
setInterval(updateClock, 1000);
