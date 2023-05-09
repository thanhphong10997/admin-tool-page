import { Box, Typography } from "@mui/material";
import {
	CreateButton,
	Datagrid,
	EditButton,
	FilterButton,
	List,
	Pagination,
	TextField,
	TopToolbar,
} from "react-admin";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import { Link as RouterLink, useLocation } from "react-router-dom";

// import "./SMS.scss";

function LinkRouter(props) {
	return <Link {...props} component={RouterLink} />;
}

const smsFilters = [
	// <TextInput source="q" label="Search" alwaysOn />,
	// <ReferenceInput source="userId" label="User" reference="users" />,
];

const ListActions = () => (
	<TopToolbar>
		<FilterButton />
		<CreateButton className="create-btn" />
		{/* Add your custom actions */}
	</TopToolbar>
);

const SMSPagination = () => <Pagination rowsPerPageOptions={[5, 10, 25, 50]} />;

function SMS() {
	const location = useLocation();
	const pathnames = location.pathname.split("/").filter((x) => x);
	const breadcrumbNameMap = {
		"/sms": "SMS",
	};
	return (
		<Box className="sms-page" mt={2}>
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
			<List
				filters={smsFilters}
				actions={<ListActions />}
				pagination={<SMSPagination />}
			>
				<Datagrid
					optimized
					bulkActionButtons={false}
					sx={{
						"& .column-undefined": { width: "10%" },
					}}
				>
					<TextField
						variant="outlined"
						source="id"
						label="id"
						sortable={false}
					/>
					<TextField
						variant="outlined"
						source="title"
						label="Tên SMS"
						sortable={false}
					/>
					<TextField
						variant="outlined"
						source="content"
						label="Nội dung SMS"
						sortable={false}
					/>
					{/* <ReferenceField source="userId" reference="users" /> */}

					<EditButton />
				</Datagrid>
			</List>
		</Box>
	);
}

export default SMS;
