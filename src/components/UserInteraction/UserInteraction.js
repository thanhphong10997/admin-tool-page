import {useState} from "react";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import {Button, Stack, TextField} from "@mui/material";

import "./UserInteraction.scss";

function UserInteraction({onClick}) {
	const [uploadFilePCName, setUploadFilePCName] = useState("");
	const [uploadFileMobileName, setUploadFileMobileName] = useState("");
	return (
		<Stack direction="row" alignItems="center">
			<Stack direction="row" alignItems="center" className="color-setter-wrapper" sx={{display: "none"}}>
				<p className="color-setter-title">Màu nền:</p>
				<TextField variant="outlined" sx={{width: "108px"}} size="small" label="Mã màu..." />
			</Stack>
			<Stack direction="row" alignItems="center" className="background-setter-wrapper" sx={{display: "none"}}>
				<p className="background-setter-title">Background:</p>

				<input
					accept="image/*"
					className="pc-upload-input"
					style={{display: "none"}}
					id="raised-button-file-pc"
					// multiple
					type="file"
					onChange={(e) => {
						// console.log([e.target.files[0].name]);
						const files = e.target.files[0];
						if (files) {
							setUploadFilePCName(files.name);
						} else {
							setUploadFilePCName("Please choose a file");
						}
					}}
				/>
				<label htmlFor="raised-button-file-pc">
					<Button
						component="span"
						startIcon={<AttachFileOutlinedIcon />}
						variant="outlined"
						className="background-setter-btn"
					>
						PC
					</Button>
					{uploadFilePCName && <span className="upload-file-name">{uploadFilePCName}</span>}
				</label>
				<input
					accept="image/*"
					className="pc-upload-input"
					style={{display: "none"}}
					id="raised-button-file-mobile"
					// multiple
					type="file"
					onChange={(e) => {
						// console.log([e.target.files[0].name]);
						const files = e.target.files[0];
						if (files) {
							setUploadFileMobileName(files.name);
						} else {
							setUploadFileMobileName("Please choose a file");
						}
					}}
				/>
				<label htmlFor="raised-button-file-mobile">
					<Button
						component="span"
						startIcon={<AttachFileOutlinedIcon />}
						variant="outlined"
						className="background-setter-btn"
					>
						Mobile
					</Button>
					{uploadFileMobileName && <span className="upload-file-name">{uploadFileMobileName}</span>}
				</label>
			</Stack>
			<Button
				// disabled
				startIcon={<SaveOutlinedIcon />}
				className="save-btn"
				variant="contained"
				type="submit"
				onClick={onClick}
			>
				<p className="save-btn">Lưu</p>
			</Button>
		</Stack>
	);
}

export default UserInteraction;
