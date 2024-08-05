import { Box } from '@mui/material';

import { FC } from 'react';
import MediaList from './MediaList';
interface Props {}

const ImageUpload: FC<Props> = (props: Props) => {
  return (
    <Box style={{ margin: '16px' }}>
      {/* <CustomDropzone handleClose={undefined} /> */}
      <MediaList />
    </Box>
  );
};
export default ImageUpload;
