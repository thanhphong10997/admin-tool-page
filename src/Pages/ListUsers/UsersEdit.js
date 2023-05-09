import {
	Create,
	Edit, required, SimpleForm, TextInput
} from "react-admin";

export const UserEdit = () => (
	<Edit>
		<SimpleForm>
			{/* <TextInput disabled source="id" /> */}
			<TextInput multiline source="full_name" label="full_name" fullWidth/>
			<TextInput source="username" fullWidth/>
			<TextInput source="password" fullWidth type='password'/>
		</SimpleForm>
	</Edit>
);

export const UserCreate = (props) => (
	<Create {...props}>
		<SimpleForm>
			{/* <ReferenceInput source="userId" reference="users" /> */}
			{/* <TextInput disabled source="id" label="id" /> */}
			{/* <TextInput
				source="createdAt"
				label="createdAt"
				defaultValue="1"
				disabled
			/> */}
			<TextInput multiline source="full_name" label="full_name" fullWidth validate={[required()]}/>
			<TextInput multiline source="username" label="username" fullWidth validate={[required()]}/>
			<TextInput multiline source="password" label="password" type="password" fullWidth validate={[required()]}/>
		</SimpleForm>
	</Create>
);
