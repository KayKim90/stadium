import "@babel/polyfill";
import { login, logout, signup } from "./login";
import { updatePassword } from "./updateSetting";

// Dom elements
const loginForm = document.querySelector(".form");
const logOutBtn = document.querySelector(".logout-btn");
const signupForm = document.querySelector(".signupform");
const updateForm = document.querySelector(".updateForm");

if (loginForm) {
  loginForm.addEventListener("submit", e => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });
}

if (logOutBtn) {
  logOutBtn.addEventListener("click", logout);
}

if (signupForm) {
  signupForm.addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;
    console.log(name + email + password + passwordConfirm);
    signup(name, email, password, passwordConfirm);
  });
}
if (updateForm) {
  updateForm.addEventListener("submit", async e => {
    e.preventDefault();
    document.querySelector(".btn--update").textContent = "Updating...";
    const passwordCurrent = document.getElementById("password-current").value;
    const password = document.getElementById("password-new").value;
    const passwordConfirm = document.getElementById("password-confirm").value;
    console.log(passwordCurrent + password + passwordConfirm);
    await updatePassword(
      { passwordCurrent, password, passwordConfirm },
      "data"
    );
    document.querySelector(".btn--update").textContent = "Update";
    document.getElementById("password-current").value = "";
    document.getElementById("password-new").value = "";
    document.getElementById("password-confirm").value = "";
  });
}
