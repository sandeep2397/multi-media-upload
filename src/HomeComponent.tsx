import { Box } from "@mui/material";

import { FC } from "react";
import EventShuffleList from "./EventShuffleList";
interface Props {}

const HomeComponent: FC<Props> = (props: Props) => {
  return (
    <Box style={{ margin: "16px" }}>
      {/* <CustomDropzone handleClose={undefined} /> */}
      <EventShuffleList />
    </Box>
  );
};
export default HomeComponent;
