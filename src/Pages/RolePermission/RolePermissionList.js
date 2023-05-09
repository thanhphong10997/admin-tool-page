import SaveIcon from "@mui/icons-material/Save";
import { Button, Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Grid from "@mui/material/Grid";
import { forwardRef, memo, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import "~/Pages/OverrideMiuStyles.scss";

let adminApiUrl;
if (process.env.NODE_ENV === "development") {
	adminApiUrl = process.env.REACT_APP_ADMIN_API_DEV;
} else if (process.env.NODE_ENV === "production") {
	adminApiUrl = process.env.REACT_APP_ADMIN_API_PROD;
}

function RolePermissionList() {
	const location = useLocation();
	let navigate = useNavigate();
	const [data, setData] = useState([]);
	const [successMessage, setSuccessMessage] = useState(false);
	const [errorMessage, setErrorMessage] = useState(false);
	const [notiMessage, setNotiMessage] = useState("");
	const notiPosition = { vertical: "top", horizontal: "center" };
	const { vertical, horizontal } = notiPosition;
	const Alert = forwardRef(function Alert(props, ref) {
		return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
	});

	const [checkedBoxList, setCheckedBoxList] = useState([]);
	const allPermissionListApi = `${adminApiUrl}/permissions?offset=0&limit=1000`;
	// Success and error notifi
	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}

		setSuccessMessage(false);
		setErrorMessage(false);
	};
	// Success notifi

	async function getRolePermissionList(url = "") {
		const response = await fetch(url, {
			method: "GET",
			mode: "cors",
			cache: "no-cache",
			credentials: "same-origin",
			headers: {
				"Content-Type": "application/json",
				"x-view": "role",
			},
		});
		const objectData = await response.json();
		// console.log(objectData.data);
		setData(objectData.data.list);
		// return response;
	}

	useEffect(() => {
		getRolePermissionList(allPermissionListApi);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getCheckedPermission = (subjectName, action) => {
		let data = location.state["role_permission_list"];
		let filteredData = data.find((item) => {
			return item.subject_name === subjectName;
		});
		if (filteredData) {
			let havePermission = filteredData.actions.find((item) => {
				return item.action_name == action.action_name;
			});
			if (havePermission) return true;
		}
		return false;
	};

	const handleUpdateOrCreate = async () => {
		let roleId = location.state["role_id"];
		let url = `${adminApiUrl}/role/${roleId}/permission`;
		const data = {
			permission_id: JSON.stringify(checkedBoxList),
		};
		const response = await fetch(url, {
			method: "POST",
			mode: "cors",
			cache: "no-cache",
			credentials: "same-origin",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
			},
		});
		if (response.status === 200) {
			setNotiMessage("Lưu thành công!");
			setSuccessMessage(true);
			setTimeout(() => {
				navigate("/roles");
			}, 1000);
		} else {
			setNotiMessage("Lưu thất bại!Vui lòng thử lại");
			setErrorMessage(true);
		}
	};

	const handleChecked = () => {
		const checkedBoxes = document.querySelectorAll(
			'.MuiCheckbox-root .PrivateSwitchBase-input[type="checkbox"]:checked'
		);
		// console.log(checkBoxes);
		const checkedBoxValues = Array.from(checkedBoxes).map(
			(checkbox) => checkbox.value
		);
		setCheckedBoxList(checkedBoxValues);
	};
	return (
		<>
			<Grid container spacing={2} marginTop={1}>
				{data.length > 0 &&
					data.map((item, i) => {
						return (
							<Grid item key={i} xs={4} md={3}>
								<p style={{ textTransform: "uppercase" }}>
									{item.subject_name}
								</p>
								<FormGroup>
									{item.actions.map((action, index) => (
										<FormControlLabel
											key={index}
											control={
												<Checkbox
													defaultChecked={getCheckedPermission(
														item.subject_name,
														action
													)}
													value={action.action_id}
													onChange={handleChecked}
												/>
											}
											label={action.action_name}
										/>
									))}
								</FormGroup>
							</Grid>
						);
					})}
				<Grid item xs={12} md={12}>
					<Button
						variant="contained"
						disabled={checkedBoxList.length > 0 ? false : true}
						startIcon={<SaveIcon />}
						onClick={handleUpdateOrCreate}
					>
						Lưu
					</Button>
				</Grid>
			</Grid>
			{/* Success Notification*/}
			<Snackbar
				anchorOrigin={{ vertical, horizontal }}
				open={successMessage}
				autoHideDuration={4000}
				className="success-snackbar"
				onClose={handleClose}
			>
				<Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
					{notiMessage}
				</Alert>
			</Snackbar>

			{/* Error Notification*/}
			<Snackbar
				anchorOrigin={{ vertical, horizontal }}
				open={errorMessage}
				autoHideDuration={4000}
				onClose={handleClose}
			>
				<Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
					{notiMessage}
				</Alert>
			</Snackbar>
		</>
	);
}

export default memo(RolePermissionList);
