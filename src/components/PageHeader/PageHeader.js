import { Box, Button, Stack } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import classNames from 'classnames/bind';
import Search from '../Search/Search';
import styles from './PageHeader.module.scss';

const cx = classNames.bind(styles);
function PageHeader({
  filter,
  setFilter,
  headerTitle,
  rightButton,
  leftButton,
}) {
  return (
    <Stack pb="10px" pt="10px" direction="row" justifyContent="space-between">
      <Stack direction="row" alignItems="center">
        <h5 className={cx('header-title')}>{headerTitle}</h5>
        {leftButton && leftButton}
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        min-width="214px"
        height="35px"
        sx={
          {
            // border: '1px solid #D9D9D9',
            // borderRadius: '4px',
          }
        }
      >
        {rightButton && rightButton}
        <Search filter={filter} setFilter={setFilter} />
      </Stack>
    </Stack>
  );
}

export default PageHeader;
