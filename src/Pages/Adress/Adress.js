import { Box, Typography } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
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
import { Link as RouterLink, useLocation } from "react-router-dom";

import "./Address.scss";

function LinkRouter(props) {
	return <Link {...props} component={RouterLink} />;
}

const addressFilters = [
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

const AddressPagination = () => (
	<Pagination rowsPerPageOptions={[5, 10, 25, 50]} />
);

function Address() {
	const location = useLocation();
	const pathnames = location.pathname.split("/").filter((x) => x);
	const breadcrumbNameMap = {
		"/address": "Address",
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
				filters={addressFilters}
				actions={<ListActions />}
				pagination={<AddressPagination />}
			>
				<Datagrid
					optimized
					bulkActionButtons={false}
					sx={{
						"& .column-undefined": { width: "10%" },
					}}
				>
					<TextField source="id" label="id" sortable={false} />
					<TextField source="crm_id" label="crm_id" sortable={false} />
					{/* <ReferenceField source="userId" reference="users" /> */}
					<TextField source="name" label="Tên chi nhánh" sortable={false} />
					<TextField source="source" label="source" sortable={false} />

					<EditButton />
				</Datagrid>
			</List>
		</Box>
	);
}

export default Address;
