// import styles from './user-menu-options.module.css';
import { useState } from 'react';
import { Badge, Box, Divider, Avatar, IconButton } from "@mui/material";
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Settings } from '@mui/icons-material';

/* eslint-disable-next-line */
export interface UserMenuOptionsProps { }

export function UserMenuOptions(props: UserMenuOptionsProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box display='flex' width='20%' justifyContent='space-between' alignItems={'center'} paddingY={2} onClick={handleClose}>
      <Box>
        <Divider style={{ height: 40 }} orientation='vertical' />
      </Box>
      <Badge badgeContent={4} color="primary">
        <NotificationsIcon color="action" fontSize='small' />
      </Badge>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{ ml: 2 }}
        aria-controls={open ? 'account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <Avatar sx={{ width: 32, height: 32 }}>DT</Avatar>
        Derek
      </IconButton>
      <Settings fontSize="small" />

    </Box>

  );
}

export default UserMenuOptions;
