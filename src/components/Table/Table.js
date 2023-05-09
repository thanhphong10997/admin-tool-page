import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditIcon from "@mui/icons-material/Edit";
import ListIcon from "@mui/icons-material/List";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";

import { useNavigate } from "react-router-dom";

import {
  DialogContent,
  DialogContentText,
  FormControl,
  FormHelperText,
  Icon,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  FilledInput,
  ImageListItem,
  FormLabel,
  Switch,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { forwardRef, memo, useEffect, useRef, useState } from "react";
import ReactPaginate from "react-paginate";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";

import PageHeader from "~/components/PageHeader";
import Popup from "~/components/Popup/Popup";
import axios from "axios";
import { TemplateImage } from "~/emuns/templateImages";
import "./Table.scss";

let adminApiUrl;
if (process.env.NODE_ENV === "development") {
  adminApiUrl = process.env.REACT_APP_ADMIN_API_DEV;
} else if (process.env.NODE_ENV === "production") {
  adminApiUrl = process.env.REACT_APP_ADMIN_API_PROD;
}

export const Table = memo(
  ({
    columns,
    data,
    setData,
    itemsPerPage,
    headerTitle,
    rightButton,
    leftButton,
    removeAction,
    passOffsetToParent,
    passEndOffsetToParent,
  }) => {
    const { total, offset, list } = data;
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(offset);
    let [increaseNumber, setIncreaseNumber] = useState(0);
    const [openRemoveDialog, setOpenRemoveDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [gameName, setGameName] = useState("");
    const [gameId, setGameId] = useState("");
    // Auto filled value
    const [autoFilledValue, setAutoFilledValue] = useState({
      name: "",
      type: "",
      status: "",
      department: "",
      url: "",
      started_date: dayjs(),
      ended_date: dayjs(),
      id_template: "",
      check_staff_code: Boolean,
      images: "",
      gift: "",
    });

    const getTemplateApi = `${adminApiUrl}/template`;
    const [getTemplate, setGetTemplate] = useState([]);

    const [successMessage, setSuccessMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);
    const notiPosition = { vertical: "top", horizontal: "center" };
    const { vertical, horizontal } = notiPosition;
    const Alert = forwardRef(function Alert(props, ref) {
      return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    let navigate = useNavigate();

    function changeObject(field, value) {
      setAutoFilledValue({
        ...autoFilledValue,
        [field]: value,
      });
    }

    function changeChecked(field, checked) {
      const check = checked ? "ACTIVE" : "INACTIVE";
      setAutoFilledValue({
        ...autoFilledValue,
        [field]: check,
      });
    }

    // Success and error notifi
    const handleClose = (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
      setSuccessMessage(false);
      setErrorMessage(false);
    };

    useEffect(() => {
      // const endOffset = itemOffset + itemsPerPage;
      // console.log(itemOffset, endOffset);
      // Fetch items from another resources.
      // console.log(`Loading items from ${itemOffset} to ${endOffset}`);
      setPageCount(Math.ceil(total / itemsPerPage));
    }, [itemOffset, itemsPerPage, total]);

    // Invoke when user click to request another page.
    const handlePageClick = async (event) => {
      const newOffset = (event.selected * itemsPerPage) % total;
      passOffsetToParent(newOffset);
      const endOffset = newOffset + itemsPerPage;
      passEndOffsetToParent(endOffset);
      // console.log(newOffset);
      // console.log(`User requested page number ${event.selected}, which is offset ${newOffset}`);
      const response = await fetch(
        `${adminApiUrl}/games?offset=${newOffset}&limit=${endOffset}&orderBy=created_date desc`
      );
      const objectResponse = await response.json();
      setItemOffset(newOffset);
      await setData(JSON.stringify(objectResponse.data));

      // Increase stt
      setIncreaseNumber(newOffset);
      gotoPage(event.selected);
    };

    // const data = useMemo(() => MOCK_DATA, []);
    const tableInstance = useTable(
      {
        columns,
        data: list,
        initialState: { pageSize: itemsPerPage },
      },
      useGlobalFilter,
      useSortBy,
      usePagination
    );

    // Increase number count

    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      page,
      nextPage,
      previousPage,
      canNextPage,
      canPreviousPage,
      pageOptions,
      // pageCount,
      gotoPage,
      prepareRow,
      state,
      setGlobalFilter,
    } = tableInstance;

    const { globalFilter } = state;

    // override the toJSON function of Date object so we can keep the browser's timezone
    // and the timezone will not be affected by JSON.stringify
    // eslint-disable-next-line no-extend-native
    Date.prototype.toJSON = function () {
      return dayjs(this).format();
    };

    const handleEditAction = async (id) => {
      const response = await fetch(`${adminApiUrl}/games/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: autoFilledValue.name,
          url: autoFilledValue.url,
          type: autoFilledValue.type,
          department: autoFilledValue.department,
          status: autoFilledValue.status,
          started_date: dayjs(new Date(autoFilledValue.started_date)).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
          ended_date: dayjs(new Date(autoFilledValue.ended_date)).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
          check_staff_code:
            autoFilledValue.check_staff_code === true ? "ACTIVE" : "INACTIVE",
          id_template: autoFilledValue.id_template,
          images: autoFilledValue.images,
          gift: autoFilledValue.gift,
        }),
      });
      const objectResponse = await response.json();
      if (objectResponse.status === 400) {
        setErrorMessage(true);
        setOpenEditDialog(false);
        return;
      }
      const endOffset = itemOffset + itemsPerPage;
      const getResponse = await fetch(
        `${adminApiUrl}/games?offset=${itemOffset}&limit=${endOffset}&orderBy=created_date desc`
      );
      const ObjectGetResponse = await getResponse.json();
      // console.log(ObjectGetResponse);
      if (ObjectGetResponse.status === 1) {
        setSuccessMessage(true);
        setOpenEditDialog(false);
      } else {
        setErrorMessage(true);
        setOpenEditDialog(false);
      }
      await setData(JSON.stringify(ObjectGetResponse.data));
    };

    useEffect(() => {
      hanldeGetTemplate(getTemplateApi);
    }, []);
    async function hanldeGetTemplate(url = "") {
      const response = await fetch(url);
      const objectData = await response.json();
      setGetTemplate(objectData.data.list);
    }
    const uploadImage = async (dataImage, key, idTemplate) => {
      let url =
        "https://upload.ngocdunggroup.com.vn/upload/images?product=LOYALTY_ADMIN&token=8af2bf38c0e4fef4602d";
      try {
        let data = {
          file1: dataImage,
        };
        const response = await axios.post(url, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        const image = response.data.data[0].url;
        let imageTmp = TemplateImage;
        imageTmp.find((images) => {
          if (images.idTemplate === idTemplate) {
            let imgtmp = images.images;
            return imgtmp.find((val) => {
              if (val.key === key) {
                return (val.img = image);
              }
            });
          }
        });
        const listImages = imageTmp.find(
          (val) => val.idTemplate === idTemplate
        ).images;
        setAutoFilledValue({
          ...autoFilledValue,
          images: JSON.stringify(listImages),
        });
        return listImages;
      } catch (error) {
        console.log("err upload image", error);
      }
    };
    return (
      <>
        <PageHeader
          rightButton={rightButton}
          leftButton={leftButton}
          headerTitle={headerTitle}
          filter={globalFilter}
          setFilter={setGlobalFilter}
        />
        <table {...getTableProps}>
          <thead>
            {headerGroups.map((headerGroup, index) => (
              <tr key={index} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, index) => (
                  <th
                    key={index}
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                  >
                    {column.render("Header")}
                    <span>
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <Icon>
                            <KeyboardArrowDownIcon />
                          </Icon>
                        ) : (
                          <Icon>
                            <KeyboardArrowUpIcon />
                          </Icon>
                        )
                      ) : (
                        ""
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps}>
            {page.map((row) => {
              prepareRow(row);

              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell, index) => {
                    return (
                      <td
                        key={index}
                        {...cell.getCellProps({ className: "center-item" })}
                      >
                        {/* STT */}
                        {cell.column.id === "stt"
                          ? cell.render(++increaseNumber)
                          : ""}

                        {cell.column.id === "detail" && cell.value === true ? (
                          <IconButton>{<VisibilityIcon />}</IconButton>
                        ) : null}

                        {cell.column.id === "edit" ? (
                          <IconButton
                            onClick={async () => {
                              // console.log('cell.row',cell.row.original);
                              setAutoFilledValue(cell.row.original);
                              setOpenEditDialog(true);
                            }}
                          >
                            {<EditIcon className="edit-icon" />}
                          </IconButton>
                        ) : null}

                        {cell.column.id === "form-list" ? (
                          <IconButton
                            onClick={async () => {
                              // console.log(cell.row.original);
                              // setAutoFilledValue(cell.row.original);
                              // setOpenEditDialog(true);
                              navigate(`/games/form-${cell.row.original.id}`, {
                                state: {
                                  game_id: cell.row.original.id,
                                },
                              });
                            }}
                          >
                            {<ListIcon className="edit-icon" />}
                          </IconButton>
                        ) : null}

                        {cell.column.id === "remove" ? (
                          <IconButton
                            onClick={() => {
                              setGameName(cell.row.values.name);
                              setOpenRemoveDialog(true);
                              setGameId(cell.row.original.id);
                            }}
                          >
                            {
                              <DeleteOutlineOutlinedIcon className="remove-icon" />
                            }
                          </IconButton>
                        ) : null}
                        {/* {console.log(cell.row.values.game_name)} */}

                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Success Notification*/}
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={successMessage}
          autoHideDuration={4000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            Chỉnh sửa game thành công!
          </Alert>
        </Snackbar>

        {/* Error Notification*/}
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={errorMessage}
          autoHideDuration={4000}
          onClose={handleClose}
        >
          <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
            Chỉnh sửa game thất bại!
          </Alert>
        </Snackbar>

        {gameName && (
          <Popup
            width="634px"
            height="184px"
            title="Xóa game"
            buttonTitle="Xóa"
            buttonTitleIcon={<DeleteOutlineOutlinedIcon />}
            openDialog={openRemoveDialog}
            setOpenDialog={setOpenRemoveDialog}
            onClick={() => removeAction(gameId, setOpenRemoveDialog)}
          >
            <DialogContent>
              <DialogContentText id="dialog-description">
                Bạn muốn xóa <span className="game-name">{gameName}?</span>
              </DialogContentText>
            </DialogContent>
          </Popup>
        )}

        <Popup
          sx={{ maxWidth: "1000px" }}
          width="1000px"
          minHeight="265px"
          title="Chỉnh sửa game"
          buttonTitle="Lưu"
          buttonTitleIcon={<SaveOutlinedIcon />}
          openDialog={openEditDialog}
          setOpenDialog={setOpenEditDialog}
          onClick={() => handleEditAction(autoFilledValue.id)}
        >
          <DialogContent>
            <Typography id="dialog-game-list-title" variant="h6">
              Tên campaign
            </Typography>

            <Stack direction="column" justifyContent="center">
              <FormControl>
                <TextField
                  value={autoFilledValue.name}
                  label="Name"
                  size="small"
                  sx={{ minWidth: "100%" }}
                  required
                  onChange={(e) => changeObject("name", e.target.value)}
                  error={!autoFilledValue.name}
                  helperText={
                    !autoFilledValue.name ? "Vui lòng nhập tên game" : ""
                  }
                />
              </FormControl>

              <FormControl>
                <TextField
                  value={autoFilledValue.department}
                  label="Phòng ban"
                  size="small"
                  sx={{ minWidth: "100%" }}
                  required
                  error={!autoFilledValue.department}
                  helperText={
                    !autoFilledValue.department ? "Vui lòng nhập phòng ban" : ""
                  }
                  onChange={(e) => changeObject("department", e.target.value)}
                />
              </FormControl>

              <FormControl>
                <TextField
                  value={autoFilledValue.url}
                  label="Url"
                  size="small"
                  sx={{ minWidth: "100%" }}
                  required
                  error={!autoFilledValue.url}
                  helperText={
                    !autoFilledValue.url ? "Vui lòng nhập đường dẫn" : ""
                  }
                  onChange={(e) => changeObject("url", e.target.value)}
                />
              </FormControl>

              <Stack direction="row" justifyContent="space-evenly">
                <FormControl
                  component="span"
                  sx={{ minWidth: "50%", margin: "2px" }}
                  size="small"
                  required
                  error={!autoFilledValue.type}
                >
                  <InputLabel id="type-select-label">Loại</InputLabel>
                  <Select
                    labelId="type-select-label"
                    id="type-select"
                    value={autoFilledValue.type}
                    label="Loại"
                    onChange={(e) => changeObject("type", e.target.value)}
                  >
                    <MenuItem value="Form">Form</MenuItem>
                  </Select>
                  {!autoFilledValue.type && (
                    <FormHelperText>Vui lòng chọn loại</FormHelperText>
                  )}
                </FormControl>

                <FormControl
                  component="span"
                  sx={{ minWidth: "50%", margin: "2px" }}
                  size="small"
                  required
                  error={!autoFilledValue.status}
                >
                  <InputLabel id="status-select-label">Trang thái</InputLabel>
                  <Select
                    labelId="status-select-label"
                    id="status-select"
                    value={autoFilledValue.status}
                    label="Trạng thái"
                    onChange={(e) => changeObject("status", e.target.value)}
                  >
                    <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                    <MenuItem value="INACTIVE">INACTIVE</MenuItem>
                  </Select>
                  {!autoFilledValue.status && (
                    <FormHelperText>Vui lòng chọn trạng thái</FormHelperText>
                  )}
                </FormControl>
              </Stack>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack direction="row" justifyContent="space-evenly">
                  <DesktopDatePicker
                    label="Date Start"
                    inputFormat="DD/MM/YYYY"
                    value={autoFilledValue.started_date}
                    sx={{ minWidth: "40%" }}
                    onChange={(newValue) => {
                      changeObject("started_date", newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                  <DesktopDatePicker
                    label="Date End"
                    inputFormat="DD/MM/YYYY"
                    value={autoFilledValue.ended_date}
                    sx={{ minWidth: "40%" }}
                    onChange={(newValue) =>
                      changeObject("ended_date", newValue)
                    }
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Stack>
              </LocalizationProvider>

              <FormControl
                component="span"
                sx={{ minWidth: 172 }}
                size="small"
                required
                variant="outlined"
                error={!autoFilledValue.id_template}
              >
                <InputLabel id="template-select-label">Template</InputLabel>
                <Select
                  labelId="template-select-label"
                  id="tamplate-select"
                  value={autoFilledValue.id_template}
                  label="Template"
                  onChange={(e) => changeObject("id_template", e.target.value)}
                >
                  {getTemplate &&
                    getTemplate.map((val, key) => (
                      <MenuItem value={val.id} key={key}>
                        {val.name}
                      </MenuItem>
                    ))}
                </Select>
                {!autoFilledValue.id_template && (
                  <FormHelperText>Vui lòng chọn template</FormHelperText>
                )}
              </FormControl>
              <FormControlLabel
                label="Mã nhân viên"
                control={
                  <Checkbox
                    id="staff-code"
                    name="staffCode"
                    onChange={(e) => {
                      changeObject("check_staff_code", e.target.checked);
                    }}
                    defaultChecked={
                      autoFilledValue.check_staff_code !== "INACTIVE" && true
                    }
                  />
                }
              />
              <FormControlLabel
                control={
                  <Switch
                    defaultChecked={autoFilledValue.gift === "ACTIVE" ? true : false}
                    onChange={(e) => changeChecked("gift", e.target.checked)}
                    color="primary"
                  />
                }
                label="Phần quà"
              />

              {TemplateImage.map((template) => {
                if (
                  parseInt(template.idTemplate) === autoFilledValue.id_template
                ) {
                  return template.images.map((val) => (
                    <Stack
                      direction={"row"}
                      justifyContent="center"
                      sx={{ margin: "8px" }}
                    >
                      <Stack
                        direction="column"
                        justifyContent="center"
                        key={val.key}
                      >
                        {!autoFilledValue.images ? (
                          <p>Chưa có hình</p>
                        ) : (
                          JSON.parse(autoFilledValue.images).map((item) => {
                            if (item.img) {
                              if (item.key === val.key)
                                return (
                                  <img
                                    src={item.img}
                                    style={{ width: "400px", height: "400px" }}
                                    alt={"hinh"}
                                    loading="lazy"
                                  />
                                );
                            }
                          })
                        )}
                        <FilledInput
                          type="file"
                          onChange={(e) => {
                            uploadImage(
                              e.target.files[0],
                              val.key,
                              template.idTemplate
                            );
                          }}
                        />
                        <FormLabel>{val.key}</FormLabel>
                      </Stack>
                    </Stack>
                  ));
                }
              })}
            </Stack>
          </DialogContent>
        </Popup>

        <Stack justifyContent="center" direction="row">
          <ReactPaginate
            breakLabel="..."
            nextLabel={
              <IconButton>
                <ArrowForwardIosOutlinedIcon />
              </IconButton>
            }
            previousLabel={
              <IconButton>
                <ArrowBackIosNewOutlinedIcon />
              </IconButton>
            }
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            marginPagesDisplayed={2}
            pageCount={pageCount}
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item prev-btn-item"
            previousLinkClassName="prev-btn-link"
            nextClassName="page-item next-btn-item"
            nextLinkClassName="next-btn-link"
            breakClassName="page-item"
            breakLinkClassName="page-link"
            containerClassName="pagination"
            activeClassName="active"
            renderOnZeroPageCount={null}
          />
        </Stack>
      </>
    );
  }
);

export const TwoColumnTable = ({
  columns,
  data,
  itemsPerPage,

  headerTitle,
  rightButton,
  leftButton,
}) => {
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [gameName, setGameName] = useState("");
  const tdRef = useRef();
  // console.log([tdRef.current]);
  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    // Fetch items from another resources.
    // console.log(`Loading items from ${itemOffset} to ${endOffset}`);
    setCurrentItems(data.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(data.length / itemsPerPage));
  }, [itemOffset, itemsPerPage]);

  // Invoke when user click to request another page.
  const handlePageClick = async (event) => {
    const newOffset = (event.selected * itemsPerPage) % data.length;
    // console.log(`User requested page number ${event.selected}, which is offset ${newOffset}`);
    setItemOffset(newOffset);
    gotoPage(event.selected);
  };

  // const columns = useMemo(() => COLUMNS, []);
  // const data = useMemo(() => MOCK_DATA, []);
  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: { pageSize: itemsPerPage },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    // pageCount,
    gotoPage,
    prepareRow,
    state,
    setGlobalFilter,
  } = tableInstance;
  // console.log(pageOptions);
  const { globalFilter } = state;

  return (
    <>
      <PageHeader
        rightButton={rightButton}
        leftButton={leftButton}
        headerTitle={headerTitle}
        filter={globalFilter}
        setFilter={setGlobalFilter}
      />
      <table {...getTableProps} className="two-colum-table">
        <tbody {...getTableBodyProps}>
          {/* <Stack direction="row" flexWrap="wrap"> */}
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  // console.log(cell);
                  return (
                    <td
                      {...cell.getCellProps(
                        cell.column.id === "full_name"
                          ? { className: "full-name-cell" }
                          : ""
                      )}
                      {...cell.getCellProps(
                        cell.column.id === "id" ? { className: "id-cell" } : ""
                      )}
                      ref={tdRef}
                      onClick={(e) => {
                        // console.log(e.target.classList);
                        e.target.classList.toggle("show-full-name");
                        // let list = tdRef.current.classList;
                        // console.log(list.add('show-full-name'));
                        // return list.add('show-full-name');
                      }}
                    >
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
          {/* </Stack> */}
        </tbody>
      </table>

      <Popup
        width="634px"
        height="184px"
        title="Xóa game"
        buttonTitle="Xóa"
        buttonTitleIcon={<DeleteOutlineOutlinedIcon />}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
      >
        <DialogContent>
          <DialogContentText id="dialog-description">
            Bạn muốn xóa <span className="game-name">{gameName}?</span>
          </DialogContentText>
        </DialogContent>
      </Popup>

      <Stack justifyContent="center" direction="row">
        <ReactPaginate
          breakLabel="..."
          nextLabel={
            <IconButton onClick={() => nextPage()} disabled={!canNextPage}>
              <ArrowForwardIosOutlinedIcon />
            </IconButton>
          }
          previousLabel={
            <IconButton
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
            >
              <ArrowBackIosNewOutlinedIcon />
            </IconButton>
          }
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          pageCount={pageCount}
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active"
          renderOnZeroPageCount={null}
        />
      </Stack>
    </>
  );
};
