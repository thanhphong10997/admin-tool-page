import {Box, Typography} from "@mui/material";
import {Create, Edit, SimpleForm, TextInput} from "react-admin";
import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import {Link as RouterLink, useLocation} from "react-router-dom";

function LinkRouter(props) {
	return <Link {...props} component={RouterLink} />;
}

export const OTPEdit = () => {
	const location = useLocation();
	const pathnames = location.pathname.split("/").filter((x) => x);
	const coppyPathNames = pathnames.slice(0);
	coppyPathNames.splice(0, coppyPathNames.length - 1);
	const handleEditPage = `/otp/${coppyPathNames}`;
	const breadcrumbNameMap = {
		"/otp": "OTP",
		[handleEditPage]: "Edit",
	};
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
			<Edit>
				<SimpleForm>
					{/* <ReferenceInput source="userId" reference="users" /> */}
					{/* <TextInput variant="outlined" disabled source="id" fullWidth /> */}
					<TextInput variant="outlined" source="name" fullWidth />
					<TextInput variant="outlined" multiline source="content" fullWidth minRows={4} />
				</SimpleForm>
			</Edit>
		</Box>
	);
};

export const OTPCreate = (props) => {
	const location = useLocation();
	const pathnames = location.pathname.split("/").filter((x) => x);
	const coppyPathNames = pathnames.slice(0);
	coppyPathNames.splice(0, coppyPathNames.length - 1);
	const handleCreatePage = `/otp/${coppyPathNames}`;
	const breadcrumbNameMap = {
		"/otp": "OTP",
		[handleCreatePage]: "Create",
	};
	return (
		<>
			<Box className="sms-create-page" mt={2}>
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
				<Alert variant="filled" severity="warning">
					<Grid container spacing={1}>
						<Grid item md={12}>
							Có một số các từ đặc biệt mà khi nhập bạn phải tuân theo quy tắc sau đây:
						</Grid>
						<Grid item md={4}>
							Tên khách hàng : @nameCus@
						</Grid>
						<Grid item md={4}>
							Số điện thoại khách hàng: @phoneCus@
						</Grid>
						<Grid item md={4}>
							Tên người thân: @nameRela@
						</Grid>
						<Grid item md={4}>
							Số điện thoại người thân: @phoneRela@{" "}
						</Grid>

						<Grid item md={12}>
							VD: Chào chị @nameRela@, chị @nameCus@ có gửi cho chị một phần quà là @giftRela@, chị vui lòng nhận trước
							ngày @dueDate@
						</Grid>
					</Grid>
				</Alert>
			</Box>
			<Create {...props} title="Create SMS">
				<SimpleForm>
					{/* <ReferenceInput source="userId" reference="users" /> */}
					<TextInput
						variant="outlined"
						source="created_user_id"
						label="created_user_id"
						defaultValue="1"
						sx={{display: "none"}}
						disabled
					/>
					<TextInput fullWidth variant="outlined" multiline source="name" label="Tên OTP" />
					<TextInput fullWidth variant="outlined" multiline source="content" label="Nội dung" minRows={4} />
				</SimpleForm>
			</Create>
		</>
	);
};
