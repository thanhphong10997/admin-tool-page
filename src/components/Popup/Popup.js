import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import {
	Button,
	Dialog,
	DialogActions,
	DialogTitle,
	IconButton,
} from "@mui/material";

function Popup({
	children,
	width,
	minHeight,
	title,
	buttonTitle,
	buttonTitleIcon,
	openDialog,
	setOpenDialog,
	onClick,
}) {
	// const [openDialog, setOpenDialog] = useState(false);
	return (
		<Dialog
			PaperProps={{
				sx: { width: { width }, minHeight: { minHeight }, maxWidth: "unset" },
			}}
			className="dialog-container"
			aria-labelledby="dialog-title"
			aria-describedby="dialog-description"
			open={openDialog}
			onClose={() => setOpenDialog(false)}
		>
			<DialogTitle id="dialog-title">{title}</DialogTitle>
			<IconButton onClick={() => setOpenDialog(false)} className="close-btn">
				<CloseOutlinedIcon />
			</IconButton>
			{children}
			<DialogActions>
				{/* <Button onClick={() => setOpenDialog(false)}>Cancel</Button> */}
				<Button
					type="submit"
					startIcon={buttonTitleIcon}
					variant="contained"
					onClick={onClick}
				>
					<span style={{ display: "inline-block", height: "21px" }}>
						{buttonTitle}
					</span>
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default Popup;