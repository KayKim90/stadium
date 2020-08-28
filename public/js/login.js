import axios from "axios";
import { showAlert } from "./alert";

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:8000/api/v1/users/login",
      data: {
        email,
        password
      }
    });

    if (res.data.status === "success") {
      showAlert("success", "Logged in successfully!");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "http://127.0.0.1:8000/api/v1/users/logout"
    });
    window.setTimeout(() => {
      location.assign("/");
    }, 1500);
    if (res.data.status === "success") {
      location.reload(true);
    }
  } catch (err) {
    showAlert("Error logging out! Try Again");
  }
};

export const signup = async (name, email, password, passwordConfirm) => {
  // const photo = "default.jpg";
  const role = "user";
  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:8000/api/v1/users/signup",
      data: {
        name,
        email,
        password,
        passwordConfirm,
        role
      }
    });

    if (res.data.status === "success") {
      showAlert("success", "Sign up successfully!");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
