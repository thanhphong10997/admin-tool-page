import { Menu } from "react-admin";

import MapIcon from "@mui/icons-material/Map";
import ListAltIcon from "@mui/icons-material/ListAlt";
import OfflineBoltIcon from "@mui/icons-material/OfflineBolt";
import SmsIcon from "@mui/icons-material/Sms";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import PersonIcon from "@mui/icons-material/Person";
import PhonelinkRingIcon from "@mui/icons-material/PhonelinkRing";
import NoteIcon from "@mui/icons-material/Note";
import PostAddIcon from "@mui/icons-material/PostAdd";
import GroupsIcon from "@mui/icons-material/Groups";
import KeyIcon from "@mui/icons-material/Key";

export const CustomMenu = () => (
	<Menu>
		<Menu.DashboardItem />
		<Menu.Item to="/forms" primaryText="Forms" leftIcon={<ListAltIcon />} />
		<Menu.Item to="/games" primaryText="Games" leftIcon={<ListAltIcon />} />
		<Menu.Item
			to="/google-sheet-list"
			primaryText="Google Sheet List"
			leftIcon={<ListAltIcon />}
		/>
		<Menu.Item to="/roles" primaryText="Role" leftIcon={<GroupsIcon />} />
		<Menu.Item
			to="/permissions"
			primaryText="Permission"
			leftIcon={<KeyIcon />}
		/>
		<Menu.Item to="/address" primaryText="Address" leftIcon={<MapIcon />} />
		<Menu.Item to="/sms" primaryText="SMS" leftIcon={<SmsIcon />} />
		<Menu.Item to="/otp" primaryText="OTP" leftIcon={<PhonelinkRingIcon />} />
		<Menu.Item
			to="/quick-setup/create-game"
			primaryText="Quick Setup"
			leftIcon={<OfflineBoltIcon />}
		/>
		<Menu.Item to="/users" primaryText="List users" leftIcon={<PersonIcon />} />
		<Menu.Item
			to="/phones-test"
			primaryText="Phone Test"
			leftIcon={<PhoneIphoneIcon />}
		/>
		<Menu.Item to="/logs-api" primaryText="Log-Api" leftIcon={<NoteIcon />} />
		<Menu.Item to="/logs" primaryText="Log" leftIcon={<NoteIcon />} />
		<Menu.Item
			to="/template"
			primaryText="Template"
			leftIcon={<PostAddIcon />}
		/>
	</Menu>
);
