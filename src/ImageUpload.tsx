import { Box } from '@mui/material';

import { FC } from 'react';
import { useDispatch } from 'react-redux';
import CustomDropzone from './components/Dropzone/Dropzone';

interface Props {}

const ImageUpload: FC<Props> = (props: Props) => {
  const dispatch = useDispatch();

  return (
    <Box style={{ margin: '16px' }}>
      <CustomDropzone handleClose={undefined} />
    </Box>
  );
};
export default ImageUpload;
