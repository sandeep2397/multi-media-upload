import { Box, Button, TextField, useTheme } from "@mui/material";
import { FC, useState } from "react";
// import VideoThumbnailGenerator from 'video-thumbnail-generator';
import { DialogActions } from "@mui/material";
import { FaUpload } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
// import firebase from '../../newfirebaseConfig';

import { MdHowToVote } from "react-icons/md";
import { useDispatch } from "react-redux";
import CustomDialog from "./components/Dialog/CustomDialog";
import { commonAction } from "./redux/root_actions";
import { useGetUserId } from "./utils/customHooks";
interface Props {
  handlePopupClose: (isConfirm?: any, mode?: any, rowData?: any) => void;
}

const CreateEvent: FC<Props> = (props: Props) => {
  const dispatch = useDispatch();
  const theme: any = useTheme();
  const username = useGetUserId();

  let initState = {
    name: "",
    imageUrl: "",
    dates: "",
  };
  const [state, setState] = useState<any>(initState);

  const handleAddEvent = () => {
    dispatch(
      commonAction({
        data: {
          url: `/api/v1/event/create`,
          options: {
            method: "PUT",
            body: {
              event: {
                name: "Tabletop gaming",
                dates: ["2024-09-11", "2024-09-26"],
              },
            },
          },
        },
        callback: (resp: any) => {
          props.handlePopupClose(true);
        },
      })
    );
  };

  const footer = () => {
    return (
      <DialogActions style={{ height: "30px" }}>
        <Button
          onClick={() => props.handlePopupClose(false)}
          variant="outlined"
          startIcon={<MdOutlineCancel />}
        >
          {"Cancel"}
        </Button>

        <Button
          variant="contained"
          startIcon={<FaUpload />}
          onClick={() => handleAddEvent()}
          // disabled={mediaFile === null || invalidFileType}
          style={{
            height: "32px",
            marginRight: "8px",
          }}
        >
          {"Add Vote"}
        </Button>
      </DialogActions>
    );
  };

  const body = () => {
    return (
      <Box
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(3, 1fr)`,
          gap: "20px",
          padding: "20px",
        }}
      >
        <TextField
          id="outlined-desc"
          label="Event Name"
          variant="standard"
          type="text"
          placeholder="Enter Event Name..."
          name="name"
          value={state?.name}
          onChange={(e) => {
            let val = e?.target?.value;
            setState({
              ...state,
              name: val,
            });
          }}
        />
        <TextField
          id="imageUrl"
          label="Image Url"
          variant="standard"
          type="text"
          name="name"
          placeholder="Enter Image Url..."
          value={state?.imageUrl}
          onChange={(e) => {
            let val = e?.target?.value;
            setState({
              ...state,
              imageUrl: val,
            });
          }}
        />
      </Box>
    );
  };
  return (
    <CustomDialog
      icon={MdHowToVote}
      title={"Create Event"}
      body={body()}
      customFooter={footer()}
      style={{
        transform: "translate(0px, -5%)",
        // ...style,
        // minWidth: '1050px',
        width: "1050px",
        height: "495px",
      }}
      bodyStyle={{
        minHeight: "355px",
        maxHeight: "355px",
        height: "auto",
      }}
      handleClose={() => props.handlePopupClose(false)}
    />
  );
};
export default CreateEvent;
