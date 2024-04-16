import {
  Alert,
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
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import React, { FC, useEffect, useState } from 'react';
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
import { FaUpload } from 'react-icons/fa';
import { MdPermMedia } from 'react-icons/md';
import CustomDropzone from './components/Dropzone/CustomDropzone';
import LongMenu from './components/menu/MenuList';

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

  const [mediaMetaData, setMediaMetaData]: any = useState(null);
  const [uploadedToServer, setMediaUploadToServer]: any = useState(undefined);
  const [thumbnailUrl, setThumbnailUrl] = useState<any>(null);
  const [invalidMedia, setInvalidMedia] = useState(false);
  const [mediaDelete, setMediaDelete] = useState(false);
  const [editMedia, setMediaEdit] = useState(false);

  const initState: State = {
    isOpenPopup: false,
    popupType: '',
    popupState: {},
  };
  const [state, setState] = useState<State>(initState);

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
      setMediaLoading(false);

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
    try {
      setMediaLoading(true);
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
                  }}
                  fontWeight={'600'}
                  // variant='h5'
                >
                  <IconButton color='primary'>
                    <MdPermMedia color='primary' />
                  </IconButton>
                  Media List
                </Typography>

                <div
                  style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}
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
                    {`Showing ${cachedMediaData?.length} of ${cachedMediaData?.length} records`}
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
                    {Array.isArray(cachedMediaData) &&
                      cachedMediaData?.map((storedMedia: any) => {
                        let size = storedMedia?.metadata?.size
                          ? (
                              storedMedia?.metadata?.size /
                              (1024 * 1024)
                            ).toFixed(2)
                          : 0;

                        let storedMdName = storedMedia?.metadata?.name || '';
                        let nameList = storedMdName?.split('.');
                        let onlyName = nameList?.[0] || '';
                        return (
                          <div className='card-item'>
                            {/* {storedMedia?.metadata?.name} */}
                            <Card style={{ height: '290px', width: '340px' }}>
                              <CardHeader
                                style={{ padding: '8px' }}
                                title={onlyName}
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
                                          popupType: 'edit',
                                        });
                                      }}
                                    />
                                  </div>
                                }
                              />
                              {storedMedia?.metadata?.contentType?.includes(
                                'video'
                              ) ? (
                                <ReactPlayer
                                  playing
                                  controls
                                  volume={0.5}
                                  width='312px'
                                  height={'125px'}
                                  playsinline
                                  pip
                                  loop
                                  url={storedMedia?.downloadUrl}
                                  light={thumbnailUrl}
                                />
                              ) : (
                                // eslint-disable-next-line jsx-a11y/img-redundant-alt
                                <div
                                  style={{
                                    padding: '8px',
                                    textAlign: 'center',
                                    height: '115px',
                                    width: '150px',
                                  }}
                                >
                                  {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                                  <img
                                    src={storedMedia?.downloadUrl}
                                    height='100%'
                                    width={'100%'}
                                    alt={`Image${onlyName}`}
                                    style={{
                                      padding: '8px',
                                      alignContent: 'center',
                                    }}
                                  />{' '}
                                </div>
                              )}

                              <Divider />

                              <CardContent
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  padding: '8px 12px',
                                }}
                              >
                                <Typography
                                  fontSize={'14px'}
                                  color='#434343'
                                  component='div'
                                  fontWeight={'500'}
                                >
                                  {storedMedia?.metadata?.customMetadata
                                    ?.description || 'No Description Available'}
                                </Typography>
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
                                  }}
                                  color='text.secondary'
                                >
                                  {`Uploaded At :  ${new Date(
                                    storedMedia?.metadata?.timeCreated
                                  ).toDateString()} `}
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
                                    sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
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
                              </CardContent>
                            </Card>
                          </div>
                        );
                      })}
                  </div>
                  {Array.isArray(cachedMediaData) &&
                    cachedMediaData?.length === 0 && (
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

        {state?.isOpenPopup && (
          <CustomDropzone
            mode={state?.popupType}
            handleClose={(success: boolean) => {
              if (success) {
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
