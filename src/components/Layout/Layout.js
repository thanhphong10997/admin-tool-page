import { Layout } from "react-admin";
import { CustomMenu } from "~/components/Menu";

export const CustomLayout = (props) => <Layout {...props} menu={CustomMenu} />;
