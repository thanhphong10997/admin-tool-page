import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { useLogin, useNotify } from "react-admin";
import "./Login.css";

const LoginPage = ({ theme }) => {
	const [username, setUserName] = useState("");
	const [password, setPassword] = useState("");
	const login = useLogin();
	const notify = useNotify();

	const handleSubmit = (e) => {
		e.preventDefault();
		// will call authProvider.login({ email, password })
		// console.log(login({ username, password }));
		login({ username, password })
			.then((message) => notify(message, { type: "success" }))
			.catch((message) => notify(message, { type: "warning" }));
	};

	return (
		<Box
			sx={{
				minHeight: "100vh",
				height: "1px",
				backgroundImage:
					"radial-gradient(circle at 50% 14em, #313264 0%, #00023b 60%, #00023b 100%)",
				backgroundSize: "cover",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<Card sx={{ minWidth: "300px", margin: "0 auto", marginTop: "6em" }}>
				<form onSubmit={handleSubmit}>
					<CardContent>
						<Stack direction="column">
							<TextField
								name="username"
								type="username"
								placeholder="Username"
								value={username}
								onChange={(e) => setUserName(e.target.value)}
							/>
							<TextField
								name="password"
								type="password"
								placeholder="Password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</Stack>
					</CardContent>
					<CardActions>
						<Button
							className="log-in-btn"
							size="small"
							type="submit"
							variant="contained"
						>
							Sign In
						</Button>
					</CardActions>
				</form>
			</Card>
		</Box>
	);
};

export default LoginPage;
