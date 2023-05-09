import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditIcon from "@mui/icons-material/Edit";
import GradingIcon from "@mui/icons-material/Grading";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";

import {
	Box,
	DialogContent,
	DialogContentText,
	Grid,
	Icon,
	IconButton,
	Snackbar,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import {forwardRef, memo, useEffect, useState} from "react";
import ReactPaginate from "react-paginate";
import {useGlobalFilter, usePagination, useSortBy, useTable} from "react-table";

import PageHeader from "~/components/PageHeader";
import Popup from "~/components/Popup/Popup";
import "./Table.scss";

let adminApiUrl;
if (process.env.NODE_ENV === "development") {
	adminApiUrl = process.env.REACT_APP_ADMIN_API_DEV;
} else if (process.env.NODE_ENV === "production") {
	adminApiUrl = process.env.REACT_APP_ADMIN_API_PROD;
}

export const FormListTable = memo(
	({
		columns,
		data,
		setData,
		itemsPerPage,
		headerTitle,
		rightButton,
		leftButton,
		removeAction,
		passOffsetToParent,
		passEndOffsetToParent,
		formListApi
	}) => {
		const {total, offset, limit, list} = data;
		const [pageCount, setPageCount] = useState(0);
		const [itemOffset, setItemOffset] = useState(offset);
		let [increaseNumber, setIncreaseNumber] = useState(0);
		const [openRemoveDialog, setOpenRemoveDialog] = useState(false);
		const [openEditDialog, setOpenEditDialog] = useState(false);
		const [openSelectorDialog, setOpenSelectorDialog] = useState(false);
		const [formName, setFormName] = useState("");
		const [formData, setFormData] = useState(null);
		const [formSelectorData, setFormSelectorData] = useState([]);
		const [formSelectorValue, setFormSelectorValue] = useState({
			name: "",
			age: "",
			phone: "",
			gender: "",
			playTurn: "",
			otp: "",
			brand: "",
			crm: "",
			sms: "",
			googleForm: "",
		});
		const [crmData, setCrmData] = useState({
			campaign_id: "",
			promotion_id: "",
			channel: "",
			team_push: "",
			job_code: "",
			note: "",
		});
		const [notiMessage, setNotiMessage] = useState("");
		const [successMessage, setSuccessMessage] = useState(false);
		const [errorMessage, setErrorMessage] = useState(false);
		const notiPosition = {vertical: "top", horizontal: "center"};
		const {vertical, horizontal} = notiPosition;
		const Alert = forwardRef(function Alert(props, ref) {
			return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
		});

		const getFieldNameById = {
			name: "Họ tên",
			age: "Tuổi",
			phone: "Số điện thoại",
			gender: "Giới tính",
			playTurn: "Lượt chơi",
			otp: "Mã OTP",
			branch: "Chi nhánh",
			crm: "CRM",
			sms: "SMS",
			googleForm: "Google Form",
		};

		// Success and error notifi
		const handleClose = (event, reason) => {
			if (reason === "clickaway") {
				return;
			}

			setSuccessMessage(false);
			setErrorMessage(false);
		};

		useEffect(() => {
			// const endOffset = itemOffset + itemsPerPage;
			// console.log(itemOffset, endOffset);
			// Fetch items from another resources.
			// console.log(`Loading items from ${itemOffset} to ${endOffset}`);
			setPageCount(Math.ceil(total / itemsPerPage));
		}, [itemOffset, itemsPerPage]);

		// Invoke when user click to request another page.
		const handlePageClick = async (event) => {
			const newOffset = (event.selected * itemsPerPage) % total;
			passOffsetToParent(newOffset);
			const endOffset = newOffset + itemsPerPage;
			passEndOffsetToParent(endOffset);
			console.log(newOffset);
			// console.log(`User requested page number ${event.selected}, which is offset ${newOffset}`);
			const response = await fetch(
				`${adminApiUrl}/forms?offset=${newOffset}&limit=${endOffset}&orderBy=created_date desc`
			);
			const objectResponse = await response.json();
			// console.log(objectResponse);
			setItemOffset(newOffset);
			await setData(JSON.stringify(objectResponse.data));

			// Increase stt
			setIncreaseNumber(newOffset);
			gotoPage(event.selected);
		};

		// Handle when selector changes
		const onChangeSelector = (field, value) => {
			setFormSelectorValue((prev) => {
				return {
					...prev,
					[field]: value,
				};
			});
		};

		// Handle when click edit form
		const updateCrmOnClick = (field, value) => {
			setCrmData({
				...crmData,
				[field]: value,
			});
		};

		const changeFormData = (dataSelector) => {
			setFormSelectorData(dataSelector);
			console.log(dataSelector, "data change");
			console.log(formSelectorData, "formSelectorData1");
		};

		// const columns = useMemo(() => COLUMNS, []);
		// const data = useMemo(() => MOCK_DATA, []);
		const tableInstance = useTable(
			{
				columns,
				data: list,
				initialState: {pageSize: itemsPerPage},
			},
			useGlobalFilter,
			useSortBy,
			usePagination
		);

		// Increase number count

		const {
			getTableProps,
			getTableBodyProps,
			headerGroups,
			page,
			nextPage,
			previousPage,
			canNextPage,
			canPreviousPage,
			pageOptions,
			// pageCount,
			gotoPage,
			prepareRow,
			state,
			setGlobalFilter,
		} = tableInstance;

		const {globalFilter} = state;

		const handleEditAction = async (id) => {
			try {
				const response = await fetch(`${adminApiUrl}/forms/${id}`, {
					method: "PUT",
					headers: {"Content-Type": "application/json"},
					body: JSON.stringify({
						name: formData.name,
						form: formData.form,
						type: formData.type,
						game_id: formData.game_id,
						updated_user_id: 1,
						id: formData.id,
						crm_info: JSON.stringify(crmData),
					}),
				});
				const objectResponse = await response.json();
				console.log(objectResponse);
				if (objectResponse.status === 1) {
					setSuccessMessage(true);
					setNotiMessage("Chỉnh sửa form thành công!");
					setOpenEditDialog(false);
				} else {
					setErrorMessage(true);
					setNotiMessage("Chỉnh sửa form thất bại!");
					setOpenEditDialog(false);
				}
			} catch (err) {
				console.log(err);
				setErrorMessage(true);
				setNotiMessage("Chỉnh sửa form thất bại!");
				setOpenEditDialog(false);
			}
			const endOffset = itemOffset + itemsPerPage;
			const getResponse = await fetch(formListApi);
			const ObjectGetResponse = await getResponse.json();
			await setData(JSON.stringify(ObjectGetResponse.data));
		};
		// console.log(formSelectorData);
		return (
			<>
				{/* {console.log("re-render")} */}
				<PageHeader
					rightButton={rightButton}
					leftButton={leftButton}
					headerTitle={headerTitle}
					filter={globalFilter}
					setFilter={setGlobalFilter}
				/>
				<table {...getTableProps}>
					<thead>
						{headerGroups.map((headerGroup, index) => (
							<tr key={index} {...headerGroup.getHeaderGroupProps()}>
								{headerGroup.headers.map((column, index) => (
									<th key={index} {...column.getHeaderProps(column.getSortByToggleProps())}>
										{column.render("Header")}
										<span>
											{column.isSorted ? (
												column.isSortedDesc ? (
													<Icon>
														<KeyboardArrowDownIcon />
													</Icon>
												) : (
													<Icon>
														<KeyboardArrowUpIcon />
													</Icon>
												)
											) : (
												""
											)}
										</span>
									</th>
								))}
							</tr>
						))}
					</thead>
					<tbody {...getTableBodyProps}>
						{page.map((row) => {
							prepareRow(row);

							return (
								<tr {...row.getRowProps()}>
									{row.cells.map((cell, index) => {
										// console.log(cell);

										return (
											<td key={index} {...cell.getCellProps({className: "center-item"})}>
												{/* STT */}
												{cell.column.id === "stt" ? cell.render(++increaseNumber) : ""}

												{cell.column.id === "detail" && cell.value === true ? (
													<IconButton>{<VisibilityIcon />}</IconButton>
												) : null}

												{cell.column.id === "edit" ? (
													<>
														<IconButton
															onClick={() => {
																setOpenEditDialog(true);
																// let crmInfo = JSON.parse(cell.row.original.crm_info);
																let crmInfo = JSON.parse(cell.row.original.crm_info === null ? "" : cell.row.original.crm_info );
																setFormData(cell.row.original);
																setCrmData(crmInfo);
															}}
														>
															{/* {<EditIcon />} */}
															{ cell.row.original.crm_info === null ? null : <EditIcon />}
														</IconButton>

														{/* Edit Selector Icon */}
														{/* <IconButton
															onClick={() => {
																// console.log(cell.row.original);

																try {
																	console.log(cell.row.original);
																	setFormData(cell.row.original);
																	console.log(formData, "form data");
																	var dataSelector = JSON.parse(cell.row.original.form);
																	console.log(dataSelector, "data");
																	changeFormData(dataSelector);
																	//setFormSelectorData(dataSelector);
																	//console.log(formSelectorData, "formSelectorData");
																	setOpenSelectorDialog(true);
																} catch (err) {
																	console.log(err);
																}
															}}
														>
															<GradingIcon />
														</IconButton> */}

														{/* Delete Icon */}
														{/* <IconButton
															onClick={() => {
																setFormName(cell.row.values.name);
																setOpenRemoveDialog(true);
																
															}}
														>
															{<DeleteOutlineOutlinedIcon />}
														</IconButton> */}
													</>
												) : null}

												{/* {console.log(cell.row.values.game_name)} */}

												{cell.render("Cell")}
											</td>
										);
									})}
								</tr>
							);
						})}
					</tbody>
				</table>

				{/* Success Notification*/}
				<Snackbar
					anchorOrigin={{vertical, horizontal}}
					open={successMessage}
					autoHideDuration={4000}
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
				{/* Popup remove game */}
				{formName && (
					<Popup
						width="634px"
						height="184px"
						title="Xóa game"
						buttonTitle="Xóa"
						buttonTitleIcon={<DeleteOutlineOutlinedIcon />}
						openDialog={openRemoveDialog}
						setOpenDialog={setOpenRemoveDialog}
						onClick={() => removeAction(formData.id, setOpenRemoveDialog)}
					>
						<DialogContent>
							<DialogContentText id="dialog-description">
								Bạn muốn xóa <span className="game-name">{formName}?</span>
							</DialogContentText>
						</DialogContent>
					</Popup>
				)}
				{/* Popup edit form */}
				<Popup
					width="634px"
					height="184px"
					title="Chỉnh sửa Form"
					buttonTitle="Lưu"
					buttonTitleIcon={<SaveOutlinedIcon />}
					openDialog={openEditDialog}
					setOpenDialog={setOpenEditDialog}
					onClick={() => handleEditAction(formData.id)}
				>
					<DialogContent>
						<Grid container direction="row">
							<Grid item xs={6} md={6}>
								<TextField
									variant="outlined"
									value={crmData.campaign_id}
									label="Campaign ID"
									size="small"
									sx={{minWidth: 172}}
									required
									onChange={(e) => updateCrmOnClick("campaign_id", e.target.value)}
									error={!crmData.campaign_id}
									helperText={!crmData.campaign_id ? "Vui lòng nhập Campaign ID" : ""}
								/>
							</Grid>
							<Grid item xs={6} md={6}>
								<TextField
									variant="outlined"
									value={crmData.promotion_id}
									label="Promotion ID"
									size="small"
									sx={{minWidth: 172}}
									required
									onChange={(e) => updateCrmOnClick("promotion_id", e.target.value)}
									error={!crmData.promotion_id}
									helperText={!crmData.promotion_id ? "Vui lòng nhập promotion id" : ""}
								/>
							</Grid>
							<Grid item xs={6} md={6}>
								<TextField
									variant="outlined"
									value={crmData.channel}
									label="Channel"
									size="small"
									sx={{minWidth: 172}}
									required
									onChange={(e) => updateCrmOnClick("channel", e.target.value)}
									error={!crmData.channel}
									helperText={!crmData.channel ? "Vui lòng nhập channel" : ""}
								/>
							</Grid>
							<Grid item xs={6} md={6}>
								<TextField
									variant="outlined"
									value={crmData.team_push}
									label="Team Push"
									size="small"
									sx={{minWidth: 172}}
									required
									onChange={(e) => updateCrmOnClick("team_push", e.target.value)}
									error={!crmData.team_push}
									helperText={!crmData.team_push ? "Vui lòng nhập Team Push" : ""}
								/>
							</Grid>
							<Grid item xs={6} md={6}>
								<TextField
									variant="outlined"
									value={crmData.job_code}
									label="Job Code"
									size="small"
									sx={{minWidth: 172}}
									required
									onChange={(e) => updateCrmOnClick("job_code", e.target.value)}
									error={!crmData.job_code}
									helperText={!crmData.job_code ? "Vui lòng nhập Job Code" : ""}
								/>
							</Grid>
						</Grid>
					</DialogContent>
				</Popup>

				{/* Popup selector */}
				<Popup
					width="634px"
					height="184px"
					title="Chỉnh sửa selector"
					buttonTitle="Lưu"
					buttonTitleIcon={<SaveOutlinedIcon />}
					openDialog={openSelectorDialog}
					setOpenDialog={setOpenSelectorDialog}
					onClick={async () => {
						// console.log(formData);

						var selectorData = {
							form_id: formData.id,
							game_id: formData.game_id,
							input_selector: [
								{name: formSelectorValue.name},
								{age: formSelectorValue.age},
								{phone: formSelectorValue.phone},
								{gender: formSelectorValue.gender},
								{playTurn: formSelectorValue.playTurn},
								{otp: formSelectorValue.otp},
								{brand: formSelectorValue.brand},
								{crm: formSelectorValue.crm},
								{sms: formSelectorValue.sms},
								{googleForm: formSelectorValue.googleForm},
							],
							created_user_id: formData.created_user_id,
						};
						console.log(selectorData);
						const response = await fetch(`${adminApiUrl}/forms-selector`, {
							method: "POST",
							mode: "cors",
							cache: "no-cache",
							credentials: "same-origin",
							headers: {
								"Content-Type": "application/json",
							},
							redirect: "follow",
							referrerPolicy: "no-referrer",
							body: JSON.stringify(selectorData),
						});
						const objectResponse = await response.json();
						console.log(objectResponse);

						if (objectResponse.status === 1) {
							setNotiMessage("Lưu Selector thành công!");
							setSuccessMessage(true);
							setTimeout(() => {
								// window.location.reload();
							}, 1300);
							return;
						}
						setNotiMessage("Lưu Form thất bại!");
						setErrorMessage(true);
					}}
				>
					<DialogContent>
						<Typography id="dialog-game-list-title" variant="h4" textAlign="center">
							Form Selector
						</Typography>
						{formSelectorData.length != 0 && (
							<Grid container spacing={1} direction="column" alignItems="center" justifyContent="center">
								{/* {formSelectorData[0].require && (
											<>
												<Grid item xs={6} md={4}>
													<label
														htmlFor="name"
														style={{ fontSize: "20px", lineHeight: "60px" }}
													>
														Tên:{" "}
													</label>
												</Grid>
												<Grid item xs={6} md={8}>
													<TextField
														value={formSelectorValue.name}
														id="name"
														name="name"
														label="Tên"
														size="small"
														sx={{ width: "360px" }}
														required
														onChange={(e) =>
															onChangeSelector("name", e.target.value)
														}
														// onChange={formSelectorValue.name}
														error={!formSelectorValue.name}
														helperText={
															!formSelectorValue.name
																? "Chưa nhập selector của tên"
																: ""
														}
													/>
												</Grid>
											</>
										)} */}

								{/* {formSelectorData[1].require && (
											<>
												<Grid item xs={6} md={4}>
													<label
														htmlFor="age"
														style={{ fontSize: "20px", lineHeight: "60px" }}
													>
														Tuổi:{" "}
													</label>
												</Grid>
												<Grid item xs={6} md={8}>
													<TextField
														value={formSelectorValue.age}
														label="Tuổi"
														size="small"
														id="age"
														sx={{ width: "360px" }}
														required
														onChange={(e) =>
															onChangeSelector("age", e.target.value)
														}
														error={!formSelectorValue.age}
														helperText={
															!formSelectorValue.age
																? "Chưa nhập selector của tuổi"
																: ""
														}
													/>
												</Grid>
											</>
										)} */}

								{/* {formSelectorData[3].require && (
											<>
												<Grid item xs={6} md={4}>
													<label
														htmlFor="gender"
														style={{ fontSize: "20px", lineHeight: "60px" }}
													>
														Giới tính:{" "}
													</label>
												</Grid>
												<Grid item xs={6} md={8}>
													<TextField
														value={formSelectorValue.gender}
														label="Giới tính"
														size="small"
														id="gender"
														sx={{ width: "360px" }}
														required
														onChange={(e) =>
															onChangeSelector("gender", e.target.value)
														}
														error={!formSelectorValue.gender}
														helperText={
															!formSelectorValue.gender
																? "Chưa nhập selector của giới tính"
																: ""
														}
													/>
												</Grid>
											</>
										)} */}

								{/* {formSelectorData[2].require && (
											<>
												<Grid item xs={6} md={4}>
													<label
														htmlFor="phone"
														style={{ fontSize: "20px", lineHeight: "60px" }}
													>
														Số điện thoại:{" "}
													</label>
												</Grid>
												<Grid item xs={6} md={8}>
													<TextField
														value={formSelectorValue.phone}
														label="Số điện thoại"
														id="phone"
														size="small"
														sx={{ width: "360px" }}
														required
														onChange={(e) =>
															onChangeSelector("phone", e.target.value)
														}
														error={!formSelectorValue.phone}
														helperText={
															!formSelectorValue.phone
																? "Chưa nhập selector của số điện thoại"
																: ""
														}
													/>
												</Grid>
											</>
										)} */}

								{/* {formSelectorData[4].require && (
											<>
												<Grid item xs={6} md={4}>
													<label
														htmlFor="playTurn"
														style={{ fontSize: "20px", lineHeight: "60px" }}
													>
														Lượt chơi:{" "}
													</label>
												</Grid>
												<Grid item xs={6} md={8}>
													<TextField
														value={formSelectorValue.playTurn}
														label="Lượt chơi"
														id="playTurn"
														size="small"
														sx={{ width: "360px" }}
														required
														onChange={(e) =>
															onChangeSelector("playTurn", e.target.value)
														}
														error={!formSelectorValue.playTurn}
														helperText={
															!formSelectorValue.playTurn
																? "Chưa nhập selector của lượt chơi"
																: ""
														}
													/>
												</Grid>
											</>
										)} */}

								{/* {formSelectorData[5].require && (
											<>
												<Grid item xs={6} md={4}>
													<label
														htmlFor="otp"
														style={{ fontSize: "20px", lineHeight: "60px" }}
													>
														OTP:{" "}
													</label>
												</Grid>
												<Grid item xs={6} md={8}>
													<TextField
														value={formSelectorValue.otp}
														label="OTP"
														id="otp"
														size="small"
														sx={{ width: "360px" }}
														required
														onChange={(e) =>
															onChangeSelector("otp", e.target.value)
														}
														error={!formSelectorValue.otp}
														helperText={
															!formSelectorValue.otp
																? "Chưa nhập selector của otp"
																: ""
														}
													/>
												</Grid>
											</>
										)} */}

								{/* {formSelectorData[6].require && (
											<>
												<Grid item xs={6} md={4}>
													<label
														htmlFor="brand"
														style={{ fontSize: "20px", lineHeight: "60px" }}
													>
														Chi nhánh:{" "}
													</label>
												</Grid>
												<Grid item xs={6} md={8}>
													<TextField
														value={formSelectorValue.brand}
														label="Chi nhánh"
														id="brand"
														size="small"
														sx={{ width: "360px" }}
														required
														onChange={(e) =>
															onChangeSelector("brand", e.target.value)
														}
														error={!formSelectorValue.brand}
														helperText={
															!formSelectorValue.brand
																? "Chưa nhập selector của chi nhánh"
																: ""
														}
													/>
												</Grid>
											</>
										)} */}

								{/* {formSelectorData[7].require && (
											<>
												<Grid item xs={6} md={4}>
													<label
														htmlFor="checkCustomer"
														style={{ fontSize: "20px", lineHeight: "60px" }}
													>
														Check khách hàng:{" "}
													</label>
												</Grid>
												<Grid item xs={6} md={8}>
													<TextField
														value={formSelectorValue.checkCustomer}
														label="Check khách hàng"
														id="checkCustomer"
														size="small"
														sx={{ width: "360px" }}
														required
														onChange={(e) =>
															onChangeSelector("checkCustomer", e.target.value)
														}
														error={!formSelectorValue.checkCustomer}
														helperText={
															!formSelectorValue.checkCustomer
																? "Chưa nhập selector của check khách hàng"
																: ""
														}
													/>
												</Grid>
											</>
										)} */}

								{/* {formSelectorData[8].require && (
											<>
												<Grid item xs={6} md={4}>
													<label
														htmlFor="crm"
														style={{ fontSize: "20px", lineHeight: "60px" }}
													>
														Crm:{" "}
													</label>
												</Grid>
												<Grid item xs={6} md={8}>
													<TextField
														value={formSelectorValue.crm}
														label="Crm"
														id="crm"
														size="small"
														sx={{ width: "360px" }}
														required
														onChange={(e) =>
															onChangeSelector("crm", e.target.value)
														}
														error={!formSelectorValue.crm}
														helperText={
															!formSelectorValue.crm
																? "Chưa nhập selector của crm"
																: ""
														}
													/>
												</Grid>
											</>
										)} */}

								{/* {formSelectorData[9].require && (
											<>
												<Grid item xs={6} md={4}>
													<label
														htmlFor="sms"
														style={{ fontSize: "20px", lineHeight: "60px" }}
													>
														Sms:{" "}
													</label>
												</Grid>
												<Grid item xs={6} md={8}>
													<TextField
														value={formSelectorValue.sms}
														label="Sms"
														id="sms"
														size="small"
														sx={{ width: "360px" }}
														required
														onChange={(e) =>
															onChangeSelector("sms", e.target.value)
														}
														error={!formSelectorValue.sms}
														helperText={
															!formSelectorValue.sms
																? "Chưa nhập selector của sms"
																: ""
														}
													/>
												</Grid>
											</>
										)} */}

								{/* {formSelectorData[10].require && (
											<>
												<Grid item xs={6} md={4}>
													<label
														htmlFor="staffCode"
														style={{ fontSize: "20px", lineHeight: "60px" }}
													>
														Mã nhân viên:{" "}
													</label>
												</Grid>
												<Grid item xs={6} md={8}>
													<TextField
														value={formSelectorValue.staffCode}
														label="Mã nhân viên"
														id="staffCode"
														size="small"
														sx={{ width: "360px" }}
														required
														onChange={(e) =>
															onChangeSelector("staffCode", e.target.value)
														}
														error={!formSelectorValue.staffCode}
														helperText={
															!formSelectorValue.staffCode
																? "Chưa nhập selector của mã nhân viên"
																: ""
														}
													/>
												</Grid>
											</>
										)} */}

								{/* {formSelectorData[11].require && (
											<>
												<Grid item xs={6} md={4}>
													<label
														htmlFor="googleForm"
														style={{ fontSize: "20px", lineHeight: "60px" }}
													>
														Google form:{" "}
													</label>
												</Grid>
												<Grid item xs={6} md={8}>
													<TextField
														value={formSelectorValue.googleForm}
														label="Google form"
														id="googleForm"
														size="small"
														sx={{ width: "360px" }}
														required
														onChange={(e) =>
															onChangeSelector("googleForm", e.target.value)
														}
														error={!formSelectorValue.googleForm}
														helperText={
															!formSelectorValue.googleForm
																? "Chưa nhập selector của google form"
																: ""
														}
													/>
												</Grid>
											</>
										)} */}
								{formSelectorData.map((data, index) => {
									return (
										<Grid key={index} item xs={12} md={12}>
											<Box>
												<label htmlFor={data.field} style={{fontSize: "20px", lineHeight: "60px"}}>
													{getFieldNameById[data.field]}:{" "}
												</label>
											</Box>
											<Box>
												<TextField
													variant="outlined"
													value={formSelectorValue[data.field]}
													label={getFieldNameById[data.field]}
													id={data.field}
													size="small"
													sx={{width: "360px"}}
													required
													onChange={(e) => onChangeSelector(data.field, e.target.value)}
													error={!formSelectorValue[data.field]}
													helperText={
														!formSelectorValue[data.field]
															? `Chưa nhập selector của ${getFieldNameById[data.field]}`
															: ""
													}
												/>
											</Box>
										</Grid>
									);
								})}
							</Grid>
						)}
					</DialogContent>
				</Popup>

				<Stack justifyContent="center" direction="row">
					<ReactPaginate
						breakLabel="..."
						nextLabel={
							<IconButton onClick={() => nextPage()} disabled={!canNextPage}>
								<ArrowForwardIosOutlinedIcon />
							</IconButton>
						}
						previousLabel={
							<IconButton onClick={() => previousPage()} disabled={!canPreviousPage}>
								<ArrowBackIosNewOutlinedIcon />
							</IconButton>
						}
						onPageChange={handlePageClick}
						pageRangeDisplayed={3}
						marginPagesDisplayed={2}
						pageCount={pageCount}
						pageClassName="page-item"
						pageLinkClassName="page-link"
						previousClassName="page-item"
						previousLinkClassName="page-link"
						nextClassName="page-item"
						nextLinkClassName="page-link"
						breakClassName="page-item"
						breakLinkClassName="page-link"
						containerClassName="pagination"
						activeClassName="active"
						renderOnZeroPageCount={null}
					/>
				</Stack>
			</>
		);
	}
);
