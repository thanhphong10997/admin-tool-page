import {
	Box,
	Checkbox,
	FormControl,
	FormControlLabel,
	FormHelperText,
	Grid,
	InputLabel,
	MenuItem,
	Paper,
	Select,
	Snackbar,
	TextField,
} from "@mui/material";
import {useNavigate} from "react-router-dom";

import MuiAlert from "@mui/material/Alert";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DesktopDatePicker} from "@mui/x-date-pickers/DesktopDatePicker";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import {forwardRef, useRef, useState, useEffect} from "react";
import * as yup from "yup";
import {useFormik} from "formik";

import NumberStepsHeader from "~/components/NumberStepsHeader";
import "~/Pages/OverrideMiuStyles.scss";

let adminApiUrl;
if (process.env.NODE_ENV === "development") {
	adminApiUrl = process.env.REACT_APP_ADMIN_API_DEV;
} else if (process.env.NODE_ENV === "production") {
	adminApiUrl = process.env.REACT_APP_ADMIN_API_PROD;
}

function StepCreateGame() {
	const createGameApi = `${adminApiUrl}/games`;
	const navigate = useNavigate();
	const [nameValue, setNameValue] = useState("");
	const gameName = useRef();
	const [typeValue, setTypeValue] = useState("");
	const [departmentValue, setDepartmentValue] = useState("");
	const [urlValue, setUrlValue] = useState("");
	const [statusValue, setStatusValue] = useState("");
	const [dateStartValue, setDateStartValue] = useState(dayjs().format("YYYY/MM/DD"));
	const [dateEndValue, setDateEndValue] = useState(dayjs().format("YYYY/MM/DD"));
	const [checkStaffCode, setCheckStaffCode] = useState(false);

	// const [googleSheetData, setGoogleSheetData] = useState([]);
	// const [haveGoogleForm, setHaveGoogleForm] = useState(false);

	// const googleSheetListApi = `${adminApiUrl}/google-sheets?orderBy=created_date desc&limit=1000`;

	// const validationSchema = yup.object({
	// 	googleSheetSelect: haveGoogleForm && yup.object().required("Vui lòng chọn google sheet!"),
	// });

	// const formik = useFormik({
	// 	initialValues: {
	// 		googleFormUrl: false,
	// 		googleSheetSelect: "",
	// 	},
	// 	validationSchema: validationSchema,
	// });

	// Notification
	const [successMessage, setSuccessMessage] = useState(false);
	const [errorMessage, setErrorMessage] = useState(false);
	const [notiMessage, setNotiMessage] = useState("");
	const notiPosition = {vertical: "top", horizontal: "center"};
	const {vertical, horizontal} = notiPosition;
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

	async function createGame(url = "", data = {}) {
		// Default options are marked with *
		const response = await fetch(url, {
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
		return response.json(); // parses JSON response into native JavaScript objects
	}

	const handleNextStep = async () => {
		// const validatedObject = await formik.validateForm();
		// Check if the form has error fields
		// if (Object.keys(validatedObject).length !== 0) return;
		const gameData = await createGame(createGameApi, {
			name: nameValue,
			check_staff_code: checkStaffCode ? "ACTIVE" : "INACTIVE",
			url: urlValue,
			type: typeValue,
			department: departmentValue,
			status: statusValue,
			started_date: dateStartValue,
			ended_date: dateEndValue,
			// google_sheet: JSON.stringify({
			// 	require: formik.values.googleFormUrl,
			// 	value: formik.values.googleSheetSelect,
			// }),
			created_user_id: 1,
		});

		const {status, data} = gameData;
		if (status === 1) {
			// clearFormValue();
			setNotiMessage("Tạo game thành công!");
			setSuccessMessage(true);
			setTimeout(() => {
				navigate("/quick-setup/form-user", {state: {game_id: data.id}});
			}, 1500);
		} else {
			setNotiMessage("Vui lòng kiểm tra lại thông tin!");
			setErrorMessage(true);
		}
	};

	// async function getGoogleSheetList(url = "") {
	// 	const response = await fetch(url);
	// 	const objectData = await response.json();
	// 	setGoogleSheetData(objectData.data.list);
	// }

	// useEffect(() => {
	// 	getGoogleSheetList(googleSheetListApi);
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, []);

	// useEffect(() => {
	// 	let googleFormUrlVal = formik.values.googleFormUrl ? true : false;
	// 	setHaveGoogleForm(googleFormUrlVal);
	// }, [formik.values]);
	return (
		<Box className="step-create-game">
			{/************* Step Area *************/}
			<NumberStepsHeader onClick={handleNextStep} />
			{/************* Step Area *************/}
			{/* Formik form */}
			{/* <form onSubmit={formik.handleSubmit}> */}
				<Paper
					elevation={3}
					sx={{
						paddingLeft: "0.8rem",
						paddingRight: "0.8rem",
						paddingBottom: "1.6rem",
						marginTop: "1.6rem",
					}}
				>
					{/* <Typography variant="h6" ml={2}>
					Tạo game
				</Typography> */}

					<Grid container spacing={2}>
						{/* Create User's Id */}
						{/* <Grid item xs={6} sm={6} md={6}>
						<TextField
							variant="outlined"
							inputRef={createIdUser}
							disabled
							defaultValue={1}
							label="Id người tạo game"
							size="small"
							sx={{ width: "100%" }}
						/>
					</Grid> */}
						<Grid item xs={6} sm={6} md={6}>
							<TextField
								variant="outlined"
								value={nameValue}
								ref={gameName}
								label="Name"
								size="small"
								sx={{width: "100%"}}
								required
								onChange={(e) => setNameValue(e.target.value)}
								error={!nameValue}
								helperText={!nameValue ? "Vui lòng nhập tên game" : ""}
							/>
						</Grid>

						<Grid item xs={6} sm={6} md={6}>
							<FormControl
								variant="outlined"
								component="span"
								sx={{width: "100%"}}
								size="small"
								required
								error={!typeValue}
							>
								<InputLabel id="type-select-label">Loại</InputLabel>
								<Select
									labelId="type-select-label"
									id="type-select"
									value={typeValue}
									label="Loại"
									onChange={(e) => setTypeValue(e.target.value)}
								>
									<MenuItem value="Form">Form</MenuItem>
								</Select>
								{!typeValue && <FormHelperText>Vui lòng chọn loại</FormHelperText>}
							</FormControl>
						</Grid>
						<Grid item xs={6} sm={6} md={6}>
							<FormControl
								variant="outlined"
								component="span"
								sx={{width: "100%"}}
								size="small"
								required
								error={!statusValue}
							>
								<InputLabel id="status-select-label">Trang thái</InputLabel>
								<Select
									labelId="status-select-label"
									id="status-select"
									value={statusValue}
									label="Trạng thái"
									onChange={(e) => setStatusValue(e.target.value)}
								>
									<MenuItem value="ACTIVE">ACTIVE</MenuItem>
									<MenuItem value="INACTIVE">INACTIVE</MenuItem>
								</Select>
								{!statusValue && <FormHelperText>Vui lòng chọn trạng thái</FormHelperText>}
							</FormControl>
						</Grid>

						<Grid item xs={6} sm={6} md={6}>
							<TextField
								variant="outlined"
								value={urlValue}
								label="Url"
								size="small"
								// value="url"
								sx={{width: "100%"}}
								required
								onChange={(e) => setUrlValue(e.target.value)}
								error={!urlValue}
								helperText={!urlValue ? "Vui lòng nhập đường dẫn" : ""}
							/>
						</Grid>
						<Grid item xs={6} sm={6} md={6}>
							<TextField
								variant="outlined"
								value={departmentValue}
								label="Phòng ban"
								size="small"
								sx={{width: "100%"}}
								required
								onChange={(e) => setDepartmentValue(e.target.value)}
								error={!departmentValue}
								helperText={!departmentValue ? "Vui lòng nhập phòng ban" : ""}
							/>
						</Grid>

						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<Grid item xs={6} sm={6} md={6}>
								<DesktopDatePicker
									label="Date Start"
									inputFormat="DD/MM/YYYY"
									value={dateStartValue}
									// sx={{ width: "100%" }}
									onChange={(newValue) => {
										setDateStartValue(newValue);
									}}
									renderInput={(params) => <TextField variant="outlined" sx={{width: "100%"}} {...params} />}
								/>
							</Grid>
							{/* Mã nhân viên */}

							<Grid item xs={6} sm={6} md={6}>
								<FormControlLabel
									label="Mã nhân viên"
									control={
										<Checkbox
											id="staff-code"
											name="staffCode"
											value={checkStaffCode}
											checked={checkStaffCode}
											onChange={(e) => setCheckStaffCode(e.target.checked)}
										/>
									}
								/>
							</Grid>
							<Grid item xs={6} sm={6} md={6}>
								<DesktopDatePicker
									label="Date End"
									inputFormat="DD/MM/YYYY"
									value={dateEndValue}
									// sx={{ width: "100%" }}
									onChange={(newValue) => {
										setDateEndValue(newValue);
									}}
									renderInput={(params) => <TextField variant="outlined" sx={{width: "100%"}} {...params} />}
								/>
							</Grid>
						</LocalizationProvider>

						{/* Google sheet */}
						{/* <Grid item xs={6} sm={6} md={6}>
							<FormControlLabel
								label="Gửi lên Google Form"
								control={
									<Checkbox
										id="google-form"
										name="googleFormUrl"
										value={formik.values.googleFormUrl}
										onChange={formik.handleChange}
									/>
								}
							/>

							{haveGoogleForm && (
								<Grid item xs={12} sm={12} md={12}>
									<FormControl variant="outlined" sx={{minWidth: "200px"}}>
										<InputLabel id="game-select-label">Chọn Google Sheet</InputLabel>
										<Select
											labelId="google-sheet-select-label"
											name="googleSheetSelect"
											id="google-sheet-select"
											value={formik.values.googleSheetSelect}
											label="Chọn game"
											onChange={formik.handleChange}
											error={formik.touched.googleSheetSelect && Boolean(formik.errors.googleSheetSelect)}
										>
											{googleSheetData &&
												googleSheetData.map((sheet) => {
													return (
														<MenuItem key={sheet.id} value={sheet}>
															{sheet.title}
														</MenuItem>
													);
												})}
										</Select>
										{formik.errors.googleSheetSelect && (
											<FormHelperText
												sx={{
													fontSize: "1rem",
													color: "#d32f2f",
													marginLeft: 0,
												}}
											>
												{formik.errors.googleSheetSelect}
											</FormHelperText>
										)}
									</FormControl>
								</Grid>
							)}
						</Grid> */}
					</Grid>
				</Paper>
			{/* </form> */}
			{/* Success Notification*/}
			<Snackbar
				anchorOrigin={{vertical, horizontal}}
				open={successMessage}
				autoHideDuration={4000}
				className="success-snackbar"
				onClose={handleClose}
			>
				<Alert onClose={handleClose} severity="success" sx={{width: "100%"}}>
					{notiMessage}
				</Alert>
			</Snackbar>

			{/* Error Notification*/}
			<Snackbar anchorOrigin={{vertical, horizontal}} open={errorMessage} autoHideDuration={4000} onClose={handleClose}>
				<Alert onClose={handleClose} severity="error" sx={{width: "100%"}}>
					{notiMessage}
				</Alert>
			</Snackbar>
		</Box>
	);
}

export default StepCreateGame;
