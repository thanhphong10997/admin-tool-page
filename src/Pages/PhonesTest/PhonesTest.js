import {
	Box,
	Button,
	FormControl,
	IconButton,
	MenuItem,
	Paper,
	Select,
	Stack,
	TextField,
	Typography,
	Snackbar,
} from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useEffect, useState, forwardRef } from "react";
import MuiAlert from "@mui/material/Alert";
import CloseIcon from "@mui/icons-material/Close";

import "./PhonesTest.scss";

let adminApiUrl 
if(process.env.NODE_ENV === "development") {
	adminApiUrl = process.env.REACT_APP_ADMIN_API_DEV
} else if (process.env.NODE_ENV === "production") {
	adminApiUrl = process.env.REACT_APP_ADMIN_API_PROD
}

function LinkRouter(props) {
	return <Link {...props} component={RouterLink} />;
}

function PhonesTest() {
	const location = useLocation();
	const pathnames = location.pathname.split("/").filter((x) => x);
	const breadcrumbNameMap = {
		"/phones-test": "Phones Test",
	};
	const [action, setAction] = useState("add");
	const [phoneValue, setPhoneValue] = useState("");
	const [phoneTestData, setPhoneTestData] = useState([]);

	// Notification
	const [successMessage, setSuccessMessage] = useState(false);
	const [errorMessage, setErrorMessage] = useState(false);
	const [notiMessage, setNotiMessage] = useState("");
	const notiPosition = { vertical: "top", horizontal: "center" };
	const { vertical, horizontal } = notiPosition;
	const Alert = forwardRef(function Alert(props, ref) {
		return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
	});

	// Success and error notifi
	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}

		setSuccessMessage(false);
		setErrorMessage(false);
	};

	const handleChangeSection = (e) => {
		setAction(e.target.value);
	};

	// Save Phone
	const handleSubmit = async () => {
		const data = {
			phone: phoneValue,
		};
		const response = await fetch(`${adminApiUrl}/accounts-test`, {
			method: "POST", // *GET, POST, PUT, DELETE, etc.
			mode: "cors", // no-cors, *cors, same-origin
			cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
			credentials: "same-origin", // include, *same-origin, omit
			headers: {
				"Content-Type": "application/json",
				// 'Content-Type': 'application/x-www-form-urlencoded',
			},
			redirect: "follow", // manual, *follow, error
			referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
			body: JSON.stringify(data), // body data type must match "Content-Type" header
		});
		const objectResponse = await response.json();
		// console.log(objectResponse);
		if (objectResponse.status === 1) {
			setNotiMessage("Thêm số điện thoại thành công!");
			setSuccessMessage(true);
			await getPhoneTestList();
		} else {
			setNotiMessage("Có lỗi xảy ra, vui lòng thử lại!");
			setErrorMessage(true);
		}
	};

	// Remove phone
	const handleRemovePhone = async (id) => {
		const response = await fetch(`${adminApiUrl}/accounts-test/${id}`, {
			method: "DELETE",
		});
		const objectResponse = await response.json();
		// console.log(objectResponse);
		if (objectResponse.status === 1) {
			setNotiMessage("Xóa số điện thoại thành công!");
			setSuccessMessage(true);
			await getPhoneTestList();
		} else {
			setNotiMessage("Có lỗi xảy ra, vui lòng thử lại!");
			setErrorMessage(true);
		}
	};

	async function getPhoneTestList() {
		const response = await fetch(`${adminApiUrl}/accounts-test`);
		const objectResponse = await response.json();
		setPhoneTestData(objectResponse.data.list);
	}
	useEffect(() => {
		getPhoneTestList();
	}, [phoneTestData.length]);
	return (
		<Box mt={2}>
			<Breadcrumbs aria-label="breadcrumb">
				<LinkRouter underline="hover" color="inherit" to="/">
					Home
				</LinkRouter>
				{pathnames.map((value, index) => {
					const last = index === pathnames.length - 1;
					const to = `/${pathnames.slice(0, index + 1).join("/")}`;
					return last ? (
						<Typography color="text.primary" key={to}>
							{breadcrumbNameMap[to]}
						</Typography>
					) : (
						<LinkRouter underline="hover" color="inherit" to={to} key={to}>
							{breadcrumbNameMap[to]}
						</LinkRouter>
					);
				})}
			</Breadcrumbs>
			<Paper
				elevation={3}
				className="wrapper"
				sx={{ paddingTop: "1rem", paddingBottom: "1rem" }}
			>
				<Stack mt={2} mb={2} spacing={2} direction="row" alignItems="center">
					<label>Action</label>
					<FormControl variant="outlined" fullWidth>
						{/* <InputLabel id="demo-simple-select-label">Action</InputLabel> */}
						<Select
							// labelId="action-select-label"
							id="action-select"
							value={action}
							onChange={handleChangeSection}
						>
							<MenuItem value="add">ADD</MenuItem>
							{/* <MenuItem value="remove">Remove</MenuItem> */}
						</Select>
					</FormControl>
				</Stack>
				<Stack mt={2} mb={2} spacing={2} direction="row" alignItems="center">
					<label>Phone</label>
					<TextField
						type="number"
						variant="outlined"
						label="Test Phone"
						value={phoneValue}
						onChange={(e) => setPhoneValue(e.target.value)}
					/>
				</Stack>
				<Button
					variant="contained"
					size="small"
					sx={{ marginLeft: "60px", marginBottom: "16px" }}
					onClick={handleSubmit}
				>
					Save
				</Button>
			</Paper>

			{phoneTestData.length !== 0 && (
				<Paper elevation={3} sx={{ marginTop: "1.6rem", padding: "1.6rem" }}>
					<Typography variant="body1">Test Phone</Typography>
					<Stack direction="row" spacing={2}>
						{phoneTestData.map((phoneData) => {
							return (
								<Box key={phoneData.id} className="phone-wrapper">
									<IconButton
										size="small"
										onClick={() => handleRemovePhone(phoneData.id)}
									>
										<CloseIcon fontSize="1rem" sx={{ color: "#fff" }} />
									</IconButton>
									<span className="phoneField">{phoneData.phone}</span>
								</Box>
							);
						})}
					</Stack>
				</Paper>
			)}

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
		</Box>
	);
}

export default PhonesTest;
