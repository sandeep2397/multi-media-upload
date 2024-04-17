import { ListItemIcon } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import * as React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { MdMoreVert } from 'react-icons/md';

const options = ['Edit', 'Delete'];

const ITEM_HEIGHT = 48;

interface Props {
  deleteCallbackHandler: any;
  editCallbackHandler: any;
}

const LongMenu: React.FC<Props> = (props: Props) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event?.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (
    event: React.MouseEvent<HTMLElement>,
    option: string
  ) => {
    event?.stopPropagation();
    if (option === 'Delete') {
      props.deleteCallbackHandler();
    } else if (option === 'Edit') {
      props.editCallbackHandler();
    }
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-label='more'
        id='long-button'
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup='true'
        onClick={handleClick}
      >
        <MdMoreVert />
      </IconButton>
      <Menu
        id='long-menu'
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch',
          },
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option}
            selected={option === 'Pyxis'}
            onClick={(event) => handleClose(event, option)}
          >
            <ListItemIcon>
              {option === 'Edit' ? (
                <FaEdit fontSize='small' />
              ) : (
                <FaTrash fontSize='small' />
              )}
            </ListItemIcon>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default LongMenu;
