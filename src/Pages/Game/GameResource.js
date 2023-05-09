import {List, TopToolbar} from "react-admin";
import GameList from "./GameList";

const ListActions = () => (
	<TopToolbar>
		{/* <FilterButton /> */}
		{/* <CreateButton className="create-btn" /> */}
		{/* Add your custom actions */}
	</TopToolbar>
);

function Game() {
	return (
		<List
			empty={false}
			actions={<ListActions />}
			sx={{
				"& .RaList-main .MuiToolbar-root": {display: "none"},
			}}
		>
			<GameList />
		</List>
	);
}

export default Game;
