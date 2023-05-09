import axios from "axios";

let adminApiUrl;
if (process.env.NODE_ENV === "development") {
  adminApiUrl = process.env.REACT_APP_ADMIN_API_DEV;
} else if (process.env.NODE_ENV === "production") {
  adminApiUrl = process.env.REACT_APP_ADMIN_API_PROD;
}
const logProvider = {
  log: async (action, params) => {
    let user_id = localStorage.getItem("user_id");
    const data = {
      user_id: user_id,
      action: action,
      body: JSON.stringify(params),
    };
    return axios
      .post(`${adminApiUrl}/logs`, data)
      .then(function (response) {
        // console.log(response);
      })
      .catch(function (error) {
        console.log(error);
        return Promise.reject("có lỗi!");
      });
  },

  getLog: async (resource, params) => {
    return axios({
      method: "GET",
      baseURL: adminApiUrl,
      url: "/logs",
    })
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
        return Promise.reject("Sai username hoặc password!");
      });
  },
};

export default logProvider;
