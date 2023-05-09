import { Create, Edit, required, SimpleForm, TextInput } from "react-admin";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { Box } from "@mui/material";

function LinkRouter(props) {
	return <Link {...props} component={RouterLink} />;
}

export const RoleEdit = () => {
	const location = useLocation();
	const pathnames = location.pathname.split("/").filter((x) => x);
	const copyPathNames = pathnames.slice(0);
	copyPathNames.splice(0, copyPathNames.length - 1);
	const handleEditPage = `/roles/${copyPathNames}`;
	const breadcrumbNameMap = {
		"/role": "Role",
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
					<TextInput disabled source="id" sx={{ display: "none" }} fullWidth />
					<TextInput source="role_name" fullWidth />
				</SimpleForm>
			</Edit>
		</Box>
	);
};

export const RoleCreate = (props) => {
	const location = useLocation();
	const pathnames = location.pathname.split("/").filter((x) => x);
	const copyPathNames = pathnames.slice(0);
	copyPathNames.splice(0, copyPathNames.length - 1);
	const handleCreatePage = `/roles/${copyPathNames}`;
	const breadcrumbNameMap = {
		"/role": "Role",
		[handleCreatePage]: "Create",
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
			<Create {...props}>
				<SimpleForm>
					{/* <ReferenceInput source="userId" reference="users" /> */}
					<TextInput
						source="role_name"
						label="role_name"
						fullWidth
						validate={[required()]}
					/>
				</SimpleForm>
			</Create>
		</Box>
	);
};
