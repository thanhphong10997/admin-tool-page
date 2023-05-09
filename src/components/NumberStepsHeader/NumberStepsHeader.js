import { Box, Button, Stack } from "@mui/material";

import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { NavLink } from "react-router-dom";
import "~/components/NumberStepsHeader/NumberStepsHeader.scss";

function NumberStepsHeader({ onClick }) {
	// console.log(store.getItem("quick-setup"));
	const doNothing = (e) => e.preventDefault();
	return (
		<Box className="header-check_code-wrapper">
			<Stack direction="row" justifyContent="center">
				<span className="number-steps-wrapper">
					<NavLink
						to="/quick-setup/create-game"
						className="nav-link-steps"
						onClick={doNothing}
					>
						<span className="number-steps">1</span>
						<span className="steps-title">Tạo game</span>
					</NavLink>
					<NavLink
						to="/quick-setup/form-user"
						className="nav-link-steps"
						onClick={doNothing}
					>
						<span className="number-steps">2</span>
						<span className="steps-title">Form User</span>
					</NavLink>
					<NavLink
						to="/quick-setup/form-relation"
						className="nav-link-steps"
						onClick={doNothing}
					>
						<span className="number-steps">3</span>
						<span className="steps-title">Form Relation</span>
					</NavLink>

					{/* <NavLink
						to="/game-list/gif"
						className="nav-link-steps"
						onClick={doNothing}
					>
						
						
						<span className="number-steps">4</span>
						<span className="steps-title">Gif</span>
					</NavLink>
					<NavLink
						to="/game-list/gift-list"
						className="nav-link-steps"
						onClick={doNothing}
					>
						<span className="number-steps">5</span>
						<span className="steps-title">Phần quà</span>
					</NavLink>
					<NavLink
						to="/game-list/receive-gift"
						className="nav-link-steps"
						onClick={doNothing}
					>
						<span className="number-steps">6</span>
						<span className="steps-title">Nhận quà</span>
					</NavLink> */}
				</span>
				<div className="line"></div>
			</Stack>
			{/************* Skip and Continue Button *************/}
			<Stack direction="row" justifyContent="flex-end">
				<Stack direction="row">
					{/* <Button className="state-btn" variant="text">
						Bỏ qua
					</Button> */}
					<Button
						className="state-btn"
						variant="text"
						type="submit"
						// disabled
						endIcon={<KeyboardArrowRightIcon />}
						onClick={onClick}
					>
						Tiếp
					</Button>
				</Stack>
			</Stack>
		</Box>
	);
}

export default NumberStepsHeader;
