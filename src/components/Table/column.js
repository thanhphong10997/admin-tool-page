export const COLUMNS = [
	{
		Header: "STT",
		accessor: "id",
	},
	{
		Header: "Tên game",
		accessor: "game_name",
	},
	{
		Header: "Thời gian bắt đầu",
		accessor: "start_time",
		// Cell: ({ value }) => {
		//     return format(new Date(value), 'yyyy-MM-dd');
		// },
	},
	{
		Header: "Tên miền",
		accessor: "domain_name",
	},
	{
		Header: "Tổng số lead",
		accessor: "lead_total",
	},
	{
		Header: "Trạng thái",
		accessor: "status",
	},
	{
		Header: "Chi tiết",
		accessor: "detail",
	},
	{
		Header: "Chỉnh sửa",
		accessor: "edit",
	},
];
