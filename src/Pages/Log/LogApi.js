import React, { useState } from "react";
import {
  List,
  Datagrid,
  TextField,
  FunctionField,
  Filter,
  SearchInput,
} from "react-admin";
import { IconButton } from "@mui/material";
import "./Log.scss";
import Popup from "~/components/Popup/Popup";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useListContext } from 'react-admin';
import { Button } from '@mui/material';
import ContentFilter from '@mui/icons-material/FilterList';
import { TopToolbar, ExportButton } from 'react-admin';
import { Box } from '@mui/material';
import PostFilterForm from "./PostFilterForm";
// const CustomerFilter = (props) => (
//   <Filter {...props}>
//     <SearchInput placeholder="search name" source="q" resettable alwaysOn/>
//   </Filter>
// );
const PostFilterButton = () => {
  const { showFilter } = useListContext();
  return (
      <Button
          size="small"
          color="primary"
          onClick={() => showFilter("main")}
          startIcon={<ContentFilter />}
      >
          Filter
      </Button>
  );
};
const LogApi = (props) => {

  const ListActions = () => (
    <Box width="100%">
        <TopToolbar>
            <PostFilterButton />
            <ExportButton />
        </TopToolbar>
        <PostFilterForm />
    </Box>
);
  // console.log(props)
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [getContent, setGetContent] = useState("");
  return (
    // filters={<CustomerFilter/>}
    <List {...props} actions={<ListActions />}>
      <Datagrid
        optimized
        bulkActionButtons={false}
        sx={{
          "& .column-undefined": { width: "10%" },
        }}
      >
        <TextField source="id" label="id" sortable={false} />
        <TextField source="campaign_id" label="campaign_id" sortable={false} />
        <TextField
          source="campaign_name"
          label="campaign name"
          sortable={false}
        />
        <TextField source="name_api" label="name api" sortable={false} />
        <FunctionField
          label="body"
          render={(record) => (
            <IconButton
              onClick={(id) => {
                setOpenEditDialog(true);
                setGetContent(record.body);
              }}
            >
              <VisibilityIcon />
            </IconButton>
          )}
        />
        <FunctionField
          label="response"
          render={(record) => (
            <IconButton
              onClick={(id) => {
                setOpenEditDialog(true);
                setGetContent(record.response);
              }}
            >
              <VisibilityIcon />
            </IconButton>
          )}
        />
        <FunctionField
          label="SDT"
          render={(record) => JSON.parse(record.body).phone}
        />
      </Datagrid>
      {getContent && (
        <Popup
          title="body"
          buttonTitle="đóng"
          openDialog={openEditDialog}
          setOpenDialog={setOpenEditDialog}
          onClick={() => setOpenEditDialog(false)}
        >
          {getContent}
        </Popup>
      )}
    </List>
  );
};

export default LogApi;
