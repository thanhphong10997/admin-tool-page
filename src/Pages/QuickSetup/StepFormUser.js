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

function StepFormUser() {
	const navigate = useNavigate();
	const location = useLocation();
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

	const gameListApi = `${adminApiUrl}/games?id=${location.state.game_id}`;
	const smsListApi = `${adminApiUrl}/sms`;
	const otpListApi = `${adminApiUrl}/otp`;

	const [gameData, setGameData] = useState([]);
	const [smsData, setSmsData] = useState([]);
	const [haveAge, setHaveAge] = useState(false);
	// const [haveSexRelation, setHaveSexRelation] = useState(false);
	const [haveOtpContent, setHaveOtpContent] = useState(false);
	const [haveCheckCrm, setHaveCheckCrm] = useState(false);
	const [haveBrand, setHaveBrand] = useState(false);

	const [havePlayTurnInDay, setHavePlayTurnInDay] = useState(false);
	const [havePlayTurnInWeek, setHavePlayTurnInWeek] = useState(false);
	const [havePlayTurnInMonth, setHavePlayTurnInMonth] = useState(false);
	const [havePlayTurnInYear, setHavePlayTurnInYear] = useState(false);
	// const [haveCheckCustomer, setHaveCheckCustomer] = useState(false);
	const [haveSendSms, setHaveSendSms] = useState(false);
	const [haveSendCrm, setHaveSendCrm] = useState(false);
	const [branchValue, setBranchValue] = useState([]);
	const [otpData, setOtpData] = useState([]);

	const validationSchema = yup.object({
		// gameSelect: yup.string().required("Vui lòng chọn game!"),
		// fullName: yup.bool().oneOf([true], "Vui lòng chọn họ tên!"),
		smsSelect: haveSendSms && yup.object().required("Vui lòng chọn nội dung SMS!"),
		otpSelect: haveSendSms && yup.object().required("Vui lòng chọn nội dung OTP!"),
		crmSelect: haveCheckCrm && yup.string().required("Vui lòng chọn kiểu kiểm tra khách hàng trên CRM!"),

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
			crmSelect: "",
			otpSelect: "",
			otpCode: false,
			otpContent: "Chào{{GioiTinh}} {{tenKH}}.Mã OTP của chị là 9651.Chúc mừng chị đã đăng kí...",
			checkCustomerOnCrm: false,
			brandsName: false,
			gift: false,
			allForBrand: false,
			onlyForBrand: false,
			inputFieldOfBrandOnly: "",
			playTurnInDay: false,
			playTurnInWeek: false,
			playTurnInMonth: false,
			playTurnInYear: false,
			turnNumberInDay: "",
			turnNumberInWeek: "",
			turnNumberInMonth: "",
			turnNumberInYear: "",
			checkCustomer: false,
			oldCustomer: false,
			newCustomer: false,
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

	async function getSMSList(url = "") {
		const response = await fetch(url);
		const objectData = await response.json();
		// console.log(objectData.data);
		setSmsData(objectData.data.list);
	}

	async function getGameList(url = "") {
		const response = await fetch(url);
		const objectData = await response.json();
		// console.log(objectData.data);
		setGameData(objectData.data.list);
	}

	async function getOTPList(url = "") {
		const response = await fetch(url);
		const objectData = await response.json();
		// console.log(objectData.data.list);
		setOtpData(objectData.data.list);
	}

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
			name: "Form User",
			game_name: gameData[0].name,
			game_id: location.state.game_id,
			type: "user",
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
					require: false,
					rules: {
						day: {
							require: values.playTurnInDay,
							value: values.turnNumberInDay,
							time: 1,
						},
						week: {
							require: values.playTurnInWeek,
							value: values.turnNumberInWeek,
							time: 7,
						},
						month: {
							require: values.playTurnInMonth,
							value: values.turnNumberInMonth,
							time: 30,
						},
						year: {
							require: values.playTurnInYear,
							value: values.turnNumberInYear,
							time: 365,
						},
					},
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
					value: values.gift ? "giftCusVal" : "",
				},
				{
					field: "crm",
					require: values.crm,
				},
				{
					field: "sms",
					require: values.sendSms,
					value: values.smsSelect,
				},
			],
		};
		// console.log(formData);
		const PlayTurnField = formData.form.filter((form) => form.field === "playTurn");
		if (
			PlayTurnField[0].rules.day.require === true ||
			PlayTurnField[0].rules.week.require === true ||
			PlayTurnField[0].rules.month.require === true ||
			PlayTurnField[0].rules.year.require === true
		) {
			PlayTurnField[0].require = true;
		}

		// Do not let user create form if that form is already existed
		const getFormApi = `${adminApiUrl}/games/${formData.game_id}/state`;
		const getFormResponse = await getFormByGameId(getFormApi);
		console.log(getFormResponse);
		let isUserFormExisted = getFormResponse.forms.some((form) => {
			return form.form_type === "user";
		});
		if (isUserFormExisted) {
			setNotiMessage("Form người chơi đã tồn tại!");
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

			const formData = objectResponse.data;
			const formSelectorData = {
				form_id: formData.id,
				game_id: formData.game_id,
				input_selector: {
					name: "#nameCus",
					phone: "#phoneCus",
					age: "#ageCus",
					code: "#codeCus",
					address: "#addressCus",
					note: "#noteCus",
					gift: "#giftCus",
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
			// resetForm({});
			// navigate("/quick-setup/download");
			setTimeout(() => {
				navigate("/quick-setup/form-relation", {
					state: {
						game_id: formData.game_id,
						game_name: formData.game_name,
						// form_name: formData.name,
					},
				});
			}, 1500);

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

	useEffect(() => {
		getGameList(gameListApi);
		getSMSList(smsListApi);
		getOTPList(otpListApi);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		let ageVal = formik.values.age ? true : false;
		setHaveAge(ageVal);

		// let sexVal = formik.values.sex ? true : false;
		// setHaveSex(sexVal)

		let optVal = formik.values.otpCode ? true : false;
		setHaveOtpContent(optVal);

		let crmVal = formik.values.checkCustomerOnCrm ? true : false;
		setHaveCheckCrm(crmVal);

		let brandVal = formik.values.brandsName ? true : false;
		setHaveBrand(brandVal);

		let dayPlayTurnVal = formik.values.playTurnInDay ? true : false;
		setHavePlayTurnInDay(dayPlayTurnVal);

		let weekPlayTurnVal = formik.values.playTurnInWeek ? true : false;
		setHavePlayTurnInWeek(weekPlayTurnVal);

		let monthPlayTurnVal = formik.values.playTurnInMonth ? true : false;
		setHavePlayTurnInMonth(monthPlayTurnVal);

		let yearPlayTurnVal = formik.values.playTurnInYear ? true : false;
		setHavePlayTurnInYear(yearPlayTurnVal);

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
		<Box className="form-lead-page">
			<form onSubmit={formik.handleSubmit}>
				{/************* Step Area *************/}
				<NumberStepsHeader onClick={handleNextStep} />
				{/************* Step Area *************/}
				<Box className="wrapper">
					<Box className="inner-wrapper">
						<Box sx={{flexGrow: 1}}>
							<Typography variant="h4">Form User</Typography>

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
								<Grid item md={6} xs={6} className="form-control-label-wrapper branch-field">
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
										{/* Ngày */}
										<Stack className="form-control-label-wrapper" flexDirection="row">
											<FormControlLabel
												label="Lươt chơi trong ngày:"
												control={
													<Checkbox
														id="play-turn-in-day"
														name="playTurnInDay"
														value={formik.values.playTurnInDay}
														onChange={formik.handleChange}
														checked={havePlayTurnInDay}
													/>
												}
											/>
											{havePlayTurnInDay && (
												<Stack className="field-of-play-turn-wrapper" direction="row" alignItems="center">
													<TextField
														id="time-per-day"
														name="turnNumberInDay"
														variant="outlined"
														value={formik.values.turnNumberInDay}
														onChange={formik.handleChange}
														className="field-of-play-turn"
														size="small"
													/>
													<span>lần</span>
												</Stack>
											)}
										</Stack>

										{/* Tuần */}
										<Stack className="form-control-label-wrapper" flexDirection="row">
											<FormControlLabel
												label="Lươt chơi trong tuần:"
												control={
													<Checkbox
														id="play-turn-in-week"
														name="playTurnInWeek"
														value={formik.values.playTurnInWeek}
														onChange={formik.handleChange}
														checked={havePlayTurnInWeek}
													/>
												}
											/>
											{havePlayTurnInWeek && (
												<Stack className="field-of-play-turn-wrapper" direction="row" alignItems="center">
													<TextField
														id="time-per-week"
														name="turnNumberInWeek"
														variant="outlined"
														value={formik.values.turnNumberInWeek}
														onChange={formik.handleChange}
														className="field-of-play-turn"
														size="small"
													/>
													<span>lần</span>
												</Stack>
											)}
										</Stack>

										{/* Tháng */}
										<Stack className="form-control-label-wrapper" flexDirection="row">
											<FormControlLabel
												label="Lươt chơi trong tháng:"
												control={
													<Checkbox
														id="play-turn-in-month"
														name="playTurnInMonth"
														value={formik.values.playTurnInMonth}
														onChange={formik.handleChange}
														checked={havePlayTurnInMonth}
													/>
												}
											/>
											{havePlayTurnInMonth && (
												<Stack className="field-of-play-turn-wrapper" direction="row" alignItems="center">
													<TextField
														id="time-per-month"
														name="turnNumberInMonth"
														variant="outlined"
														value={formik.values.turnNumberInMonth}
														onChange={formik.handleChange}
														className="field-of-play-turn"
														size="small"
													/>
													<span>lần</span>
												</Stack>
											)}
										</Stack>

										{/* Năm */}
										<Stack className="form-control-label-wrapper" flexDirection="row">
											<FormControlLabel
												label="Lươt chơi trong năm:"
												control={
													<Checkbox
														id="play-turn-in-year"
														name="playTurnInYear"
														value={formik.values.playTurnInYear}
														onChange={formik.handleChange}
														checked={havePlayTurnInYear}
													/>
												}
											/>
											{havePlayTurnInYear && (
												<Stack className="field-of-play-turn-wrapper" direction="row" alignItems="center">
													<TextField
														id="time-per-year"
														name="turnNumberInYear"
														variant="outlined"
														value={formik.values.turnNumberInYear}
														onChange={formik.handleChange}
														className="field-of-play-turn"
														size="small"
													/>
													<span>lần</span>
												</Stack>
											)}
										</Stack>

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

										{/* Check KH */}
										{/* <Stack className="form-control-label-wrapper">
													<FormControlLabel
														label="Check khách hàng"
														control={
															<Checkbox
																id="checkCustomer"
																name="checkCustomer"
																value={formik.values.checkCustomer}
																onChange={formik.handleChange}
															/>
														}
													/>
													{haveCheckCustomer && (
														<Stack direction="row" justifyContent="flex-start">
															<FormControl>
																<RadioGroup
																	name="typeOfCustomer"
																	sx={{ marginLeft: "22px" }}
																	value={formik.values.typeOfCustomer}
																	onChange={formik.handleChange}
																>
																	<Stack direction="row" justifyContent="flex-start">
																		<FormControlLabel
																			sx={{ maxWidth: "80px" }}
																			value="oldCustomer"
																			control={<Radio />}
																			label="Cũ"
																		/>
																		<FormControlLabel
																			sx={{ maxWidth: "80px" }}
																			value="newCustomer"
																			control={<Radio />}
																			label="Mới"
																		/>
																	</Stack>
																</RadioGroup>
															</FormControl>
														</Stack>
													)}
												</Stack> */}

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
		</Box>
		// </Formik>
	);
}

export default StepFormUser;
