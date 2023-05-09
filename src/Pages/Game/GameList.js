import AddIcon from "@mui/icons-material/Add";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import {
  Box,
  Button,
  DialogContent,
  FormControl,
  FormHelperText,
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
  FormLabel,
  Switch,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { forwardRef, memo, useEffect, useMemo, useState } from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";

import Popup from "~/components/Popup/Popup";
import { GAMELISTCOLUMNS } from "~/components/Table/columns/columnListgame";
import { Table } from "~/components/Table/Table";
import "~/Pages/OverrideMiuStyles.scss";
import axios from "axios";
import { TemplateImage } from "../../emuns/templateImages";

let adminApiUrl;
if (process.env.NODE_ENV === "development") {
  adminApiUrl = process.env.REACT_APP_ADMIN_API_DEV;
} else if (process.env.NODE_ENV === "production") {
  adminApiUrl = process.env.REACT_APP_ADMIN_API_PROD;
}

function LinkRouter(props) {
  return <Link {...props} component={RouterLink} />;
}

function GameList() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathnames = location.pathname.split("/").filter((x) => x);
  const breadcrumbNameMap = {
    "/games": "Games",
  };
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [notiMessage, setNotiMessage] = useState("");
  const notiPosition = { vertical: "top", horizontal: "center" };
  const { vertical, horizontal } = notiPosition;
  const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [offsetFromTable, setOffsetFromTable] = useState(null);
  const [endOffsetFromTable, setEndOffsetFromTable] = useState(null);

  const gameListApi = `${adminApiUrl}/games?offset=${offsetFromTable}&limit=${endOffsetFromTable}&orderBy=created_date desc`;
  const getTemplateApi = `${adminApiUrl}/template`;
  const createGameApi = `${adminApiUrl}/games`;
  const columns = useMemo(() => GAMELISTCOLUMNS, []);
  const [data, setData] = useState(null);
  // Game data value
  const [gameData, setGameData] = useState({
    name: "",
    type: "",
    status: "",
    department: "",
    url: "",
    check_staff_code: false ? "ACTIVE" : "INACTIVE",
    started_date: dayjs().format("YYYY/MM/DD"),
    ended_date: dayjs().format("YYYY/MM/DD"),
    google_sheet: "",
    template: "",
    images: "",
    gift: "INACTIVE",
  });

  const [getTemplate, setGetTemplate] = useState([]);

  function changeObject(field, value) {
    setGameData({
      ...gameData,
      [field]: value,
    });
  }

  function changeChecked(field, checked){
    const check = checked ? "ACTIVE" : "INACTIVE";
    setGameData({
      ...gameData,
      [field]: check,
    });
  };
  // override the toJSON function of Date object so we can keep the browser's timezone
  // and the timezone will not be affected by JSON.stringify
  // eslint-disable-next-line no-extend-native
  Date.prototype.toJSON = function () {
    return dayjs(this).format();
  };

  // Success and error notifi
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSuccessMessage(false);
    setErrorMessage(false);
  };
  // Success notifi
  const handleCreateGame = async () => {
    const data = await createGame(createGameApi, {
      name: gameData.name,
      url: gameData.url,
      type: gameData.type,
      department: gameData.department,
      status: gameData.status,
      check_staff_code: gameData.staff_code ? "ACTIVE" : "INACTIVE",
      started_date: gameData.started_date,
      ended_date: gameData.ended_date,
      template: gameData.template,
      images: gameData.images,
      created_user_id: 1,
      gift: gameData.gift,
    });
    const { status } = data;
    if (status === 1) {
      setOpenDialog(false);
      clearFormValue();
      setNotiMessage("Tạo game thành công!");
      setSuccessMessage(true);
    } else {
      setOpenDialog(false);
      setNotiMessage("Tạo game thất bại!");
      setErrorMessage(true);
    }
    await getGameList(gameListApi);
  };

  async function createGame(url = "", data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

  const clearFormValue = () => {
    setGameData({
      name: "",
      type: "",
      status: "",
      google_sheet: "",
      department: "",
      url: "",
      staff_code: false,
      started_date: dayjs(),
      ended_date: dayjs(),
      template: "",
      images: "",
    });
  };

  async function removeGame(id, setRemoveDialog) {
    // console.log(cell.row.original.id);
    const response = await fetch(`${adminApiUrl}/games/${id}`, {
      method: "DELETE",
    });
    const objectResponse = await response.json();
    if (objectResponse.status === 1) {
      setNotiMessage("Xóa game thành công!");
      setSuccessMessage(true);
      setRemoveDialog(false);
    } else {
      setNotiMessage("Xóa game thất bại!");
      setErrorMessage(true);
      setRemoveDialog(false);
    }
    // await setData(JSON.stringify(objectData.data));
    await getGameList(gameListApi);
  }

  async function getGameList(url = "") {
    const response = await fetch(url);
    const objectData = await response.json();
    // console.log(objectData.data);
    setData(JSON.stringify(objectData.data));
    // return response;
  }
  async function hanldeGetTemplate(url = "") {
    const response = await fetch(url);
    const objectData = await response.json();
    setGetTemplate(objectData.data.list);
  }

  useEffect(() => {
    getGameList(gameListApi);
    hanldeGetTemplate(getTemplateApi);
    // getGoogleSheetList(googleSheetListApi);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const offsetPageFromTable = (offset) => {
    offset !== null && setOffsetFromTable(offset);
  };
  const endOffsetPageFromTable = (endOffset) => {
    endOffset !== null && setEndOffsetFromTable(endOffset);
  };

  const uploadImage = async (dataImage, templateKey, idTemplate) => {
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
            if (val.key === templateKey) {
              return (val.img = image);
            }
          });
        }
      });
      const listImages = imageTmp.find(
        (val) => val.idTemplate === idTemplate
      ).images;
      setGameData({
        ...gameData,
        images: JSON.stringify(listImages),
      });
      return listImages;
    } catch (error) {
      console.log("err upload image", error);
    }
  };

  return (
    <Box className="wrapper games-page" mt={2}>
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

      <Box mt="10px" overflow="hidden" borderRadius="4px">
        {data && (
          <Table
            passOffsetToParent={offsetPageFromTable}
            passEndOffsetToParent={endOffsetPageFromTable}
            itemsPerPage={10}
            columns={columns}
            data={JSON.parse(data)}
            setData={setData}
            headerTitle="Danh sách game"
            leftButton={
              <Button
                variant="contained"
                className="add_btn"
                sx={{
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  lineHeight: "1.6rem",
                }}
                startIcon={<AddIcon />}
                onClick={() => {
                  setOpenDialog(true);
                }}
              >
                Tạo game
              </Button>
            }
            rightButton={
              <Button
                variant="contained"
                className="create_sheet_btn"
                sx={{
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  lineHeight: "1.6rem",
                  width: "200px",
                  marginRight: "10px",
                }}
                startIcon={<AddIcon />}
                onClick={() => {
                  navigate("/games/sheet");
                }}
              >
                Tạo Sheet
              </Button>
            }
            removeAction={removeGame}
          />
        )}
      </Box>
      {/* Popup create game */}
      <Popup
        sx={{ maxWidth: "1000px" }}
        width="1000px"
        minHeight="265px"
        title="Tạo mới"
        buttonTitle="Lưu"
        buttonTitleIcon={<SaveOutlinedIcon />}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        onClick={handleCreateGame}
      >
        <DialogContent id="dialog-content-create-game">
          <Typography id="dialog-game-list-title" variant="h4">
            Tên campaign
          </Typography>

          <Stack direction="column" justifyContent="center">
            <FormControl>
              <TextField
                value={gameData.name}
                label="Name"
                size="small"
                sx={{ minWidth: "100%" }}
                required
                variant="outlined"
                onChange={(e) => changeObject("name", e.target.value)}
                error={!gameData.name}
                helperText={!gameData.name ? "Vui lòng nhập tên game" : ""}
              />
            </FormControl>

            <FormControl>
              <TextField
                value={gameData.department}
                label="Phòng ban"
                size="small"
                sx={{ minWidth: "100%" }}
                required
                variant="outlined"
                onChange={(e) => changeObject("department", e.target.value)}
                error={!gameData.department}
                helperText={
                  !gameData.department ? "Vui lòng nhập phòng ban" : ""
                }
              />
            </FormControl>

            <FormControl>
              <TextField
                value={gameData.url}
                label="Url"
                size="small"
                sx={{ minWidth: "100%" }}
                required
                variant="outlined"
                onChange={(e) => changeObject("url", e.target.value)}
                error={!gameData.url}
                helperText={!gameData.url ? "Vui lòng nhập đường dẫn" : ""}
              />
            </FormControl>

            <Stack direction="row" justifyContent="space-evenly">
              <FormControl
                component="span"
                sx={{ minWidth: "50%", margin: "2px" }}
                size="small"
                variant="outlined"
                required
                error={!gameData.type}
              >
                <InputLabel id="type-select-label">Loại</InputLabel>
                <Select
                  labelId="type-select-label"
                  id="type-select"
                  value={gameData.type}
                  label="Loại"
                  onChange={(e) => changeObject("type", e.target.value)}
                >
                  <MenuItem value="Form">Form</MenuItem>
                </Select>
                {!gameData.type && (
                  <FormHelperText>Vui lòng chọn loại</FormHelperText>
                )}
              </FormControl>

              <FormControl
                component="span"
                sx={{ minWidth: "50%", margin: "2px" }}
                size="small"
                required
                variant="outlined"
                error={!gameData.status}
              >
                <InputLabel id="status-select-label">Trang thái</InputLabel>
                <Select
                  labelId="status-select-label"
                  id="status-select"
                  value={gameData.status}
                  label="Trạng thái"
                  onChange={(e) => changeObject("status", e.target.value)}
                >
                  <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                  <MenuItem value="INACTIVE">INACTIVE</MenuItem>
                </Select>
                {!gameData.status && (
                  <FormHelperText>Vui lòng chọn trạng thái</FormHelperText>
                )}
              </FormControl>
            </Stack>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Stack direction="row" justifyContent="space-evenly">
                <DesktopDatePicker
                  label="Date Start"
                  inputFormat="YYYY/MM/DD"
                  value={gameData.started_date}
                  sx={{ minWidth: "40%" }}
                  onChange={(newValue) => {
                    let dateStart =
                      newValue.$y + "/" + newValue.$M + "/" + newValue.$D;
                    changeObject("started_date", dateStart);
                  }}
                  renderInput={(params) => (
                    <TextField variant="outlined" {...params} />
                  )}
                />
                <DesktopDatePicker
                  label="Date End"
                  inputFormat="YYYY/MM/DD"
                  value={gameData.ended_date}
                  sx={{ minWidth: "40%" }}
                  onChange={(newValue) => {
                    let dateEnd =
                      newValue.$y + "/" + newValue.$M + "/" + newValue.$D;
                    changeObject("ended_date", dateEnd);
                  }}
                  renderInput={(params) => (
                    <TextField variant="outlined" {...params} />
                  )}
                />
              </Stack>
            </LocalizationProvider>

            <FormControl
              component="span"
              sx={{ minWidth: "100%" }}
              size="small"
              required
              variant="outlined"
              error={!gameData.template}
            >
              <InputLabel id="template-select-label">Template</InputLabel>
              <Select
                labelId="template-select-label"
                id="tamplate-select"
                value={gameData.template}
                label="Template"
                onChange={(e) => changeObject("template", e.target.value)}
              >
                {getTemplate &&
                  getTemplate.map((val, key) => (
                    <MenuItem value={val.id} key={key}>
                      {val.name}
                    </MenuItem>
                  ))}
              </Select>
              {!gameData.template && (
                <FormHelperText>Vui lòng chọn template</FormHelperText>
              )}
            </FormControl>

            <Stack>
              {/* Ma nhan vien */}
              <FormControlLabel
                label="Mã nhân viên"
                control={
                  <Checkbox
                    id="staff-code"
                    name="staffCode"
                    onChange={(e) =>
                      changeObject("staff_code", e.target.checked)
                    }
                  />
                }
              />
              <FormControlLabel
                control={<Switch onChange={(e)=> changeChecked("gift",e.target.checked)} color="primary" />}
                label="Phần quà"
              />
            </Stack>

            {TemplateImage.map((template) => {
              if (parseInt(template.idTemplate) === gameData.template) {
                return template.images.map((images) => (
                  <Stack
                    direction={"row"}
                    justifyContent="center"
                    sx={{ margin: "8px" }}
                  >
                    <Stack
                      direction="column"
                      justifyContent="center"
                      key={images.key}
                    >
                      {images.img ? (
                        <img
                          style={{ width: "400px", height: "400px" }}
                          src={images.img}
                          alt={"hinh"}
                          loading="lazy"
                        />
                      ) : (
                        <p>Chưa có hình</p>
                      )}

                      <FilledInput
                        type="file"
                        onChange={(e) => {
                          uploadImage(
                            e.target.files[0],
                            images.key,
                            template.idTemplate
                          );
                        }}
                      />
                      <FormLabel>{images.key}</FormLabel>
                    </Stack>
                  </Stack>
                ));
              }
            })}
          </Stack>
        </DialogContent>
      </Popup>
      {/* Success Notification*/}
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={successMessage}
        autoHideDuration={4000}
        className="success-snackbar"
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          {notiMessage}
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
          {notiMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default memo(GameList);
