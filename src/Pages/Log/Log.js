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

const CustomerFilter = (props) => (
  <Filter {...props}>
    <SearchInput placeholder="search name" source="action" resettable alwaysOn />
  </Filter>
);

const Log = (props) => {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [getContent, setGetContent] = useState("");

  return (
    <>
      <List {...props} filters={<CustomerFilter />}>
        <Datagrid
          optimized
          bulkActionButtons={false}
          sx={{
            "& .column-undefined": { width: "10%" },
          }}
        >
          <TextField source="id" label="id" sortable={false} />
          <TextField source="user_id" label="user_id" sortable={false} />
          <TextField source="action" label="action" sortable={false} />
          <TextField
            source="created_date"
            label="created_date"
            sortable={false}
          />
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
    </>
  );
};

export default Log;
