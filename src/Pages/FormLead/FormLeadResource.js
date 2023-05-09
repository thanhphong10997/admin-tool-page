import { List, TopToolbar } from "react-admin";
import FormLead from "./FormLead";

const ListActions = () => (
	<TopToolbar>
		{/* <FilterButton /> */}
		{/* <CreateButton className="create-btn" /> */}
		{/* Add your custom actions */}
	</TopToolbar>
);

function FormLeadResource() {
	return (
		<List
			actions={<ListActions />}
			sx={{
				"& .RaList-main .MuiToolbar-root": { display: "none" },
			}}
		>
			<FormLead />
		</List>
	);
}

export default FormLeadResource;
