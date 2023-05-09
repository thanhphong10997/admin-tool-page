import AddIcon from "@mui/icons-material/Add";
import {Box, Button, Snackbar, Typography} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import {forwardRef, memo, useEffect, useMemo, useState} from "react";
import {Link as RouterLink, useLocation, useNavigate} from "react-router-dom";
import {FORMLISTCOLUMNS} from "~/components/Table/columns/columnListForm";
import {FormListTable} from "~/components/Table/FormListTable";

import "~/Pages/OverrideMiuStyles.scss";

let adminApiUrl;
if (process.env.NODE_ENV === "development") {
	adminApiUrl = process.env.REACT_APP_ADMIN_API_DEV;
} else if (process.env.NODE_ENV === "production") {
	adminApiUrl = process.env.REACT_APP_ADMIN_API_PROD;
}

function LinkRouter(props) {
	return <Link {...props} component={RouterLink} />;
}

function FormListByGameId() {
	let navigate = useNavigate();
	const location = useLocation();
	const pathnames = location.pathname.split("/").filter((x) => x);
	const formListId = `/games/form-${location.state.game_id}`;
	const breadcrumbNameMap = {
		"/games": "Games",
		[formListId]: "Form List",
	};
	const [successMessage, setSuccessMessage] = useState(false);
	const [errorMessage, setErrorMessage] = useState(false);
	const [notiMessage, setNotiMessage] = useState("");
	const notiPosition = {vertical: "top", horizontal: "center"};
	const {vertical, horizontal} = notiPosition;
	const Alert = forwardRef(function Alert(props, ref) {
		return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
	});

	const [offsetFromTable, setOffsetFromTable] = useState(null);
	const [endOffsetFromTable, setEndOffsetFromTable] = useState(null);
	// console.log(offsetFromTable, endOffsetFromTable);
	const formListApi = `${adminApiUrl}/forms?game_id=${location.state.game_id}&offset=${offsetFromTable}&limit=${endOffsetFromTable}`;
	const columns = useMemo(() => FORMLISTCOLUMNS, []);
	// const data = useMemo(() => GAME_LIST, []);
	const [data, setData] = useState(null);

	// Success and error notifi
	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}

		setSuccessMessage(false);
		setErrorMessage(false);
	};
	// Success notifi

	async function removeForm(setRemoveDialog) {
		// console.log(cell.row.original.id);
		const response = await fetch(`${adminApiUrl}/forms/${location.state.game_id}`, {
			method: "DELETE",
		});
		const objectResponse = await response.json();
		// console.log(objectResponse);
		if (objectResponse.status === 1) {
			setNotiMessage("Xóa form thành công!");
			setSuccessMessage(true);
			setRemoveDialog(false);
		} else {
			setNotiMessage("Xóa form thất bại!");
			setErrorMessage(true);
			setRemoveDialog(false);
		}
		// await setData(JSON.stringify(objectData.data));
		await getFormList(formListApi);
	}

	async function getFormList(url = "") {
		const response = await fetch(url);
		const objectData = await response.json();
		// console.log(objectData.data);
		setData(JSON.stringify(objectData.data));
		// return response;
	}

	useEffect(() => {
		getFormList(formListApi);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const offsetPageFromTable = (offset) => {
		offset !== null && setOffsetFromTable(offset);
	};
	const endOffsetPageFromTable = (endOffset) => {
		endOffset !== null && setEndOffsetFromTable(endOffset);
	};
	return (
		<Box className="wrapper" mt={2}>
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

			<Box mt="10px" overflow="hidden" borderRadius="4px">
				{data && (
					<FormListTable
						passOffsetToParent={offsetPageFromTable}
						passEndOffsetToParent={endOffsetPageFromTable}
						itemsPerPage={10}
						columns={columns}
						data={JSON.parse(data)}
						setData={setData}
						// gameList={gameList}
						headerTitle="Danh sách Form"
						leftButton={
							<Button
								variant="contained"
								className="add_btn"
								sx={{
									fontSize: "0.8rem",
									fontWeight: 500,
									lineHeight: "1.6rem",
								}}
								startIcon={<AddIcon />}
								onClick={() => {
									// setOpenDialog(true);
									navigate("/forms/create");
								}}
							>
								Tạo form
							</Button>
						}
						removeAction={removeForm}
						formListApi={formListApi}
					/>
				)}
			</Box>

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
			<Snackbar anchorOrigin={{vertical, horizontal}} open={errorMessage} autoHideDuration={4000} onClose={handleClose}>
				<Alert onClose={handleClose} severity="error" sx={{width: "100%"}}>
					{notiMessage}
				</Alert>
			</Snackbar>
		</Box>
	);
}

export default memo(FormListByGameId);
