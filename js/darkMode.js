let night = localStorage.getItem("night");

const themeSwitch = document.getElementById("themeSwitch");

const enableDarkmode = () => {
  document.body.classList.add("night");
  localStorage.setItem("night", "active");
};

const disableDarkmode = () => {
  document.body.classList.remove("night");
  localStorage.setItem("night", null);
};

if (night === "active") enableDarkmode();

themeSwitch.addEventListener("click", () => {
  night = localStorage.getItem("night");
  night !== "active" ? enableDarkmode() : disableDarkmode();
});
