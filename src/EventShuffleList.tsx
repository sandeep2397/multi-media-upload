import {
  Alert,
  Button,
  CardHeader,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  Snackbar,
  SnackbarCloseReason,
  Typography,
  useTheme,
} from "@mui/material";
import CardContent from "@mui/material/CardContent";
import React, { FC, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import VideoThumbnailGenerator from 'video-thumbnail-generator';
import "firebase/storage";
import { deleteObject, getDownloadURL, listAll, ref } from "firebase/storage";
import "./firebaseConfig";
import { mediaDb } from "./firebaseConfig";
import { commonAction, setCachedEventShuffleList } from "./redux/root_actions";
// import LongMenu from '../../menu/MenuList';
import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import Scrollbars from "react-custom-scrollbars";
import { FaSearch, FaUpload } from "react-icons/fa";
import { MdClose, MdHowToVote, MdPermMedia } from "react-icons/md";
import CreateEvent from "./CreateEvent";
import EventDetails from "./EventDetails";
import { EventShuffleDefCols, EventShuffleListPath } from "./EventShuffle";
import { StyledCard } from "./style";
import useDebounce from "./utils/debounceHook";

interface Props {}

interface State {
  isOpenPopup: boolean;
  popupType: string;
  popupState: any;
}

const EventShuffleList: FC<Props> = (props: Props) => {
  const theme: any = useTheme();
  const [invalidFileType, setInvalidMediaType] = useState(false);

  const cachedEventsData =
    useSelector((state: any) => state.Common.cachedEventsData) || [];

  const dispatch = useDispatch();

  const [bindEventData, setBindMediaData]: any = useState([]);
  const [uploadedToServer, setMediaUploadToServer]: any = useState(undefined);
  const [thumbnailUrl, setThumbnailUrl] = useState<any>(null);
  const [invalidMedia, setInvalidMedia] = useState(false);
  const [mediaDelete, setMediaDelete] = useState(false);
  const [editMedia, setMediaEdit] = useState(false);
  const [search, setSearch]: any = useState("");
  const value = useDebounce(search, 300);

  const initState: State = {
    isOpenPopup: false,
    popupType: "",
    popupState: {},
  };
  const [state, setState] = useState<State>(initState);
  const [deleteSingleMedia, setDeleteSingleMedia] = useState<any>({});
  const [editSingleMedia, setEditedSingleMedia] = useState<any>({});

  const [mediaLoading, setMediaLoading] = useState(false);
  // setMediaLoading(true)

  let initImageUrl = "";

  //useState

  const [open, setOpen] = React.useState(false);
  const handleSnackClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setMediaUploadToServer(false);
    setInvalidMedia(false);
    setMediaDelete(false);
    setMediaEdit(false);
    setInvalidMediaType(false);
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleSnackClose}
      >
        <MdClose fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  const fetchAllEvents = async () => {
    dispatch(
      commonAction({
        data: {
          url: `/api/v1/event/list?page=1`,
        },
        callback: (resp: any) => {
          setMediaLoading(false);
          dispatch(setCachedEventShuffleList(resp?.events || []));
          setBindMediaData(resp?.events || []);
        },
      })
    );
  };
  useEffect(() => {
    setMediaLoading(true);
    fetchAllEvents();
  }, []);

  const handleDelete = async (mediaInfo: any) => {
    setDeleteSingleMedia({
      ...mediaInfo,
      shouldDelete: true,
    });
    try {
      // setMediaLoading(true);
      const filesList = await listAll(ref(mediaDb, "mediaFiles"));

      const detailsPromises = filesList?.items?.map(async (fileRef: any) => {
        const downloadUrl = await getDownloadURL(fileRef);
        if (downloadUrl === mediaInfo?.downloadUrl) {
          await deleteObject(fileRef);
          // setMediaDelete(true);
          fetchAllEvents();
        }
      });

      const fileDetails = await Promise.all(detailsPromises);
      // dispatch(setCachedEventShuffleList(fileDetails));

      // console.log('File deleted successfully');
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const debounce = (func: any) => {
    let timer: any;
    return function (this: any, ...args: any) {
      const context = this;
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        timer = null;
        func.apply(context, args);
      }, 300);
    };
  };

  const handleFilter = (value: string) => {
    // props?.handleFilterChange(column, value, searchQuery);
    // dispatch(saveCurrentKeyValue(props?.keyvalue));
    const defCols: any = EventShuffleDefCols;
    const listPath: any = EventShuffleListPath;
    const filteredList = cachedEventsData?.filter((row: any) => {
      for (let columnInfo of defCols) {
        let derivedPath: string = listPath?.[columnInfo]?.id || "";
        if (derivedPath.indexOf("$.") !== -1) {
          derivedPath = derivedPath.slice(2);
        }

        let celldata: any;
        if (derivedPath?.indexOf(".") > -1) {
          celldata = derivedPath
            ?.split(".")
            .reduce((o: any, i: any) => o?.[i], row);
        } else {
          celldata = row?.[derivedPath];
        }
        if (
          columnInfo &&
          derivedPath &&
          celldata?.toString()?.toLowerCase()?.search(value?.toLowerCase()) !==
            -1 &&
          celldata?.toString()?.toLowerCase()?.search(value?.toLowerCase()) !==
            undefined
        ) {
          return row;
        }
      }
    });
    setBindMediaData(filteredList);
  };
  const optimizedFn = useCallback(debounce(handleFilter), []);

  function base64ToBlobUrl(base64: string) {
    // Split the base64 string into data and content type
    const [contentType, base64Data] = base64.split(";base64,");

    // Decode base64 string to binary
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    // Convert byte numbers to Uint8Array
    const byteArray = new Uint8Array(byteNumbers);

    // Create a Blob object
    const blob = new Blob([byteArray], { type: contentType.split(":")[1] });

    // Generate a Blob URL
    return URL.createObjectURL(blob);
  }

  return (
    <>
      <Container fixed style={{ padding: "0" }}>
        <Grid
          container
          style={{ padding: "0px" }}
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        >
          <Grid style={{ padding: "0px" }} item xs={12} sm={12}>
            <div style={{ minHeight: "400px" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <Typography
                  style={{
                    height: "25px",
                    marginBottom: "8px",
                    fontSize: "20px",
                    lineHeight: "2",
                  }}
                  fontWeight={"600"}
                  // variant='h5'
                >
                  <IconButton color="primary">
                    <MdPermMedia color="primary" />
                  </IconButton>
                  Events
                </Typography>

                <Paper
                  component="form"
                  sx={{
                    p: "2px 4px",
                    display: "flex",
                    alignItems: "center",
                    width: 400,
                    height: "35px",
                    border: `solid 1px ${theme?.palette?.primary?.main}`,
                  }}
                >
                  <InputBase
                    sx={{
                      ml: 1,
                      flex: 1,
                      // borderRadius: `solid 0.5px ${theme?.palette?.primary?.main}`,
                    }}
                    name="search"
                    value={search}
                    onChange={(e: any) => {
                      optimizedFn(e.target.value);
                      // handleFilter(props?.keyvalue, e?.target?.value || '');
                      setSearch(e.target.value);
                    }}
                    placeholder="Search Events"
                    inputProps={{ "aria-label": "search Images maps" }}
                  />
                  <IconButton
                    type="button"
                    sx={{ p: "10px" }}
                    aria-label="search"
                  >
                    <FaSearch />
                  </IconButton>
                  {/* <Divider sx={{ height: 28, m: 0.5 }} orientation='vertical' /> */}
                </Paper>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "8px",
                    marginTop: "8px",
                  }}
                >
                  <Button
                    variant="contained"
                    startIcon={<FaUpload></FaUpload>}
                    onClick={() => {
                      setState({
                        ...state,
                        isOpenPopup: true,
                        popupType: "add",
                      });
                    }}
                    // disabled={mediaMetaData === null || invalidFileType}
                    style={{
                      height: "32px",
                      marginRight: "8px",
                    }}
                  >
                    CREATE EVENT
                  </Button>
                  <Typography
                    style={{
                      fontSize: "12px",
                      fontWeight: "500",
                      display: "flex",
                      justifyContent: "center",
                      color: "#ff3f6c",
                      lineHeight: 2.5,
                    }}
                  >
                    {`Showing ${bindEventData?.length} of ${cachedEventsData?.length} records`}
                  </Typography>
                </div>
              </div>

              <Divider />
              {mediaLoading ? (
                <div style={{ padding: "16px" }}>
                  <CircularProgress />
                </div>
              ) : (
                <Scrollbars
                  className="custom-scrollbar"
                  autoHide={false}
                  hideTracksWhenNotNeeded={false}
                  autoHeight={false}
                  style={{
                    height: window.innerHeight - 140 + "px",
                    // width: isLargeScreen ? '2000px' : width + 'px',
                    // width: '97vw',
                  }}
                  // autoHeightMax={'calc(100vh - 140px)'}
                >
                  <div className="card-container">
                    {Array.isArray(bindEventData) &&
                      bindEventData?.map((storedEvent: any) => {
                        const dates = storedEvent?.dates || [];
                        const base64ImagePattern =
                          /^data:image\/(png|jpg|jpeg|gif|bmp|webp);base64,[A-Za-z0-9+/=]+$/;
                        const base64Encoded = base64ImagePattern.test(
                          storedEvent?.imageUrl
                        );
                        let blobUrl =
                          "data:image/jpeg;base64,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";
                        if (base64Encoded) {
                          blobUrl = base64ToBlobUrl(storedEvent?.imageUrl);
                        } else {
                          blobUrl = storedEvent?.imageUrl;
                        }

                        return (
                          <div className="card-item">
                            <StyledCard
                              style={{
                                height: "auto",
                                width: "380px",
                              }}
                            >
                              <CardHeader
                                style={{
                                  padding: "8px 16px",
                                  color: theme?.palette?.primary?.main,
                                }}
                                title={storedEvent?.name}
                                sx={{
                                  "& .MuiCardHeader-title": {
                                    display: "block",
                                    maxWidth: "231px",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    fontSize: "16px",
                                  },
                                }}
                                color="primary"
                                action={
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                      gap: "4px",
                                    }}
                                  >
                                    <Button
                                      variant="outlined"
                                      startIcon={<MdHowToVote />}
                                      onClick={() => {
                                        setState({
                                          ...state,
                                          isOpenPopup: true,
                                          popupState: storedEvent,
                                          popupType: "details",
                                        });
                                      }}
                                    >
                                      Vote
                                    </Button>
                                    {/* <LongMenu
                                      // mediaInfo = {storedEvent}
                                      deleteCallbackHandler={() => {
                                        handleDelete(storedEvent);
                                      }}
                                      editCallbackHandler={() => {
                                        setState({
                                          ...state,
                                          isOpenPopup: true,
                                          popupState: storedEvent,
                                          popupType: "edit",
                                        });
                                      }}
                                    /> */}
                                  </div>
                                }
                              />
                              <div
                                onClick={(e: any) => {
                                  // e?.stopPropagation
                                  setState({
                                    ...state,
                                    isOpenPopup: true,
                                    popupState: storedEvent,
                                    popupType: "edit",
                                  });
                                }}
                              >
                                <div
                                  style={{
                                    padding: "8px",
                                    paddingTop: "0px",
                                    textAlign: "center",
                                    height: "145px",
                                    width: "290px",
                                    // width: 'auto',
                                  }}
                                >
                                  {" "}
                                  <img
                                    src={blobUrl}
                                    height={"100%"}
                                    width={"100%"}
                                    alt={`Image${storedEvent?.name}`}
                                    // onClick={() => {
                                    //   setState({
                                    //     ...state,
                                    //     isOpenPopup: true,
                                    //     popupState: storedEvent,
                                    //     popupType: "edit",
                                    //   });
                                    // }}
                                    style={{
                                      padding: "8px",
                                      alignContent: "center",
                                      cursor: "pointer",

                                      display: "block",
                                      margin: "auto",
                                    }}
                                  />
                                </div>
                                <Divider />
                                {/* <Scrollbars
                              autoHide={true}
                              hideTracksWhenNotNeeded={true}
                              autoHeight={true}
                              autoHeightMax={'200px'}
                              autoHeightMin={'200px'}
                            > */}
                                <CardContent
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    padding: "8px 12px",
                                  }}
                                >
                                  <Typography>Available Dates:</Typography>
                                  <ul>
                                    {dates?.map((date: string) => {
                                      return <li>{date}</li>;
                                    })}
                                  </ul>
                                </CardContent>
                              </div>

                              {/* </Scrollbars> */}
                            </StyledCard>
                          </div>
                        );
                      })}
                  </div>

                  {Array.isArray(bindEventData) &&
                    bindEventData?.length === 0 && (
                      <div
                        style={{
                          textAlign: "center",
                        }}
                      >
                        <img
                          src={require("./assets/noRecords.png")}
                          height="200px"
                          width={"350px"}
                          alt={`noRecords`}
                          style={{
                            aspectRatio: 3 / 2,
                            objectFit: "contain",
                            mixBlendMode: "color-burn",
                          }}
                        />
                        <Typography variant="h6">No Records Found</Typography>
                      </div>

                      // </div>
                    )}
                </Scrollbars>
              )}
            </div>
          </Grid>
        </Grid>
        {mediaDelete && (
          <Snackbar
            open={mediaDelete}
            autoHideDuration={6000}
            onClose={handleClose}
            anchorOrigin={{ vertical: "top", horizontal: "left" }}
          >
            <Alert
              onClose={handleClose}
              variant="filled"
              sx={{ width: "100%" }}
              severity="success"
            >
              {"Media file deleted successfully"}
            </Alert>
          </Snackbar>
        )}
        {uploadedToServer && (
          <Snackbar
            open={uploadedToServer}
            autoHideDuration={6000}
            onClose={handleClose}
            anchorOrigin={{ vertical: "top", horizontal: "left" }}
          >
            <Alert
              onClose={handleClose}
              severity="success"
              variant="filled"
              sx={{ width: "100%" }}
            >
              {`Media File succesfully uploaded to the Server`}
            </Alert>
          </Snackbar>
        )}

        {editMedia && (
          <Snackbar
            open={editMedia}
            autoHideDuration={6000}
            onClose={handleClose}
            anchorOrigin={{ vertical: "top", horizontal: "left" }}
          >
            <Alert
              onClose={handleClose}
              severity="success"
              variant="filled"
              sx={{ width: "100%" }}
            >
              {`Media File succesfully modified !!`}
            </Alert>
          </Snackbar>
        )}

        {state?.isOpenPopup && state?.popupType === "details" && (
          <EventDetails
            rowData={state?.popupState}
            handlePopupClose={(success: boolean) => {
              if (success) {
                setOpen(true);
              }
              setState({
                ...state,
                isOpenPopup: false,
                popupType: "",
              });
            }}
          />
        )}

        {state?.isOpenPopup && state?.popupType === "add" && (
          <CreateEvent
            handlePopupClose={(success: boolean) => {
              setState({
                ...state,
                isOpenPopup: false,
                popupType: "",
              });
            }}
          />
        )}
        <Snackbar
          open={open}
          autoHideDuration={4000}
          onClose={handleSnackClose}
          anchorOrigin={{ vertical: "top", horizontal: "left" }}
          message="Votes Added Successfully"
          action={action}
        />
      </Container>
    </>
  );
};

export default EventShuffleList;
