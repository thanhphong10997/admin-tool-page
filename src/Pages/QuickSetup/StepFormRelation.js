import {
	Box,
	Checkbox,
	FormControl,
	FormControlLabel,
	FormHelperText,
	InputLabel,
	MenuItem,
	Select,
	Snackbar,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";
import {useFormik} from "formik";
import Multiselect from "multiselect-react-dropdown";
import {forwardRef, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import * as yup from "yup";
import NumberStepsHeader from "~/components/NumberStepsHeader";
import "~/Pages/OverrideMiuStyles.scss";

let adminApiUrl;
if (process.env.NODE_ENV === "development") {
	adminApiUrl = process.env.REACT_APP_ADMIN_API_DEV;
} else if (process.env.NODE_ENV === "production") {
	adminApiUrl = process.env.REACT_APP_ADMIN_API_PROD;
}

function StepFormRelation() {
	const navigate = useNavigate();
	const location = useLocation();
	const [smsData, setSmsData] = useState([]);
	const smsListApi = `${adminApiUrl}/sms`;
	const otpListApi = `${adminApiUrl}/otp`;

	// Alert Notification
	const Alert = forwardRef(function Alert(props, ref) {
		return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
	});
	const [successMessage, setSuccessMessage] = useState(false);
	const [errorMessage, setErrorMessage] = useState(false);
	const [notiMessage, setNotiMessage] = useState("");
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

	// Alert Notification
	const [haveAge, setHaveAge] = useState(false);
	const [haveCheckCrm, setHaveCheckCrm] = useState(false);
	const [haveOtpContent, setHaveOtpContent] = useState(false);
	const [haveBrand, setHaveBrand] = useState(false);
	const [havePlayTurn, setHavePlayTurn] = useState(false);
	const [haveSendSms, setHaveSendSms] = useState(false);
	const [haveSendCrm, setHaveSendCrm] = useState(false);
	const [branchValue, setBranchValue] = useState([]);
	const [otpData, setOtpData] = useState([]);

	const validationSchema = yup.object({
		// gameSelect: yup.object().required("Vui lòng chọn game!"),
		// formName: yup.string().required("Vui lòng chọn tên form!"),
		smsSelect: haveSendSms && yup.object().required("Vui lòng chọn nội dung SMS!"),
		otpSelect: haveSendSms && yup.object().required("Vui lòng chọn nội dung OTP!"),
		crmSelect: haveCheckCrm && yup.string().required("Vui lòng chọn kiểu kiểm tra khách hàng trên CRM!"),
		fullName: yup.bool().oneOf([true], "Vui lòng chọn họ tên!"),
		phoneNumber: yup.bool().oneOf([true], "Vui lòng chọn số điện thoại!"),
		// inputFieldOfAge: yup.string().required('Vui lòng nhập tuổi!'),

		inputFieldOfAge: haveAge && yup.string().required("Vui lòng nhập tuổi"),

		campaign_id: haveSendCrm && yup.string().required("Vui lòng nhập campaign id!"),
		promotion_id: haveSendCrm && yup.string().required("Vui lòng nhập promotion id!"),
		channel: haveSendCrm && yup.string().required("Vui lòng nhập channel!"),
		team_push: haveSendCrm && yup.string().required("Vui lòng nhập team push!"),
		job_code: haveSendCrm && yup.string().required("Vui lòng nhập job code!"),
		note: haveSendCrm && yup.string().required("Vui lòng nhập note!"),
		// phoneNumber: yup
		//   .string('Enter your password')
		//   .min(8, 'Password should be of minimum 8 characters length')
		//   .required('Password is required'),
	});

	const formik = useFormik({
		initialValues: {
			gameSelect: "",
			formName: "",
			typeOfCustomer: "",
			typeSelect: "",
			fullName: false,
			phoneNumber: false,
			age: false,
			inputFieldOfAge: "",
			sex: false,
			male: false,
			female: false,
			staffCode: false,
			inputFieldOfStaffCode: "",
			createdDate: new Date(),
			updatedDate: null,
			otpSelect: "",
			otpCode: false,
			crmSelect: "",
			brandsName: false,
			relationship: false,
			gift: false,
			playTurn: false,
			turnNumber: "",
			checkCustomer: false,
			sendSms: false,
			smsSelect: "",
			crm: false,
			campaign_id: "",
			promotion_id: "",
			channel: "",
			team_push: "",
			job_code: "",
			note: "",
		},
		validationSchema: validationSchema,
	});

	const handleRemoveBranchValue = (selectedList, removedItem) => {
		const newArray = selectedList;
		newArray.splice(removedItem.id - 1, 1);
		return newArray;
	};
	const handleNextStep = async () => {
		const validatedObject = await formik.validateForm();
		// Check if the form has error fields
		if (Object.keys(validatedObject).length !== 0) return;

		const values = formik.values;
		// console.log(formik.values);

		const formData = {
			name: "Form Relation",
			game_name: location.state.game_name,
			game_id: location.state.game_id,
			type: "friend",
			created_user_id: 1,
			crm_info: {
				campaign_id: values.campaign_id,
				promotion_id: values.promotion_id,
				channel: values.channel,
				team_push: values.team_push,
				job_code: values.job_code,
				note: values.note,
			},
			form: [
				{field: "name", require: values.fullName},
				{field: "age", require: values.age, value: values.inputFieldOfAge},
				{field: "phone", require: values.phoneNumber},
				{field: "gender", require: values.sex},
				{
					field: "playTurn",
					require: values.playTurn,
					value: values.turnNumber,
					type: values.typeSelect,
				},
				{field: "otp", require: values.otpCode, value: values.otpSelect},
				{field: "checkCrm", require: values.checkCustomerOnCrm, value: values.crmSelect},
				{
					field: "branch",
					require: values.brandsName,
					value: branchValue,
				},
				{
					field: "gift",
					require: values.gift,
					value: values.gift ? "giftRelaVal" : "",
				},
				{
					field: "relationship",
					require: values.relationship,
				},
				{field: "crm", require: values.crm},
				{
					field: "sms",
					require: values.sendSms,
					value: values.smsSelect,
				},
			],
		};
		// console.log(formData);

		// Do not let user create form if that form is already existed
		let getFormApi = `${adminApiUrl}/games/${formData.game_id}/state`;
		const getFormResponse = await getFormByGameId(getFormApi);
		let isFriendFormExisted = getFormResponse.forms.some((form) => {
			return form.form_type == "friend";
		});
		if (isFriendFormExisted) {
			setNotiMessage("Form  người thân đã tồn tại!");
			setErrorMessage(true);
			return;
		}

		// Send Form Data to API
		const response = await fetch(`${adminApiUrl}/forms`, {
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
			body: JSON.stringify(formData), // body data type must match "Content-Type" header
		});
		const objectResponse = await response.json();
		// console.log(objectResponse);
		if (objectResponse.status === 1) {
			setNotiMessage("Tạo Form thành công!");
			setSuccessMessage(true);
			// resetForm({});
			// navigate("/quick-setup/download");

			const formData = objectResponse.data;
			const formSelectorData = {
				form_id: formData.id,
				game_id: formData.game_id,
				input_selector: {
					name: "#nameRela",
					phone: "#phoneRela",
					age: "#ageRela",
					relationship: "#relationship",
					address: "#addressRela",
					note: "#noteRela",
					gift: "#giftRela",
				},
				created_user_id: 1,
			};
			const formSelectorResponse = await fetch(`${adminApiUrl}/forms-selector`, {
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
				body: JSON.stringify(formSelectorData), // body data type must match "Content-Type" header
			});
			const objectFormSelectorResponse = await formSelectorResponse.json();

			fetch(`${adminApiUrl}/games/${location.state.game_id}/download`)
				.then((res) => res.blob())
				.then((data) => {
					var a = document.createElement("a");
					a.href = window.URL.createObjectURL(data);
					a.download = "upload";
					a.click();
				});
			navigate("/quick-setup/create-game");
			// window.location.reload();
			return;
		}
		setNotiMessage("Vui lòng kiểm tra lại thông tin!");
		setSuccessMessage(false);
	};

	async function getFormByGameId(url = "") {
		const response = await fetch(url);
		const objectData = await response.json();
		return objectData.data;
	}

	async function getSMSList(url = "") {
		const response = await fetch(url);
		const objectData = await response.json();
		// console.log(objectData.data);
		setSmsData(objectData.data.list);
	}

	async function getOTPList(url = "") {
		const response = await fetch(url);
		const objectData = await response.json();
		// console.log(objectData.data.list);
		setOtpData(objectData.data.list);
	}

	useEffect(() => {
		getSMSList(smsListApi);
		getOTPList(otpListApi);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		let ageVal = formik.values.age ? true : false;
		setHaveAge(ageVal);

		// let sexVal = formik.values.sex ? true : false;
		// setHaveSex(sexVal);

		let optVal = formik.values.otpCode ? true : false;
		setHaveOtpContent(optVal);

		let crmVal = formik.values.checkCustomerOnCrm ? true : false;
		setHaveCheckCrm(crmVal);

		let brandVal = formik.values.brandsName ? true : false;
		setHaveBrand(brandVal);

		let playTurnVal = formik.values.playTurn ? true : false;
		setHavePlayTurn(playTurnVal);

		// let checkCustomerVal = formik.values.checkCustomer ? true : false;
		// setHaveCheckCustomer(checkCustomerVal);

		let sendSmsVal = formik.values.sendSms ? true : false;
		setHaveSendSms(sendSmsVal);

		let sendCrm = formik.values.crm ? true : false;
		setHaveSendCrm(sendCrm);
	}, [formik.values]);
	// console.log(formik.values.fullName);
	// console.log(gameIdSelected);

	return (
		// Formik Form
		<form onSubmit={formik.handleSubmit}>
			<Box className="form-lead-page">
				{/************* Step Area *************/}
				<NumberStepsHeader onClick={handleNextStep} />
				{/************* Step Area *************/}
				<Box className="wrapper">
					<Box className="inner-wrapper">
						<Box sx={{flexGrow: 1}}>
							<Typography variant="h4">Form Relation</Typography>

							{/* <UserInteraction /> */}

							<Grid container>
								{/* Họ tên */}
								<Grid item md={6} xs={6} className="form-control-label-wrapper">
									<FormControlLabel
										label="Họ Tên"
										control={
											<Checkbox
												id="fullName"
												name="fullName"
												value={formik.values.fullName}
												onChange={formik.handleChange}
											/>
										}
									/>
									{formik.errors.fullName && (
										<FormHelperText
											sx={{
												fontSize: "1.2rem",
												color: "red",
												marginLeft: 0,
											}}
										>
											{formik.errors.fullName}
										</FormHelperText>
									)}
								</Grid>
								{/* Số điện thoại */}
								<Grid item md={6} xs={6} className="form-control-label-wrapper">
									<FormControlLabel
										label="Số điện thoại"
										control={
											<Checkbox
												id="phone-number"
												name="phoneNumber"
												value={formik.values.phoneNumber}
												onChange={formik.handleChange}
											/>
										}
									/>
									{formik.errors.phoneNumber && (
										<FormHelperText
											sx={{
												fontSize: "1.2rem",
												color: "red",
												marginLeft: 0,
											}}
										>
											{formik.errors.phoneNumber}
										</FormHelperText>
									)}
								</Grid>
								{/* Tuổi */}
								<Grid item md={6} xs={6} className="form-control-label-wrapper">
									<FormControlLabel
										label="Tuổi"
										control={<Checkbox id="age" name="age" value={formik.values.age} onChange={formik.handleChange} />}
									/>

									{haveAge && (
										<TextField
											id="inputFieldOfAge"
											name="inputFieldOfAge"
											className="field-of-age input-field-small"
											variant="outlined"
											size="small"
											value={formik.values.inputFieldOfAge}
											onChange={formik.handleChange}
											error={formik.touched.inputFieldOfAge && Boolean(formik.errors.inputFieldOfAge)}
											helperText={formik.touched.inputFieldOfAge && formik.errors.inputFieldOfAge}
										/>
									)}
								</Grid>

								{/* {haveAge && <TextField variant="outlined" size="small" />} */}

								{/* Giới tính */}
								<Grid item md={6} xs={6} className="form-control-label-wrapper">
									<FormControlLabel
										label="Giới tính"
										control={<Checkbox id="sex" name="sex" value={formik.values.sex} onChange={formik.handleChange} />}
									/>
								</Grid>

								{/* Phần quà */}
								<Grid item md={6} xs={6} className="form-control-label-wrapper">
									<FormControlLabel
										label="Phần quà"
										control={
											<Checkbox id="gift" name="gift" value={formik.values.gift} onChange={formik.handleChange} />
										}
									/>
								</Grid>

								{/* Chi nhánh */}
								<Grid item md={12} xs={12} className="form-control-label-wrapper branch-field">
									<FormControlLabel
										label="Chi nhánh"
										control={
											<Checkbox
												id="brandsName"
												name="brandsName"
												value={formik.values.brandsName}
												onChange={formik.handleChange}
											/>
										}
									/>
									{/* {haveBrand && (
										<Box>
											<Multiselect
												displayValue="name"
												groupBy="title"
												onKeyPressFn={function noRefCheck() {}}
												onRemove={handleRemoveBranchValue}
												onSearch={function noRefCheck() {}}
												onSelect={(selectedList, selectedItem) => setBranchValue(selectedList)}
												options={branches}
												showCheckbox
												showArrow
											/>
										</Box>
									)} */}
								</Grid>

								{/* ************************************************ */}
								{/* Mã OTP */}
								<Grid item md={12} xs={12}>
									<Typography sx={{padding: "1.2rem", borderBottom: "1px solid #333"}} variant="h6">
										Features
									</Typography>
								</Grid>
								<Grid container>
									<Grid item md={6} xs={6}>
										<Stack className="form-control-label-wrapper">
											<FormControlLabel
												label="Mã OTP"
												control={
													<Checkbox
														id="otpCode"
														name="otpCode"
														value={formik.values.otpCode}
														onChange={formik.handleChange}
													/>
												}
											/>

											{haveOtpContent && (
												<FormControl variant="outlined" sx={{minWidth: "170px"}} fullWidth>
													<InputLabel id="otp-select-label">Chọn nội dung OTP</InputLabel>
													<Select
														labelId="otp-select-label"
														name="otpSelect"
														id="otp-select"
														value={formik.values.otpSelect}
														label="Chọn nội dung OTP"
														onChange={formik.handleChange}
														error={formik.touched.otpSelect && Boolean(formik.errors.otpSelect)}
													>
														{otpData &&
															otpData.map((val) => {
																return (
																	<MenuItem key={val.id} value={val} sx={{whiteSpace: "normal"}}>
																		{val.name}
																	</MenuItem>
																);
															})}
													</Select>
													{formik.touched.otpSelect && formik.errors.otpSelect && (
														<FormHelperText
															sx={{
																fontSize: "1.2rem",
																color: "#d32f2f",
																marginLeft: 0,
															}}
														>
															{formik.errors.otpSelect}
														</FormHelperText>
													)}
												</FormControl>
											)}
										</Stack>

										{/* Lượt chơi */}
										{/* <Stack className="form-control-label-wrapper">
											<FormControlLabel
												label="Lươt chơi"
												control={
													<Checkbox
														id="play-turn"
														name="playTurn"
														value={formik.values.playTurn}
														onChange={formik.handleChange}
													/>
												}
											/>
											{havePlayTurn && (
												<Stack className="field-of-play-turn-wrapper" direction="row" alignItems="center">
													<TextField
														id="time-per-day"
														name="turnNumber"
														variant="outlined"
														value={formik.values.turnNumber}
														onChange={formik.handleChange}
														className="field-of-play-turn"
														size="small"
													/>
													<span>lần /</span>

													<FormControl variant="outlined" sx={{minWidth: "128px", marginLeft: "4px"}} size="small">
														<InputLabel id="game-select-label" sx={{fontSize: "0.8rem"}}>
															Chọn thời gian
														</InputLabel>
														<Select
															labelId="type-select-label"
															name="typeSelect"
															id="type-select"
															value={formik.values.typeSelect}
															label="Chọn thời gian"
															onChange={formik.handleChange}
															required
														>
															<MenuItem value="1">ngày</MenuItem>
															<MenuItem value="7">tuần</MenuItem>
															<MenuItem value="30">tháng</MenuItem>
														</Select>
													</FormControl>
												</Stack>
											)}
										</Stack> */}

										{/* Check khách hàng trên CRM */}
										<Stack className="form-control-label-wrapper">
											<FormControlLabel
												label="Kiểm tra khách hàng trên CRM"
												control={
													<Checkbox
														id="checkCustomerOnCrm"
														name="checkCustomerOnCrm"
														value={formik.values.checkCustomerOnCrm}
														onChange={formik.handleChange}
													/>
												}
											/>

											{haveCheckCrm && (
												<FormControl variant="outlined" sx={{minWidth: "170px"}} fullWidth>
													<InputLabel id="crm-select-label">Lựa chọn kiểm tra khách hàng trên CRM</InputLabel>
													<Select
														labelId="crm-select-label"
														name="crmSelect"
														id="crm-select"
														value={formik.values.crmSelect}
														label="Chọn nội dung OTP"
														onChange={formik.handleChange}
														error={formik.touched.crmSelect && Boolean(formik.errors.crmSelect)}
													>
														<MenuItem value="none" sx={{whiteSpace: "normal"}}>
															Không kiểm tra
														</MenuItem>
														<MenuItem value="on" sx={{whiteSpace: "normal"}}>
															Kiểm tra khách hàng có tồn tại trên CRM
														</MenuItem>
														<MenuItem value="off" sx={{whiteSpace: "normal"}}>
															Kiểm tra khách hàng không tồn tại trên CRM
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
											)}
										</Stack>

										{/* Form chung */}

										{/* Gửi SMS */}
										<Stack className="form-control-label-wrapper">
											<FormControlLabel
												label="Gửi SMS"
												control={
													<Checkbox
														id="sendSms"
														name="sendSms"
														value={formik.values.sendSms}
														onChange={formik.handleChange}
													/>
												}
											/>
											{haveSendSms && (
												// <TextField
												// 	id="inputFieldOfSmsAll"
												// 	name="inputFieldOfSmsAll"
												// 	variant="outlined"
												// 	value={formik.values.inputFieldOfSmsAll}
												// 	onChange={formik.handleChange}
												// 	className="field-of-sms"
												// 	multiline
												// 	size="medium"
												// />

												<FormControl variant="outlined" sx={{minWidth: "170px"}} fullWidth>
													<InputLabel id="sms-select-label">Chọn nội dung SMS</InputLabel>
													<Select
														labelId="sms-select-label"
														name="smsSelect"
														id="sms-select"
														value={formik.values.smsSelect}
														label="Chọn nội dung SMS"
														onChange={formik.handleChange}
														error={formik.touched.smsSelect && Boolean(formik.errors.smsSelect)}
													>
														{smsData &&
															smsData.map((sms) => {
																return (
																	<MenuItem key={sms.id} value={sms} sx={{whiteSpace: "normal"}}>
																		{sms.title}
																	</MenuItem>
																);
															})}
													</Select>
													{formik.touched.smsSelect && formik.errors.smsSelect && (
														<FormHelperText
															sx={{
																fontSize: "1.2rem",
																color: "#d32f2f",
																marginLeft: 0,
															}}
														>
															{formik.errors.smsSelect}
														</FormHelperText>
													)}
												</FormControl>
											)}
										</Stack>

										{/* Gửi CRM */}
										<Stack className="form-control-label-wrapper">
											<FormControlLabel
												label="Gửi lên CRM"
												control={
													<Checkbox id="crm" name="crm" value={formik.values.crm} onChange={formik.handleChange} />
												}
											/>
										</Stack>
									</Grid>
									<Grid item md={6} xs={6} className={formik.values.crm ? "api-row" : "api-row hidden"}>
										<Typography variant="h4">API</Typography>
										<Stack>
											<Stack className="api-contents-wrapper" direction="row">
												<Box>
													<label htmlFor="campaign_id">FK_CampaignID*</label>
													<br />
													<TextField
														id="campaign_id"
														variant="outlined"
														size="small"
														value={formik.values.campaign_id}
														onChange={formik.handleChange}
														error={formik.touched.campaign_id && Boolean(formik.errors.campaign_id)}
														helperText={formik.touched.campaign_id && formik.errors.campaign_id}
													/>
												</Box>
												<Box>
													<label htmlFor="promotion_id">PromotionId*</label>
													<br />
													<TextField
														id="promotion_id"
														variant="outlined"
														size="small"
														value={formik.values.promotion_id}
														onChange={formik.handleChange}
														error={formik.touched.promotion_id && Boolean(formik.errors.promotion_id)}
														helperText={formik.touched.promotion_id && formik.errors.promotion_id}
													/>
												</Box>
											</Stack>
											<Stack className="api-contents-wrapper" direction="row">
												<Box>
													<label htmlFor="channel">Channel*</label>
													<br />
													<TextField
														id="channel"
														variant="outlined"
														size="small"
														value={formik.values.channel}
														onChange={formik.handleChange}
														error={formik.touched.channel && Boolean(formik.errors.channel)}
														helperText={formik.touched.channel && formik.errors.channel}
													/>
												</Box>
												<Box>
													<label htmlFor="team_push">TeamPush*</label>
													<br />
													<TextField
														id="team_push"
														variant="outlined"
														size="small"
														value={formik.values.team_push}
														onChange={formik.handleChange}
														error={formik.touched.team_push && Boolean(formik.errors.team_push)}
														helperText={formik.touched.team_push && formik.errors.team_push}
													/>
												</Box>
											</Stack>
											<Stack className="api-contents-wrapper" direction="row">
												<Box>
													<label htmlFor="job_code">JobCode*</label>
													<br />
													<TextField
														id="job_code"
														variant="outlined"
														size="small"
														value={formik.values.job_code}
														onChange={formik.handleChange}
														error={formik.touched.job_code && Boolean(formik.errors.job_code)}
														helperText={formik.touched.job_code && formik.errors.job_code}
													/>
												</Box>
												<Box>
													<label htmlFor="note">Note*</label>
													<br />
													<TextField
														id="note"
														variant="outlined"
														size="small"
														value={formik.values.note}
														onChange={formik.handleChange}
														error={formik.touched.note && Boolean(formik.errors.note)}
														helperText={formik.touched.note && formik.errors.note}
													/>
												</Box>
											</Stack>
										</Stack>
									</Grid>
								</Grid>
							</Grid>
						</Box>

						{/* <div className="feature-line"></div> */}
					</Box>
				</Box>

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
				<Snackbar
					anchorOrigin={{vertical, horizontal}}
					open={errorMessage}
					autoHideDuration={4000}
					onClose={handleClose}
				>
					<Alert onClose={handleClose} severity="error" sx={{width: "100%"}}>
						{notiMessage}
					</Alert>
				</Snackbar>
			</Box>
		</form>
		// </Formik>
	);
}

export default StepFormRelation;
