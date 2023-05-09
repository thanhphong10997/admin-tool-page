import { Stack, Icon } from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { useState } from "react";
import { useAsyncDebounce } from "react-table";

function Search({ filter, setFilter }) {
	const [value, setValue] = useState(filter);
	const onChange = useAsyncDebounce((value) => {
		setFilter(value || undefined);
	}, 350);
	return (
		<Stack
			direction="row"
			alignItems="center"
			width="100%"
			height="35px"
			sx={{
				border: "1px solid #D9D9D9",
				borderRadius: "4px",
			}}
		>
			<Icon sx={{ width: "36px", color: "#6E7A8A", height: "1.2em" }}>
				<SearchOutlinedIcon />
			</Icon>
			<input
				value={value || ""}
				className="search-input"
				type="text"
				placeholder="Tìm theo tên..."
				onChange={(e) => {
					setValue(e.target.value);
					onChange(e.target.value);
				}}
			/>
		</Stack>
	);
}

export default Search;
