export const GAMELISTCOLUMNS = [
  {
    Header: 'STT',
    accessor: 'stt',
  },
  {
    Header: 'Tên game',
    accessor: 'name',
  },
  {
    Header: 'Bắt đầu',
    accessor: 'started_date',
    // Cell: ({ value }) => {
    //     return format(new Date(value), 'yyyy-MM-dd');
    // },
  },
  {
    Header: 'Kết thúc',
    accessor: 'ended_date',
  },
  {
    Header: 'Đường dẫn',
    accessor: 'url',
  },

  {
    Header: 'Loại',
    accessor: 'type',
  },
  {
    Header: 'Phòng ban',
    accessor: 'department',
  },
  {
    Header: 'Trạng thái',
    accessor: 'status',
  },

  {
    Header: 'Chỉnh sửa',
    accessor: 'edit',
  },
  {
    Header: '',
    accessor: 'form-list',
  },
  {
    Header: '',
    accessor: 'remove',
  },
];
