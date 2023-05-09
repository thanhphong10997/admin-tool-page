import DashBoard from "./Pages/Dashboard/DashBoard";
import authProvider from "./Provider/AuthProvider";
import dataProvider from "./Provider/DataProvider";

import Address from "~/Pages/Adress";
import { AddressCreate, AddressEdit } from "~/Pages/Adress/AdressEdit";

import Role from "~/Pages/Role";
import { RoleCreate, RoleEdit } from "~/Pages/Role/RoleEdit";

import Permission from "~/Pages/Permission";
import {
	PermissionCreate,
	PermissionEdit,
} from "~/Pages/Permission/PermissionEdit";

import SMS from "~/Pages/SMS/SMS";
import { SMSCreate, SMSEdit } from "~/Pages/SMS/SMSEdit";

import LoginPage from "./Pages/Login";
import QuickSetup from "~/Pages/QuickSetup/QuickSetup";
import { CustomLayout } from "~/components/Layout";

import { Admin, CustomRoutes, Resource } from "react-admin";
import { Route } from "react-router-dom";
import FormLeadResource from "~/Pages/FormLead/FormLeadResource";
import Game from "~/Pages/Game";
import StepFormUser from "~/Pages/QuickSetup/StepFormUser";
import StepFormRelation from "~/Pages/QuickSetup/StepFormRelation";
import PhonesTest from "~/Pages/PhonesTest/PhonesTest";
import FormList from "~/Pages/FormList/FormList";
import FormLead from "~/Pages/FormLead/FormLead";
import GoogleSheet from "~/Pages/GoogleSheet/GoogleSheet";

import ListUsers from "./Pages/ListUsers/ListUsers";
import { UserCreate, UserEdit } from "~/Pages/ListUsers/UsersEdit";

import LogApi from "./Pages/Log/LogApi";
import Log from "./Pages/Log/Log";

import OTP from "~/Pages/OTP/OTP";
import { OTPCreate, OTPEdit } from "~/Pages/OTP/OTPEdit";
import GoogleSheetList from "~/Pages/GoogleSheet/GoogleSheetList";
import RolePermissionList from "~/Pages/RolePermission";
import FormListByGameId from "~/Pages/FormList/FormListByGameId";
import Template from "./Pages/template/template";
import { TemplateCreate, TemplateEdit } from "./Pages/template/templateEdit";

const App = () => (
	<Admin
		layout={CustomLayout}
		loginPage={LoginPage}
		dataProvider={dataProvider}
		dashboard={DashBoard}
		authProvider={authProvider}
	>
		<Resource name="roles" list={Role} create={RoleCreate} edit={RoleEdit} />
		<Resource
			name="permissions"
			list={Permission}
			create={PermissionCreate}
			edit={PermissionEdit}
		/>
		<Resource
			name="address"
			list={Address}
			create={AddressCreate}
			edit={AddressEdit}
		/>
		<Resource name="sms" list={SMS} create={SMSCreate} edit={SMSEdit} />
		<Resource name="otp" list={OTP} create={OTPCreate} edit={OTPEdit} />
		<Resource name="games" list={Game} />
		<Resource name="forms" list={FormLeadResource} />
		<CustomRoutes>
			<Route path="/quick-setup/create-game" element={<QuickSetup />} />
			<Route path="/quick-setup/form-user" element={<StepFormUser />} />
			<Route path="/quick-setup/form-relation" element={<StepFormRelation />} />
			<Route path="/phones-test" element={<PhonesTest />} />
			<Route path="/forms/create" element={<FormLead />} />
			<Route path="/forms" element={<FormList />} />
			<Route path="/games/sheet" element={<GoogleSheet />} />
			<Route path="/google-sheet-list" element={<GoogleSheetList />} />
			<Route path="/role-permission" element={<RolePermissionList />} />
		</CustomRoutes>
		<Resource
			name="users"
			list={ListUsers}
			create={UserCreate}
			edit={UserEdit}
		/>
		<Resource name="logs-api" list={LogApi} />
		<Resource name="logs" list={Log} />
		<Resource
			name="template"
			list={Template}
			create={TemplateCreate}
			edit={TemplateEdit}
		/>
	</Admin>
);

export default App;
