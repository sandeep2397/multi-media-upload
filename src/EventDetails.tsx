import {
  Button,
  CardContent,
  CardHeader,
  Checkbox,
  CircularProgress,
  Divider,
  Typography,
  useTheme,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
// import VideoThumbnailGenerator from 'video-thumbnail-generator';
import { DialogActions } from "@mui/material";
import "firebase/storage";
import { FaUpload } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
// import firebase from '../../newfirebaseConfig';

import { cloneDeep } from "lodash";
import { MdHowToVote } from "react-icons/md";
import { useDispatch } from "react-redux";
import CustomDialog from "./components/Dialog/CustomDialog";
import { commonAction } from "./redux/root_actions";
import { StyledCard } from "./style";
import { useGetUserId } from "./utils/customHooks";
interface Props {
  handlePopupClose: (isConfirm?: any, mode?: any, rowData?: any) => void;
  rowData?: any;
}

const EventDetails: FC<Props> = (props: Props) => {
  const dispatch = useDispatch();
  const theme: any = useTheme();
  const username = useGetUserId();

  const [eventData, setEventData] = useState<Record<string, any>>({});
  const [checkList, setCheckedList] = useState<any>([]);
  const [selectedDateList, setSelectedDateList] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const fetchAllEvents = async () => {
    dispatch(
      commonAction({
        data: {
          url: `/api/v1/event/${props.rowData?._id}/results`,
        },
        callback: (resp: any) => {
          const dateList = props.rowData?.dates || [];
          const boolVals = new Array(dateList?.length).fill(false);
          setCheckedList(boolVals);
          setEventData(resp);
          setLoading(false);
        },
      })
    );
  };
  useEffect(() => {
    setLoading(true);
    fetchAllEvents();
  }, []);

  const handleAddVote = () => {
    dispatch(
      commonAction({
        data: {
          url: `/api/v1/event/${props.rowData?._id}/votes`,
          options: {
            method: "PUT",
            body: {
              name: username,
              votes: selectedDateList,
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
          onClick={() => handleAddVote()}
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
    const availableDates = props.rowData?.dates || [];
    const eventVotes = eventData?.event?.votes || [];
    const suitableDateInfo = eventData?.suitableDates || {};
    const peopleList = suitableDateInfo?.people || [];
    const namesString = peopleList.map((obj: any) => obj.username).join(", ");
    return loading ? (
      <div style={{ padding: "16px" }}>
        <CircularProgress />
      </div>
    ) : (
      <>
        <Typography
          style={{ fontSize: "16px", fontWeight: 500, padding: "0px 16px" }}
        >
          Select any of the dates mentioned
        </Typography>
        <div className="card-container">
          {availableDates?.map((date: string, index: number) => {
            const desiredDate = eventVotes?.find(
              (voteInfo: any) => voteInfo?.date === date
            );
            return (
              <div className="card-item">
                <StyledCard
                  style={{
                    height: "auto",
                    width: "150px",
                    minWidth: "300px",
                    border: checkList?.[index]
                      ? `solid 1.5px  ${theme?.palette?.primary?.main}`
                      : "none",
                  }}
                >
                  {" "}
                  <CardHeader
                    title={date}
                    style={{ fontSize: "14px" }}
                    action={
                      <>
                        <Checkbox
                          checked={checkList?.[index]}
                          onChange={(event: any) => {
                            let newCheckedList = selectedDateList;
                            if (checkList[index]) {
                              newCheckedList = selectedDateList?.filter(
                                (selectedDate: any) => selectedDate != date
                              );
                            } else {
                              newCheckedList?.push(date);
                            }
                            console.log("newCheckedList", newCheckedList);
                            let temp = cloneDeep(checkList);
                            temp[index] = !checkList[index];
                            setCheckedList(temp);
                            setSelectedDateList(newCheckedList);
                          }}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      </>
                    }
                  >
                    {" "}
                  </CardHeader>{" "}
                  <Divider></Divider>
                  <CardContent style={{ padding: "8px" }}>
                    <Typography color="error" style={{ fontWeight: "500" }}>
                      {" "}
                      {`${desiredDate?.people?.length ?? 0}`}{" "}
                      {` ${
                        desiredDate?.people?.length === 1
                          ? "person has"
                          : "people have"
                      }`}{" "}
                      who voted before
                    </Typography>
                    <ul
                    // style={{
                    //   display: "grid",
                    //   gridTemplateColumns: `repeat(3, 1fr)`,
                    //   gap: "20px",
                    //   padding: "20px",
                    // }}
                    >
                      {desiredDate?.people?.map((userData: any) => {
                        return <li>{userData?.username}</li>;
                      })}
                    </ul>
                  </CardContent>
                </StyledCard>
              </div>
            );
          })}
        </div>
        <Typography
          style={{ fontSize: "16px", fontWeight: 500, padding: "0px 16px" }}
          color={"primary"}
        >
          {`Most Suitable date for the event of ${props.rowData?.name} is ${suitableDateInfo?.date} 
          because of the majority and the people who voted are ${namesString}.`}
        </Typography>
      </>
    );
  };
  return (
    <CustomDialog
      icon={MdHowToVote}
      title={"Add Vote Data"}
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
export default EventDetails;
