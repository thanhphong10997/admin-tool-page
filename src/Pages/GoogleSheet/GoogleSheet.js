import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import {
	Button,
	Container,
	FormControl,
	FormControlLabel,
	FormHelperText,
	FormLabel,
	Grid,
	IconButton,
	InputLabel,
	MenuItem,
	Radio,
	RadioGroup,
	Select,
	Snackbar,
	Stack,
	TextField,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import {useFormik} from "formik";
import {forwardRef, Fragment, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import * as yup from "yup";

let adminApiUrl;

if (process.env.NODE_ENV === "development") {
	adminApiUrl = process.env.REACT_APP_ADMIN_API_DEV;
} else if (process.env.NODE_ENV === "production") {
	adminApiUrl = process.env.REACT_APP_ADMIN_API_PROD;
}

function GoogleSheet() {
	let navigate = useNavigate();
	const [valueRadio, setValueRadio] = useState("");
	const [count, setCount] = useState(0);
	const [notiMessage, setNotiMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState(false);
	const [errorMessage, setErrorMessage] = useState(false);

	const [gameData, setGameData] = useState(null);
	const gameListApi = `${adminApiUrl}/games-list`;
	const [googleSheetValue, setGoogleSheetValue] = useState({
		title: "",
		columns: "",
	});
	const [googleFormValue, setGoogleFormValue] = useState({
		title: "",
		sheetId: "",
		googleFormUrl: "",
		entries: "",
	});
	const [textColumnSelect, setTextColumnSelect] = useState(["nameCus"]);
	const [entryColumnText, setEntryColumnText] = useState(["entry_123"]);

	// Alert Notification
	const Alert = forwardRef(function Alert(props, ref) {
		return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
	});
	const notiPosition = {vertical: "top", horizontal: "center"};
	const {vertical, horizontal} = notiPosition;

	// Success and error notifi
	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}

		setSuccessMessage(false);
		setErrorMessage(false);
	};

	const handleAddEntry = () => {
		setCount(count + 1);
	};

	const handleChange = (e) => {
		setValueRadio(e.target.value);
	};

	const onChangeGoogleSheet = (field, value) => {
		setGoogleSheetValue((prev) => {
			return {
				...prev,
				[field]: value,
			};
		});
	};
	const onChangeGoogleForm = (field, value) => {
		setGoogleFormValue((prev) => {
			return {
				...prev,
				[field]: value,
			};
		});
	};

	const textSelectOnChange = (e, index) => {
		let value = e.target.value;
		if (textColumnSelect[index]) {
			value = e.target.value;
			textColumnSelect[index] = value;
			setTextColumnSelect((prev) => {
				// console.log(prev);
				return prev;
			});
		} else {
			setTextColumnSelect((prev) => {
				// console.log(prev);
				return [...prev, value];
			});
		}
	};

	const entryColumnOnChange = (e, index) => {
		let value = e.target.value;
		if (entryColumnText[index]) {
			value = e.target.value;
			entryColumnText[index] = value;

			setEntryColumnText((prev) => {
				// console.log(...prev);
				return [...prev];
			});
		} else {
			setEntryColumnText((prev) => {
				// console.log(prev);
				return [...prev, value];
			});
		}
	};

	function handleClickBreadCrumb(event) {
		console.info("You clicked a breadcrumb.");
	}

	const validationSchema = yup.object({
		gameSelect: yup.object().required("Vui lòng chọn game!"),
	});

	const formik = useFormik({
		initialValues: {
			gameSelect: "",
		},
		validationSchema: validationSchema,
	});

	async function getGameList(url = "") {
		const response = await fetch(url);
		const objectData = await response.json();
		setGameData(objectData.data);
	}

	useEffect(() => {
		getGameList(gameListApi);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Container>
			{/* Formik form */}
			<form onSubmit={formik.handleSubmit}>
				<div
					style={{
						marginTop: "20px",
					}}
					role="presentation"
					onClick={handleClickBreadCrumb}
				>
					<Breadcrumbs aria-label="breadcrumb">
						<Link underline="hover" color="inherit" href="/#/games">
							Games
						</Link>
						<Typography color="text.primary">Google Sheet</Typography>
					</Breadcrumbs>
				</div>
				<FormControl
					sx={{
						width: "50%",
					}}
				>
					<FormLabel
						id="sheet-label"
						sx={{
							fontSize: "40px",
							color: "black",
						}}
					>
						Google Sheet
					</FormLabel>
					<RadioGroup
						aria-labelledby="sheet-label"
						value={valueRadio}
						sx={{
							paddingBottom: "20px",
						}}
						name="radio-buttons-group"
						onChange={handleChange}
					>
						<FormControlLabel value="newSheet" control={<Radio />} label="Tạo sheet mới" />
						<FormControlLabel value="addSheetAvailable" control={<Radio />} label="Thêm sheet có sẵn" />
					</RadioGroup>
					{valueRadio === "newSheet" ? (
						<>
							<label>Nhập tiêu đề:</label>
							<TextField
								variant="outlined"
								label="Title"
								id="sheet-title"
								name="title"
								value={googleSheetValue.name}
								onChange={(e) => onChangeGoogleSheet("title", e.target.value)}
							/>
							<label>Nhập các cột(Các cột cách nhau bởi dấu , VD: Họ tên, tuổi, chi nhánh...):</label>
							<TextField
								variant="outlined"
								label="Columns"
								id="sheet-columns"
								name="columns"
								value={googleSheetValue.name}
								onChange={(e) => onChangeGoogleSheet("columns", e.target.value)}
							/>
							<br />
							<Grid container textAlign={"center"} rowSpacing={1} columnSpacing={{xs: 1, sm: 2, md: 3}}>
								<Grid item xs={6}>
									<Button
										variant="contained"
										sx={{width: "100%"}}
										onClick={async () => {
											const arrColumns = googleSheetValue.columns.split(", ");
											const googleSheetData = {
												title: googleSheetValue.title,
												columns: arrColumns,
											};
											// console.log(googleSheetData);
											const response = await fetch(`${adminApiUrl}/google-sheets`, {
												method: "POST",
												mode: "cors",
												cache: "no-cache",
												credentials: "same-origin",
												headers: {
													"Content-Type": "application/json",
												},
												redirect: "follow",
												referrerPolicy: "no-referrer",
												body: JSON.stringify(googleSheetData),
											});
											const objectResponse = await response.json();
											// console.log(objectResponse);

											if (objectResponse.status === 1) {
												setNotiMessage("Lưu Sheet thành công!");
												setSuccessMessage(true);
												setTimeout(() => {
													window.location.reload();
												}, 1300);
											} else {
												setNotiMessage("Lưu Form thất bại!");
												setErrorMessage(true);
											}
										}}
									>
										Lưu
									</Button>
								</Grid>
								<Grid item xs={6}>
									<Button
										variant="outlined"
										sx={{width: "100%"}}
										onClick={() => {
											navigate("/games");
										}}
									>
										Hủy
									</Button>
								</Grid>
							</Grid>
						</>
					) : (
						<></>
					)}

					{valueRadio === "addSheetAvailable" ? (
						<>
							<FormControl variant="outlined" sx={{minWidth: "170px"}}>
								<InputLabel id="game-select-label">Chọn game</InputLabel>
								<Select
									labelId="game-select-label"
									name="gameSelect"
									id="game-select"
									value={formik.values.gameSelect}
									label="Chọn game"
									onChange={formik.handleChange}
									error={formik.touched.gameSelect && Boolean(formik.errors.gameSelect)}
								>
									{gameData &&
										gameData.map((game) => {
											return (
												<MenuItem key={game.id} value={game}>
													{game.name}
												</MenuItem>
											);
										})}
								</Select>

								{formik.errors.gameSelect && (
									<FormHelperText
										sx={{
											fontSize: "1rem",
											color: "#d32f2f",
											marginLeft: 0,
										}}
									>
										{formik.errors.gameSelect}
									</FormHelperText>
								)}
							</FormControl>
							<label>Nhập tiêu đề:</label>
							<TextField
								variant="outlined"
								label="Title"
								id="title-sheet"
								name="title"
								value={googleFormValue.title}
								onChange={(e) => onChangeGoogleForm("title", e.target.value)}
							/>
							<label>Nhập Sheet ID:</label>
							<TextField
								variant="outlined"
								label="SheetID"
								id="sheet-id"
								name="sheetId"
								value={googleFormValue.sheetId}
								onChange={(e) => onChangeGoogleForm("sheetId", e.target.value)}
							/>
							<label>Nhập Google Form Url:</label>
							<TextField
								variant="outlined"
								label="Google Form Url"
								id="google-form-url"
								name="googleFormUrl"
								value={googleFormValue.googleFormUrl}
								onChange={(e) => onChangeGoogleForm("googleFormUrl", e.target.value)}
							/>
							<label>Nhập Entries:</label>
							{Array.from(Array(count)).map((row, index) => {
								return (
									<Fragment key={index}>
										<Grid container rowSpacing={1} columnSpacing={{xs: 1, sm: 2, md: 3}}>
											<Grid item xs={4} md={4}>
												{/* <TextField
													variant="outlined"
													sx={{width: "100%"}}
													label="Nhập tên cột"
													key={index}
													name="text"
													onChange={(e) => {
														entryColumnOnChange("text", e.target.value, index);
													}}
												/> */}

												<FormControl variant="outlined" fullWidth>
													<InputLabel id={`column-select-label-${index}`}>Tên cột</InputLabel>
													<Select
														labelId={`column-select-label-${index}`}
														name={`textColumnSelect${index}`}
														id={`text-column-select-${index}`}
														value={textColumnSelect[index]}
														label="Chọn tên cột"
														onChange={(e) => textSelectOnChange(e, index)}
														// error={formik.touched.crmSelect && Boolean(formik.errors.crmSelect)}
													>
														<MenuItem value="nameCus" sx={{whiteSpace: "normal"}}>
															Tên người chơi
														</MenuItem>
														<MenuItem value="phoneCus" sx={{whiteSpace: "normal"}}>
															Số điện thoại người chơi
														</MenuItem>
														<MenuItem value="ageCus" sx={{whiteSpace: "normal"}}>
															Tuổi người chơi
														</MenuItem>
														<MenuItem value="addressCus" sx={{whiteSpace: "normal"}}>
															Chi nhánh người chơi
														</MenuItem>
														<MenuItem value="giftCus" sx={{whiteSpace: "normal"}}>
															Quà tặng người chơi
														</MenuItem>
														<MenuItem value="noteCus" sx={{whiteSpace: "normal"}}>
															Note người chơi
														</MenuItem>

														<MenuItem value="nameRela" sx={{whiteSpace: "normal"}}>
															Tên người thân
														</MenuItem>
														<MenuItem value="phoneRela" sx={{whiteSpace: "normal"}}>
															Số điện thoại người thân
														</MenuItem>
														<MenuItem value="ageRela" sx={{whiteSpace: "normal"}}>
															Tuổi người thân
														</MenuItem>
														<MenuItem value="addressRela" sx={{whiteSpace: "normal"}}>
															Chi nhánh người thân
														</MenuItem>
														<MenuItem value="giftRela" sx={{whiteSpace: "normal"}}>
															Quà tặng người thân
														</MenuItem>
														<MenuItem value="noteRela" sx={{whiteSpace: "normal"}}>
															Note người thân
														</MenuItem>
														<MenuItem value="relationship" sx={{whiteSpace: "normal"}}>
															Quan hệ
														</MenuItem>
														<MenuItem value="staffCode" sx={{whiteSpace: "normal"}}>
															Mã nhân viên
														</MenuItem>
														<MenuItem value="url" sx={{whiteSpace: "normal"}}>
															Đường dẫn trang
														</MenuItem>
														<MenuItem value="oldCus" sx={{whiteSpace: "normal"}}>
															Khách hàng cũ
														</MenuItem>
														<MenuItem value="newCus" sx={{whiteSpace: "normal"}}>
															Khách hàng mới
														</MenuItem>
													</Select>
													{formik.touched.crmSelect && formik.errors.crmSelect && (
														<FormHelperText
															sx={{
																fontSize: "1.2rem",
																color: "#d32f2f",
																marginLeft: 0,
															}}
														>
															{formik.errors.crmSelect}
														</FormHelperText>
													)}
												</FormControl>
											</Grid>
											<Grid item xs={8} md={8}>
												<TextField
													variant="outlined"
													sx={{width: "100%"}}
													label="Nhập entry"
													name="entry"
													key={index}
													value={entryColumnText[index]}
													onChange={(e) => {
														entryColumnOnChange(e, index);
													}}
												/>
											</Grid>
										</Grid>
									</Fragment>
								);
							})}
							<Stack direction="row" spacing={1}>
								<IconButton
									aria-label="add an entry"
									sx={{
										margin: "auto",
									}}
									onClick={handleAddEntry}
								>
									<AddCircleOutlineOutlinedIcon />
								</IconButton>
							</Stack>
							<br />
							<Grid container textAlign={"center"} rowSpacing={1} columnSpacing={{xs: 1, sm: 2, md: 3}}>
								<Grid item xs={6}>
									<Button
										variant="contained"
										sx={{width: "100%"}}
										onClick={async () => {
											const validatedObject = await formik.validateForm();
											// Check if the form has error fields
											if (Object.keys(validatedObject).length !== 0) return;
											const values = formik.values;

											let googleSheetColumns = [];

											for (let i = 0; i < textColumnSelect.length; i++) {
												let oneColumn = {
													text: textColumnSelect[i],
													entry: entryColumnText[i],
												};

												googleSheetColumns.push(oneColumn);
											}

											// console.log(googleSheetColumns);

											var googleFormData = {
												title: googleFormValue.title,
												spread_sheet_id: googleFormValue.sheetId,
												google_form_url: googleFormValue.googleFormUrl,
												columns: googleSheetColumns,
												game_id: values.gameSelect.id,
											};
											// console.log(googleFormData);
											const response = await fetch(`${adminApiUrl}/google-form`, {
												method: "POST",
												mode: "cors",
												cache: "no-cache",
												credentials: "same-origin",
												headers: {
													"Content-Type": "application/json",
												},
												redirect: "follow",
												referrerPolicy: "no-referrer",
												body: JSON.stringify(googleFormData),
											});
											const objectResponse = await response.json();
											// console.log(objectResponse);

											if (objectResponse.status === 1) {
												setNotiMessage("Lưu Sheet thành công!");
												setSuccessMessage(true);
												// setTimeout(() => {
												// 	window.location.reload();
												// }, 1300);
											} else {
												setNotiMessage("Lưu sheet thất bại!");
												setErrorMessage(true);
											}
										}}
									>
										Lưu
									</Button>
								</Grid>
								<Grid item xs={6}>
									<Button
										variant="outlined"
										sx={{width: "100%"}}
										onClick={() => {
											navigate("/games");
										}}
									>
										Hủy
									</Button>
								</Grid>
							</Grid>
						</>
					) : (
						<></>
					)}
				</FormControl>
			</form>

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
		</Container>
	);
}

export default GoogleSheet;
