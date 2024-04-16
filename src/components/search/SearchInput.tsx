import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import { FaSearch } from 'react-icons/fa';

export default function CustomizedInputBase() {
  return (
    <Paper
      component='form'
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder='Search Media'
        inputProps={{ 'aria-label': 'search Images maps' }}
      />
      <IconButton type='button' sx={{ p: '10px' }} aria-label='search'>
        <FaSearch />
      </IconButton>
      <Divider sx={{ height: 28, m: 0.5 }} orientation='vertical' />
    </Paper>
  );
}
