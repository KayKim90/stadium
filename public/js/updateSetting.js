import axios from "axios";
import { showAlert } from "./alert";

export const updatePassword = async data => {
  try {
    const res = await axios({
      method: "PATCH",
      url: "http://127.0.0.1:8000/api/v1/users/updateMyPassword",
      data
    });
    if (res.data.status === "success") {
      showAlert("success", "Updated successfully!");
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
