import {
  Alert,
  Avatar,
  Box,
  Button,
  CardHeader,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  Snackbar,
  Typography,
  useTheme,
} from '@mui/material';
import CardContent from '@mui/material/CardContent';
import React, { FC, useCallback, useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { useDispatch, useSelector } from 'react-redux';
// import VideoThumbnailGenerator from 'video-thumbnail-generator';
import 'firebase/storage';
import {
  deleteObject,
  getDownloadURL,
  getMetadata,
  listAll,
  ref,
} from 'firebase/storage';
import './firebaseConfig';
import { mediaDb } from './firebaseConfig';
import { setCachedMediaList } from './redux/root_actions';
// import LongMenu from '../../menu/MenuList';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import { deepPurple, teal } from '@mui/material/colors';
import { FaSearch, FaUpload } from 'react-icons/fa';
import { MdPermMedia } from 'react-icons/md';
import { MediaDefCols, MediaListPath } from './Media';
import CustomDropzone from './components/Dropzone/CustomDropzone';
import LongMenu from './components/menu/MenuList';
import { StyledCard, SubHeader } from './style';
import { convertToBrowserTimeZone } from './utils/customUtils';
import useDebounce from './utils/debounceHook';

interface Props {}

interface State {
  isOpenPopup: boolean;
  popupType: string;
  popupState: any;
}

const MediaList: FC<Props> = (props: Props) => {
  const theme: any = useTheme();
  const [invalidFileType, setInvalidMediaType] = useState(false);

  const cachedMediaData =
    useSelector((state: any) => state.Common.cachedMediaData) || [];

  const dispatch = useDispatch();

  const [bindMediaData, setBindMediaData]: any = useState([]);
  const [uploadedToServer, setMediaUploadToServer]: any = useState(undefined);
  const [thumbnailUrl, setThumbnailUrl] = useState<any>(null);
  const [invalidMedia, setInvalidMedia] = useState(false);
  const [mediaDelete, setMediaDelete] = useState(false);
  const [editMedia, setMediaEdit] = useState(false);
  const [search, setSearch]: any = useState('');
  const value = useDebounce(search, 300);

  const initState: State = {
    isOpenPopup: false,
    popupType: '',
    popupState: {},
  };
  const [state, setState] = useState<State>(initState);
  const [deleteSingleMedia, setDeleteSingleMedia] = useState<any>({});
  const [editSingleMedia, setEditedSingleMedia] = useState<any>({});

  const [mediaLoading, setMediaLoading] = useState(false);
  // setMediaLoading(true)

  let initImageUrl = '';

  //useState

  const [mediaUrl, setMediaUrl]: any = useState(initImageUrl);

  const [rating, setRating] = useState(1);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setMediaUploadToServer(false);
    setInvalidMedia(false);
    setMediaDelete(false);
    setMediaEdit(false);
    setInvalidMediaType(false);
  };

  const fetchAllMediaApi = async () => {
    try {
      const filesList = await listAll(ref(mediaDb, 'mediaFiles'));

      const detailsPromises = filesList?.items?.map(async (data) => {
        const downloadUrl = await getDownloadURL(data);
        const metadata = await getMetadata(data);
        return { downloadUrl, metadata };
      });

      const fileDetails = await Promise.all(detailsPromises);
      const sortedArr = fileDetails?.sort((a: any, b: any) => {
        if (b?.metaData?.timeCreated > a?.metaData?.timeCreated) {
          return 1;
        } else {
          return -1;
        }
      });
      dispatch(setCachedMediaList(sortedArr));
      setBindMediaData(sortedArr);
      setMediaLoading(false);
      setEditedSingleMedia({});
      setDeleteSingleMedia({});

      // setFileDetails(fileDetails);
    } catch (error) {
      console.error('Error fetching file list:', error);
    }

    // listAll(ref(mediaDb, 'mediaFiles'))?.then((mediaListData: any) => {
    //   console.log(mediaListData);
    //   mediaListData?.items?.forEach((val: any) => {
    //     // console.log('val======>', val);
    //     // getMetadata(val)?.then((val: any) => {
    //     //   let newMediaUrlList = cloneDeep(cachedMediaData);
    //     //   newMediaUrlList = [val, ...cachedMediaData];
    //     //   dispatch(setCachedMediaList(newMediaUrlList));
    //     //   // setImgUrl((data:any)=>[...data,url])
    //     // });
    //     getDownloadURL(val)?.then((url: any) => {
    //       let newMediaUrlList = cloneDeep(cachedMediaData);
    //       newMediaUrlList = [url, ...cachedMediaData];
    //       dispatch(setCachedMediaList(newMediaUrlList));
    //       // setImgUrl((data:any)=>[...data,url])
    //     });
    //   });
    // });
  };
  useEffect(() => {
    setMediaLoading(true);
    fetchAllMediaApi();
  }, []);

  const handleDelete = async (mediaInfo: any) => {
    setDeleteSingleMedia({
      ...mediaInfo,
      shouldDelete: true,
    });
    try {
      // setMediaLoading(true);
      const filesList = await listAll(ref(mediaDb, 'mediaFiles'));

      const detailsPromises = filesList?.items?.map(async (fileRef: any) => {
        const downloadUrl = await getDownloadURL(fileRef);
        if (downloadUrl === mediaInfo?.downloadUrl) {
          await deleteObject(fileRef);
          // setMediaDelete(true);
          fetchAllMediaApi();
        }
      });

      const fileDetails = await Promise.all(detailsPromises);
      // dispatch(setCachedMediaList(fileDetails));

      // console.log('File deleted successfully');
    } catch (error) {
      console.error('Error deleting file:', error);
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
    const defCols: any = MediaDefCols;
    const listPath: any = MediaListPath;
    const filteredList = cachedMediaData?.filter((row: any) => {
      for (let columnInfo of defCols) {
        let derivedPath: string = listPath?.[columnInfo]?.id || '';
        if (derivedPath.indexOf('$.') !== -1) {
          derivedPath = derivedPath.slice(2);
        }

        let celldata: any;
        if (derivedPath?.indexOf('.') > -1) {
          celldata = derivedPath
            ?.split('.')
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

  return (
    <>
      <Container fixed style={{ padding: '0' }}>
        <Grid
          container
          style={{ padding: '0px' }}
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        >
          <Grid style={{ padding: '0px' }} item xs={12} sm={12}>
            <div style={{ minHeight: '400px' }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                }}
              >
                <Typography
                  style={{
                    height: '25px',
                    marginBottom: '8px',
                    fontSize: '20px',
                    lineHeight: '2',
                  }}
                  fontWeight={'600'}
                  // variant='h5'
                >
                  <IconButton color='primary'>
                    <MdPermMedia color='primary' />
                  </IconButton>
                  Media List
                </Typography>

                <Paper
                  component='form'
                  sx={{
                    p: '2px 4px',
                    display: 'flex',
                    alignItems: 'center',
                    width: 400,
                    height: '35px',
                    border: `solid 1px ${theme?.palette?.primary?.main}`,
                  }}
                >
                  <InputBase
                    sx={{
                      ml: 1,
                      flex: 1,
                      // borderRadius: `solid 0.5px ${theme?.palette?.primary?.main}`,
                    }}
                    name='search'
                    value={search}
                    onChange={(e: any) => {
                      optimizedFn(e.target.value);
                      // handleFilter(props?.keyvalue, e?.target?.value || '');
                      setSearch(e.target.value);
                    }}
                    placeholder='Search Media'
                    inputProps={{ 'aria-label': 'search Images maps' }}
                  />
                  <IconButton
                    type='button'
                    sx={{ p: '10px' }}
                    aria-label='search'
                  >
                    <FaSearch />
                  </IconButton>
                  {/* <Divider sx={{ height: 28, m: 0.5 }} orientation='vertical' /> */}
                </Paper>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '8px',
                    marginTop: '8px',
                  }}
                >
                  <Button
                    variant='contained'
                    startIcon={<FaUpload></FaUpload>}
                    onClick={() => {
                      setState({
                        ...state,
                        isOpenPopup: true,
                        popupType: 'upload',
                      });
                    }}
                    // disabled={mediaMetaData === null || invalidFileType}
                    style={{
                      height: '32px',
                      marginRight: '8px',
                    }}
                  >
                    Upload
                  </Button>
                  <Typography
                    style={{
                      fontSize: '12px',
                      fontWeight: '500',
                      display: 'flex',
                      justifyContent: 'center',
                      color: '#ff3f6c',
                      lineHeight: 2.5,
                    }}
                  >
                    {`Showing ${bindMediaData?.length} of ${cachedMediaData?.length} records`}
                  </Typography>
                </div>
              </div>

              <Divider />
              {mediaLoading ? (
                <div style={{ padding: '16px' }}>
                  <CircularProgress />
                </div>
              ) : (
                <>
                  <div className='card-container'>
                    {Array.isArray(bindMediaData) &&
                      bindMediaData?.map((storedMedia: any) => {
                        let size = storedMedia?.metadata?.size
                          ? (
                              storedMedia?.metadata?.size /
                              (1024 * 1024)
                            ).toFixed(2)
                          : 0;

                        let storedMdName = storedMedia?.metadata?.name || '';
                        let nameList = storedMdName?.split('.');
                        let onlyName = nameList?.[0] || '';
                        let modifiedUname =
                          storedMedia?.metadata?.customMetadata?.modifiedBy?.toUpperCase();
                        let createdBy =
                          storedMedia?.metadata?.customMetadata?.createdBy?.toUpperCase();
                        let blurMedia = false;
                        // blur during edit and delete function
                        if (
                          storedMdName === deleteSingleMedia?.metadata?.name &&
                          deleteSingleMedia?.shouldDelete
                        ) {
                          blurMedia = true;
                        }

                        if (
                          storedMdName === deleteSingleMedia?.metadata?.name &&
                          editSingleMedia?.shouldEdit
                        ) {
                          blurMedia = true;
                        }

                        return (
                          <div className='card-item'>
                            {/* {storedMedia?.metadata?.name} */}
                            {blurMedia && (
                              <div
                                style={{
                                  // width: '200px',
                                  position: 'relative',
                                  top: '100px',
                                  left: '160px',
                                  zIndex: 10,
                                  height: '10px',
                                }}
                              >
                                {' '}
                                <CircularProgress
                                  color='primary'
                                  style={{ zIndex: 5 }}
                                />
                              </div>
                            )}
                            <StyledCard
                              style={{
                                height: 'auto',
                                width: '380px',
                                opacity: blurMedia ? 0.3 : 1,
                              }}
                            >
                              <CardHeader
                                style={{
                                  padding: '8px 16px',
                                  color: theme?.palette?.primary?.main,
                                }}
                                title={onlyName}
                                sx={{
                                  '& .MuiCardHeader-title': {
                                    display: 'block',
                                    maxWidth: '231px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    fontSize: '16px',
                                  },
                                }}
                                color='primary'
                                action={
                                  <div
                                    style={{
                                      display: 'flex',
                                      flexDirection: 'row',
                                      gap: '4px',
                                    }}
                                  >
                                    <div>
                                      {[1, 2, 3, 4, 5]?.map((value) => (
                                        <span
                                          key={value}
                                          className={
                                            value <=
                                            storedMedia?.metadata
                                              ?.customMetadata?.rating
                                              ? 'star-filled'
                                              : 'star'
                                          }
                                          style={{ fontSize: '20px' }}
                                        >
                                          &#9733;
                                        </span>
                                      ))}
                                    </div>

                                    <LongMenu
                                      // mediaInfo = {storedMedia}
                                      deleteCallbackHandler={() => {
                                        handleDelete(storedMedia);
                                      }}
                                      editCallbackHandler={() => {
                                        setState({
                                          ...state,
                                          isOpenPopup: true,
                                          popupState: storedMedia,
                                          popupType: 'edit',
                                        });
                                      }}
                                    />
                                  </div>
                                }
                              />
                              <div
                                onClick={(e: any) => {
                                  // e?.stopPropagation
                                  setState({
                                    ...state,
                                    isOpenPopup: true,
                                    popupState: storedMedia,
                                    popupType: 'edit',
                                  });
                                }}
                              >
                                {' '}
                                <SubHeader>
                                  {storedMedia?.metadata?.customMetadata
                                    ?.description ||
                                    'No Description Available'}{' '}
                                </SubHeader>
                                {storedMedia?.metadata?.contentType?.includes(
                                  'video'
                                ) ? (
                                  <ReactPlayer
                                    playing
                                    controls
                                    volume={0}
                                    width='312px'
                                    height={'135px'}
                                    playsinline
                                    pip
                                    loop
                                    muted={true}
                                    url={storedMedia?.downloadUrl}
                                    light={thumbnailUrl}
                                  />
                                ) : (
                                  // eslint-disable-next-line jsx-a11y/img-redundant-alt
                                  <div
                                    style={{
                                      padding: '8px',
                                      paddingTop: '0px',
                                      textAlign: 'center',
                                      height: '125px',
                                      width: '150px',
                                    }}
                                  >
                                    {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                                    <img
                                      src={storedMedia?.downloadUrl}
                                      height='125px'
                                      width={'100%'}
                                      alt={`Image${onlyName}`}
                                      onClick={() => {
                                        setState({
                                          ...state,
                                          isOpenPopup: true,
                                          popupState: storedMedia,
                                          popupType: 'edit',
                                        });
                                      }}
                                      style={{
                                        padding: '8px',
                                        alignContent: 'center',
                                        cursor: 'pointer',
                                      }}
                                    />{' '}
                                  </div>
                                  // <CardMedia
                                  //   sx={{ height: 150, width: '80px' }}
                                  //   image={storedMedia?.downloadUrl}
                                  //   title={`Image ${onlyName}`}
                                  // />
                                )}
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
                                    display: 'flex',
                                    flexDirection: 'column',
                                    padding: '8px 12px',
                                  }}
                                >
                                  <Typography
                                    style={{
                                      textAlign: 'left',
                                      fontSize: '12px',
                                    }}
                                    color='text.secondary'
                                  >{`Size:  ${size} MB`}</Typography>

                                  <Typography
                                    style={{
                                      textAlign: 'left',
                                      fontSize: '12px',
                                    }}
                                    color='text.secondary'
                                  >
                                    {`Type:  ${
                                      storedMedia?.metadata?.contentType || ''
                                    } `}
                                  </Typography>

                                  <Typography
                                    style={{
                                      textAlign: 'left',
                                      fontSize: '12px',
                                      display: 'flex',
                                      flexDirection: 'row',
                                      gap: '6px',
                                    }}
                                    color='text.secondary'
                                  >
                                    <Typography>{'Origin: '}</Typography>
                                    <Box
                                      // component='li'
                                      sx={{
                                        '& > img': { mr: 2, flexShrink: 0 },
                                      }}
                                      {...props}
                                    >
                                      <img
                                        loading='lazy'
                                        width='20'
                                        style={{
                                          marginRight: '4px',
                                          marginTop: '4px',
                                        }}
                                        srcSet={`https://flagcdn.com/w20/${storedMedia?.metadata?.customMetadata?.locationCode?.toLowerCase()}.png 2x`}
                                        src={`https://flagcdn.com/w20/${storedMedia?.metadata?.customMetadata?.locationCode?.toLowerCase()}.png`}
                                        alt=''
                                      />
                                      {/* <Typography style={{ marginTop: '-4px' }}> */}
                                      {
                                        storedMedia?.metadata?.customMetadata
                                          ?.locationName
                                      }
                                      {/* </Typography> */}
                                    </Box>
                                  </Typography>
                                  <Typography
                                    style={{
                                      textAlign: 'left',
                                      fontSize: '12px',
                                    }}
                                    color='text.secondary'
                                  >
                                    {`Modified At :  ${convertToBrowserTimeZone(
                                      storedMedia?.metadata?.timeCreated
                                    )} `}
                                  </Typography>

                                  <div
                                    style={{
                                      display: 'flex',
                                      flexDirection: 'row',
                                      gap: '4px',
                                    }}
                                  >
                                    <Typography
                                      style={{
                                        textAlign: 'left',
                                        fontSize: '12px',
                                      }}
                                      fontWeight={'400'}
                                      color='text.primary'
                                    >
                                      {`Created By : `}
                                    </Typography>
                                    <Avatar
                                      alt={createdBy}
                                      sx={{
                                        bgcolor: createdBy
                                          ?.toLowerCase()
                                          ?.includes('sandeep'.toLowerCase())
                                          ? deepPurple[500]
                                          : teal[500],
                                        width: 22,
                                        height: 22,
                                        fontSize: '12px',
                                      }}
                                      src='/static/images/avatar/2.jpg'
                                    />
                                    <Typography
                                      style={{
                                        textAlign: 'left',
                                        fontSize: '12px',
                                      }}
                                      fontWeight={'400'}
                                      color='text.primary'
                                    >
                                      {` ${(
                                        storedMedia?.metadata?.customMetadata
                                          ?.createdBy || modifiedUname
                                      )?.toLowerCase()} `}
                                    </Typography>
                                  </div>

                                  {modifiedUname && (
                                    <div
                                      style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        gap: '4px',
                                      }}
                                    >
                                      <Typography
                                        style={{
                                          textAlign: 'left',
                                          fontSize: '12px',
                                        }}
                                        fontWeight={'400'}
                                        color='text.primary'
                                      >
                                        {` Last Modified By : `}
                                      </Typography>
                                      <Avatar
                                        alt={modifiedUname}
                                        sx={{
                                          bgcolor: modifiedUname
                                            ?.toLowerCase()
                                            ?.includes('sandeep'.toLowerCase())
                                            ? deepPurple[500]
                                            : teal[500],
                                          width: 22,
                                          height: 22,
                                          fontSize: '12px',
                                        }}
                                        src='/static/images/avatar/2.jpg'
                                      />
                                      <Typography
                                        style={{
                                          textAlign: 'left',
                                          fontSize: '12px',
                                        }}
                                        fontWeight={'400'}
                                        color='text.primary'
                                      >
                                        {` ${storedMedia?.metadata?.customMetadata?.modifiedBy} `}
                                      </Typography>
                                    </div>
                                  )}
                                </CardContent>{' '}
                              </div>

                              {/* </Scrollbars> */}
                            </StyledCard>
                          </div>
                        );
                      })}
                  </div>
                  {Array.isArray(bindMediaData) &&
                    bindMediaData?.length === 0 && (
                      <div
                        style={{
                          textAlign: 'center',
                        }}
                      >
                        <img
                          src={require('./assets/noRecords.png')}
                          height='200px'
                          width={'350px'}
                          alt={`noRecords`}
                          style={{
                            aspectRatio: 3 / 2,
                            objectFit: 'contain',
                            mixBlendMode: 'color-burn',
                          }}
                        />
                        <Typography variant='h6'>No Records Found</Typography>
                      </div>

                      // </div>
                    )}
                </>
              )}
            </div>
          </Grid>
        </Grid>
        {mediaDelete && (
          <Snackbar
            open={mediaDelete}
            autoHideDuration={6000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          >
            <Alert
              onClose={handleClose}
              variant='filled'
              sx={{ width: '100%' }}
              severity='success'
            >
              {'Media file deleted successfully'}
            </Alert>
          </Snackbar>
        )}
        {uploadedToServer && (
          <Snackbar
            open={uploadedToServer}
            autoHideDuration={6000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          >
            <Alert
              onClose={handleClose}
              severity='success'
              variant='filled'
              sx={{ width: '100%' }}
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
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          >
            <Alert
              onClose={handleClose}
              severity='success'
              variant='filled'
              sx={{ width: '100%' }}
            >
              {`Media File succesfully modified !!`}
            </Alert>
          </Snackbar>
        )}

        {state?.isOpenPopup && (
          <CustomDropzone
            mode={state?.popupType}
            rowData={state?.popupState}
            handlePopupClose={(
              success: boolean,
              mode: string,
              rowData: any
            ) => {
              if (mode === 'edit') {
                let newData = {
                  ...rowData,
                  shouldEdit: true,
                };
                setEditedSingleMedia(newData);
                fetchAllMediaApi();
                setMediaEdit(true);
              } else if (success) {
                fetchAllMediaApi();
                setMediaUploadToServer(true);
              }
              setState({
                ...state,
                isOpenPopup: false,
                popupType: '',
              });
            }}
          />
        )}
      </Container>
    </>
  );
};

export default MediaList;
