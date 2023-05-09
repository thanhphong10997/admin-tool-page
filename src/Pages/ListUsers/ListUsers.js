import {
  List,
  TextInput,
  Datagrid,
  TextField,
  EditButton,
  TopToolbar,
  FilterButton,
  CreateButton,
  Pagination,
  DateField,
  BooleanField,
} from "react-admin";
import "./ListUsers.scss";

const userFilters = [
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

const UserPagination = () => (
  <Pagination rowsPerPageOptions={[5, 10, 25, 50]} />
);

function ListUsers() {
  return (
    <List
      filters={userFilters}
      actions={<ListActions />}
      pagination={<UserPagination />}
    >
      <Datagrid
        optimized
        bulkActionButtons={false}
        sx={{
          "& .column-undefined": { width: "10%" },
        }}
      >
        <TextField source="id" label="id" sortable={false} />
        <TextField source="full_name" label="full name" sortable={false} />
        <TextField source="username" label="username" sortable={false} />
        {/* <TextField source="password" label="password" sortable={false} /> */}
        <EditButton />
      </Datagrid>
    </List>
  );
}

export default ListUsers;
