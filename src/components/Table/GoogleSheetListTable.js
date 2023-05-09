import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditIcon from "@mui/icons-material/Edit";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";

import {
	DialogContent,
	DialogContentText,
	Grid,
	Icon,
	IconButton,
	Snackbar,
	Stack,
	TextField,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { Fragment, forwardRef, memo, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import {
	useGlobalFilter,
	usePagination,
	useSortBy,
	useTable,
} from "react-table";

import PageHeader from "~/components/PageHeader";
import Popup from "~/components/Popup/Popup";
import "./Table.scss";

let adminApiUrl;
if (process.env.NODE_ENV === "development") {
	adminApiUrl = process.env.REACT_APP_ADMIN_API_DEV;
} else if (process.env.NODE_ENV === "production") {
	adminApiUrl = process.env.REACT_APP_ADMIN_API_PROD;
}

export const GoogleSheetListTable = memo(
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
		const { total, offset, limit, list } = data;
		const [pageCount, setPageCount] = useState(0);
		const [itemOffset, setItemOffset] = useState(offset);
		let [increaseNumber, setIncreaseNumber] = useState(0);
		const [openRemoveDialog, setOpenRemoveDialog] = useState(false);
		const [openEditDialog, setOpenEditDialog] = useState(false);
		const [sheetTitle, setSheetTitle] = useState("");
		const [sheetId, setSheetId] = useState("");

		const [notiMessage, setNotiMessage] = useState("");
		const [successMessage, setSuccessMessage] = useState(false);
		const [errorMessage, setErrorMessage] = useState(false);
		const notiPosition = { vertical: "top", horizontal: "center" };
		const { vertical, horizontal } = notiPosition;
		const Alert = forwardRef(function Alert(props, ref) {
			return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
		});

		const [googleSheetData, setGoogleSheetData] = useState({
			title: "",
			spread_sheet_id: "",
			url: "",
			columns: "",
		});

		// Update data on click "Edit" button
		const updateDataOnChange = (field, value) => {
			setGoogleSheetData({
				...googleSheetData,
				[field]: value,
			});
		};

		// Get value from columns
		const selectorValue = (value) => {};

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
			// console.log(`User requested page number ${event.selected}, which is offset ${newOffset}`);
			const response = await fetch(
				`${adminApiUrl}/google-sheets?offset=${newOffset}&limit=${endOffset}&orderBy=created_date desc`
			);
			const objectResponse = await response.json();
			// console.log(objectResponse);
			setItemOffset(newOffset);
			await setData(JSON.stringify(objectResponse.data));

			// Increase stt
			setIncreaseNumber(newOffset);
			gotoPage(event.selected);
		};

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

		const handleEditAction = async (id) => {
			const response = await fetch(`${adminApiUrl}/google-sheets/${id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					title: googleSheetData.title,
					spread_sheet_id: googleSheetData.spread_sheet_id,
					url: googleSheetData.url,
					columns: googleSheetData.columns,
				}),
			});
			const objectResponse = await response.json();
			console.log(objectResponse);
			const endOffset = itemOffset + itemsPerPage;
			const getResponse = await fetch(
				`${adminApiUrl}/google-sheets?offset=${itemOffset}&limit=${endOffset}&orderBy=created_date desc`
			);
			const ObjectGetResponse = await getResponse.json();
			console.log(ObjectGetResponse);
			if (ObjectGetResponse.status === 1) {
				setSuccessMessage(true);
				setNotiMessage("Chỉnh sửa form thành công!");
				setOpenEditDialog(false);
			} else {
				setErrorMessage(true);
				setNotiMessage("Chỉnh sửa form thất bại!");
				setOpenEditDialog(false);
			}
			console.log(ObjectGetResponse.data);
			await setData(JSON.stringify(ObjectGetResponse.data));
		};
		// console.log(formSelectorData);
		return (
			<>
				{/* {console.log("re-render")} */}
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
										// console.log(cell);

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
													<>
														<IconButton
															onClick={() => {
																console.log(cell.row.original);
																setOpenEditDialog(true);
																setGoogleSheetData(cell.row.original);
															}}
														>
															{<EditIcon />}
														</IconButton>

														<IconButton
															onClick={() => {
																setSheetTitle(cell.row.values.title);
																setOpenRemoveDialog(true);
																setSheetId(cell.row.original.id);
															}}
														>
															{<DeleteOutlineOutlinedIcon />}
														</IconButton>
													</>
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
						Lưu thất bại
					</Alert>
				</Snackbar>

				{/* Popup edit google sheet */}
				<Popup
					width="634px"
					height="184px"
					title="Chỉnh sửa google sheet"
					buttonTitle="Lưu"
					buttonTitleIcon={<SaveOutlinedIcon />}
					openDialog={openEditDialog}
					setOpenDialog={setOpenEditDialog}
					onClick={() => handleEditAction(googleSheetData.id)}
				>
					<DialogContent>
						<Grid container spacing={2} direction="row">
							<Grid item xs={6} md={6}>
								<TextField
									fullWidth
									variant="outlined"
									value={googleSheetData.title}
									label="Title"
									size="small"
									sx={{ minWidth: 172 }}
									required
									onChange={(e) => updateDataOnChange("title", e.target.value)}
									error={!googleSheetData.title}
									helperText={
										!googleSheetData.title ? "Vui lòng nhập title" : ""
									}
								/>
							</Grid>
							<Grid item xs={6} md={6}>
								<TextField
									fullWidth
									variant="outlined"
									value={googleSheetData.spread_sheet_id}
									label="spread_sheet_id"
									size="small"
									sx={{ minWidth: 172 }}
									required
									onChange={(e) =>
										updateDataOnChange("spread_sheet_id", e.target.value)
									}
									error={!googleSheetData.spread_sheet_id}
									helperText={
										!googleSheetData.spread_sheet_id
											? "Vui lòng nhập spread_sheet_id"
											: ""
									}
								/>
							</Grid>
							<Grid item xs={12} md={12}>
								<TextField
									fullWidth
									variant="outlined"
									value={googleSheetData.url}
									label="url"
									size="small"
									sx={{ minWidth: 172 }}
									required
									onChange={(e) => updateDataOnChange("url", e.target.value)}
									error={!googleSheetData.url}
									helperText={!googleSheetData.url ? "Vui lòng nhập url" : ""}
								/>
							</Grid>

							{/* Edit text column and entry column */}
							{googleSheetData.columns &&
								JSON.parse(googleSheetData.columns).map((column, index) => {
									return (
										<Fragment key={index}>
											<Grid item xs={6} md={6}>
												<TextField
													fullWidth
													variant="outlined"
													value={column.text}
													label="selector value"
													size="small"
													sx={{ minWidth: 172 }}
													required
													// onChange={(e) => updateDataOnChange('url', e.target.value)}
													error={!column.text}
													helperText={
														!column.text ? "Vui lòng nhập selector" : ""
													}
												/>
											</Grid>
											<Grid item xs={6} md={6}>
												<TextField
													fullWidth
													variant="outlined"
													value={column.entry}
													label="entry value"
													size="small"
													sx={{ minWidth: 172 }}
													required
													// onChange={(e) => updateDataOnChange('url', e.target.value)}
													error={!column.entry}
													helperText={
														!column.entry ? "Vui lòng nhập entry" : ""
													}
												/>
											</Grid>
										</Fragment>
									);
								})}
						</Grid>
					</DialogContent>
				</Popup>

				{/* Popup remove game */}
				{sheetTitle && (
					<Popup
						width="634px"
						height="184px"
						title="Xóa sheet"
						buttonTitle="Xóa"
						buttonTitleIcon={<DeleteOutlineOutlinedIcon />}
						openDialog={openRemoveDialog}
						setOpenDialog={setOpenRemoveDialog}
						onClick={() => removeAction(sheetId, setOpenRemoveDialog)}
					>
						<DialogContent>
							<DialogContentText id="dialog-description">
								Bạn muốn xóa <span className="game-name">{sheetTitle}?</span>
							</DialogContentText>
						</DialogContent>
					</Popup>
				)}

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
	}
);
