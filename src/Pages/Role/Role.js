import { Box, Typography } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import {
	CreateButton,
	Datagrid,
	EditButton,
	List,
	Pagination,
	TextField,
	TopToolbar,
} from "react-admin";
import { useRecordContext } from "react-admin";
import { useRef, useState, useEffect } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import "./Role.scss";

let adminApiUrl;

if (process.env.NODE_ENV === "development") {
	adminApiUrl = process.env.REACT_APP_ADMIN_API_DEV;
} else if (process.env.NODE_ENV === "production") {
	adminApiUrl = process.env.REACT_APP_ADMIN_API_PROD;
}

function LinkRouter(props) {
	return <Link {...props} component={RouterLink} />;
}

const roleFilters = [
	// <TextInput source="q" label="Search" alwaysOn />,
	// <ReferenceInput source="userId" label="User" reference="users" />,
];

const ListActions = () => (
	<TopToolbar>
		{/* <FilterButton /> */}
		<CreateButton className="create-btn" />
		{/* Add your custom actions */}
	</TopToolbar>
);

const RolePagination = () => (
	<Pagination rowsPerPageOptions={[5, 10, 25, 50]} />
);

const MyButton = () => {
	const record = useRecordContext();
	const navigate = useNavigate();
	const [rolePermissionData, setRolePermissionData] = useState([]);
	const handleClick = async () => {
		// if (rolePermissionData.length > 0) {
		navigate(`/role-permission`, {
			state: {
				role_permission_list: rolePermissionData,
				role_id: record.id,
			},
		});
		// }
	};

	useEffect(() => {
		const getRolePermissionData = async () => {
			const result = await axios.get(
				`${adminApiUrl}/role/${record.id}/permission`
			);
			setRolePermissionData(result?.data?.data);
		};
		getRolePermissionData();
	}, []);
	return (
		<Button
			variant="outlined"
			startIcon={<GroupAddIcon />}
			fullWidth
			onClick={handleClick}
		>
			Edit role
		</Button>
	);
};

function Role() {
	const inputRef = useRef();
	const location = useLocation();
	const pathnames = location.pathname.split("/").filter((x) => x);
	const breadcrumbNameMap = {
		"/roles": "Roles",
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

			<List
				filters={roleFilters}
				actions={<ListActions />}
				pagination={<RolePagination />}
			>
				<Datagrid
					optimized
					bulkActionButtons={false}
					sx={{
						"& .column-undefined": { width: "20%" },
					}}
				>
					<TextField
						itemRef={inputRef}
						source="id"
						label="id"
						sortable={false}
					/>
					<TextField source="role_name" label="role_name" sortable={false} />
					{/* <ReferenceField source="userId" reference="users" /> */}
					<MyButton />
					<EditButton />
				</Datagrid>
			</List>
		</Box>
	);
}

export default Role;
