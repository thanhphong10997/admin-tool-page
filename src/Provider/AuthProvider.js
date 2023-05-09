import dataProvider from "./DataProvider";
import axios from "axios";

let adminApiUrl 
if(process.env.NODE_ENV === "development") {
	adminApiUrl = process.env.REACT_APP_ADMIN_API_DEV
} else if (process.env.NODE_ENV === "production") {
	adminApiUrl = process.env.REACT_APP_ADMIN_API_PROD
}
const authProvider = {
	// called when the user attempts to log in
	login: ({username, password}) => {
		// localStorage.setItem("username", username);
		// console.log(username, password);
		// return dataProvider
		// 	.create("check-login", { data: { username, password } })
		// 	.then((response) => {
		// 		console.log(response);
		// 		if (response.response.status === 1) {
		// 			// alert("Success!");
		// 			localStorage.setItem("username", username);
		// 			return Promise.resolve("Đăng nhập thành công!");
		// 		}
		// 		return Promise.reject("Sai username hoặc password!");
		// 	});

		return axios({
			method: "POST",
			baseURL: adminApiUrl,
			url: "/check-login",
			data: {
				username,
				password,
			},
		})
			.then(function (response) {
				if (response.data.status === 1) {
					localStorage.setItem("user_id", response.data.data.user_id);
					localStorage.setItem("username", username);
					return Promise.resolve("Đăng nhập thành công!");
				}
				return Promise.reject("Sai username hoặc password!");
			})
			.catch(function (error) {
				console.log(error);
				return Promise.reject("Sai username hoặc password!");
			});

		// .catch((error) => {
		// 	console.log(error);
		// 	alert("Loi duong truyen!!");
		// 	// return Promise.reject("Invalid username or password");
		// });

		// accept all username/password combinations
		// return Promise.resolve()
	},
	// called when the user clicks on the logout button
	logout: () => {
		localStorage.removeItem("username");
		return Promise.resolve();
	},
	// called when the API returns an error
	checkError: ({status}) => {
		if (status === 401 || status === 403) {
			localStorage.removeItem("username");
			return Promise.reject();
		}
		return Promise.resolve();
	},
	// called when the user navigates to a new location, to check for authentication
	checkAuth: () => {
		return localStorage.getItem("username") ? Promise.resolve() : Promise.reject();
	},
	// called when the user navigates to a new location, to check for permissions / roles
	getPermissions: () => Promise.resolve(),
};

export default authProvider;
