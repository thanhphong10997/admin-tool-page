import {
  Create,
  Edit,
  required,
  SimpleForm,
  TextInput,
  SelectInput,
} from "react-admin";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { Box } from "@mui/material";

import { RichTextInput } from "ra-input-rich-text";

function LinkRouter(props) {
  return <Link {...props} component={RouterLink} />;
}

export const TemplateEdit = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  const copyPathNames = pathnames.slice(0);
  copyPathNames.splice(0, copyPathNames.length - 1);
  const handleEditPage = `/address/${copyPathNames}`;
  const breadcrumbNameMap = {
    "/template": "Template",
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
          <TextInput source="name" fullWidth />
          <RichTextInput  variant="outlined" multiline source="body" fullWidth/>
          {/* <TextInput variant="outlined" multiline source="body" fullWidth minRows={4} /> */}
        </SimpleForm>
      </Edit>
    </Box>
  );
};

export const TemplateCreate = (props) => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  const copyPathNames = pathnames.slice(0);
  copyPathNames.splice(0, copyPathNames.length - 1);
  const handleCreatePage = `/template/${copyPathNames}`;
  const breadcrumbNameMap = {
    "/template": "Template",
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
          <TextInput source="name" label="name" fullWidth />
          {/* <TextInput source="body" fullWidth /> */}
          <RichTextInput  variant="outlined" multiline source="body" fullWidth/>
        </SimpleForm>
      </Create>
    </Box>
  );
};
