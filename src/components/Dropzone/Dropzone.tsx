import {
  Alert,
  Button,
  CardHeader,
  CircularProgress,
  Container,
  Divider,
  Grid,
  OutlinedInput,
  Snackbar,
  Typography,
  useTheme,
} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaUpload } from 'react-icons/fa';
import { MdAttachFile } from 'react-icons/md';
import ReactPlayer from 'react-player';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { v4 } from 'uuid';
// import VideoThumbnailGenerator from 'video-thumbnail-generator';
import 'firebase/storage';
import {
  deleteObject,
  getDownloadURL,
  getMetadata,
  listAll,
  ref,
  uploadBytes,
} from 'firebase/storage';
import '../../firebaseConfig';
import { mediaDb } from '../../firebaseConfig';
import { setCachedMediaList } from '../../redux/root_actions';
import LongMenu from '../menu/MenuList';

interface Props {
  handleClose: any;
  isTest?: boolean;
  mode?: string;
  row?: any;
}

interface State {
  Description?: string;
  ImageId?: string;
  Label?: string;
  Location?: string;
  imageDimension?: any;
}

function CustomDropzone(props: Props) {
  const theme: any = useTheme();
  const [invalidTemplate, checkInvalidTemplate] = useState(false);
  const [invalidFileType, checkInvalidFileType] = useState(false);
  const [noRecords, checkForRecords]: any = useState(null);
  const [loading, setLoading]: any = useState(false);
  const cachedMediaData =
    useSelector((state: any) => state.Common.cachedMediaData) || [];

  const dispatch = useDispatch();

  const [mediaMetaData, setMediaMetaData]: any = useState(null);
  const [uploadedToServer, setMediaUploadToServer]: any = useState(undefined);
  const [thumbnailUrl, setThumbnailUrl] = useState<any>(null);
  const [invalidMedia, setInvalidMedia] = useState(false);
  const [mediaDelete, setMediaDelete] = useState(false);
  const [editMedia, setMediaEdit] = useState(false);
  const [mediaLoading, setMediaLoading] = useState(false);
  // setMediaLoading(true)

  const [progress, setProgress] = useState(0);
  // let sizeData = [
  //   { label: 'Small', value: 'S' },
  //   { label: 'Medium', value: 'M' },
  //   { label: 'Large', value: 'L' },
  // ];
  let initState = {
    Description: '',
    ImageId: '',
    Label: '',
    imageDimension: null,
    Location: '',
  };

  let initImageUrl = '';

  //useState

  const [state, setState] = useState<State>(initState);
  const [mediaUrl, setMediaUrl]: any = useState(initImageUrl);

  const onDrop = useCallback((acceptedFiles: any) => {
    setInvalidMedia(false);

    checkInvalidFileType(false);
    const formData: any = new FormData();
    const fileUploaded = acceptedFiles?.[0] || {};
    const fileName = fileUploaded?.name;
    formData.append('form-data', fileUploaded, fileName);
  }, []);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({ onDrop });

  const [uploadedFiles, setFiles] = useState([]);

  const [fileDetails, setFileDetails] = useState<Array<any>>([]);
  const [open, setOpen] = React.useState(false);

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
  };

  useEffect(() => {
    if (acceptedFiles && acceptedFiles?.length > 0) {
      let uploadedFiles: any = acceptedFiles || [];
      setFiles(uploadedFiles);

      let mediaInfo = uploadedFiles?.[0] || null;
      setMediaMetaData(mediaInfo);

      let mediaName = mediaInfo?.name || '';
      let extension = mediaName?.split('.').pop();

      let supportedTypes: any = [
        'png',
        'jpg',
        'svg',
        'jpeg',
        'mp4',
        'avi',
        'mkv',
        'webm',
      ];
      let filePermisible: boolean = supportedTypes?.includes(extension);
      if (filePermisible) {
        const createMediaBlobUrl = URL.createObjectURL(mediaInfo);
        setMediaUrl(createMediaBlobUrl);
        setInvalidMedia(false);
        setState({
          ...state,
          ImageId: mediaName,
          Label: mediaName,
          imageDimension: mediaName?.size,
        });

        if (mediaInfo?.type?.includes('video')) {
          const video = document.createElement('video');
          video.preload = 'metadata';

          video.onloadedmetadata = () => {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              const thumbnailDataUrl = canvas.toDataURL('image/jpeg');
              setThumbnailUrl(thumbnailDataUrl);
            }
          };
        }
        // image.onload = function () {
        //   var height = image?.height || 0;
        //   var width = image?.width || 0;
        //   let imageDimension = height * width;
        //   let createImageUrl = URL.createObjectURL(mediaInfo);
        //   setMediaUrl(createImageUrl);
        //   setInvalidMedia(false);
        //   setState({
        //     ...state,
        //     ImageId: mediaName,
        //     Label: mediaName,
        //     imageDimension,
        //   });
        // };
      } else {
        setInvalidMedia(true);
        setMediaUrl('');
        toast.error('Invalid File type attached', {
          className: 'toast-error',
        });
      }
    }
  }, [acceptedFiles]);

  // useEffect(() => {
  //   dispatch(setCachedMediaList([]));
  // }, []);

  // useEffect(() => {
  //   const handleBeforeUnload = (event: any) => {
  //     dispatch(setCachedMediaList([]));
  //   };
  //   window.addEventListener('beforeunload', handleBeforeUnload);
  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //   };
  // }, []); // Empty dependency array ensures the effect runs only once

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

  const onUploadClick = () => {
    let mediaRef = null;
    setLoading(true);
    setMediaLoading(true);

    // if (mediaMetaData?.type.includes('image')) {
    //   mediaRef = ref(mediaDb, `images/${mediaMetaData?.name + '_' + v4()}`);
    // } else {
    //   mediaRef = ref(mediaDb, `videos/${mediaMetaData?.name + '_' + v4()}`);
    // }

    mediaRef = ref(mediaDb, `mediaFiles/${mediaMetaData?.name + '_' + v4()}`);

    uploadBytes(mediaRef, mediaMetaData)
      .then(() => {
        setLoading(false);
        fetchAllMediaApi();
      })
      .catch((err) => {
        setLoading(false);
        setMediaUploadToServer(false);
      });
  };

  let size = mediaMetaData?.size
    ? (mediaMetaData?.size / (1024 * 1024)).toFixed(2)
    : 0;

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const blobUrl = URL.createObjectURL(file);
      setMediaUrl(blobUrl);
    }
  };

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
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12} sm={5}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '8px',
              }}
            >
              <div {...getRootProps({ className: 'dropzone' })}>
                <input className='input-zone' {...getInputProps()} />

                <OutlinedInput
                  id={'outlined'}
                  type={'text'}
                  value={''}
                  color='primary'
                  style={{
                    height: '65px',
                    fontSize: '12px',
                    width: '370px',
                    border: `solid 1px ${theme?.palette.primary.main}`,
                  }}
                  name='password'
                  onChange={handleFileChange}
                  placeholder={
                    isDragActive
                      ? 'Release File'
                      : `Attach or Drag and drop image/video files here*`
                  }
                  endAdornment={
                    <Button
                      onClick={() => {}}
                      variant='contained'
                      type='submit'
                      color={'primary'}
                      startIcon={<MdAttachFile />}
                      style={{ fontSize: '11px', height: '28px' }}
                      // disabled={state?.username === '' || state?.password === ''}
                    >
                      <Typography
                        style={{ fontSize: '12px' }}
                        color={theme?.palette?.primary?.contrastText}
                      >
                        {'Attach'}
                      </Typography>
                    </Button>
                  }
                  label='Choose File'
                />
              </div>

              <Button
                variant='contained'
                startIcon={<FaUpload></FaUpload>}
                onClick={() => onUploadClick()}
                disabled={mediaMetaData === null}
                style={{
                  height: '32px',
                  marginTop: '18px',
                  marginRight: '8px',
                }}
              >
                Upload
              </Button>
              {loading && <CircularProgress />}

              {/* {renderfiles} */}
            </div>

            <Divider style={{ margin: '12px' }} />

            {/* {mediaMetaData?.name && ( */}
            <>
              <Typography fontSize={'16px'} fontWeight={'bold'}>
                Preview
              </Typography>
              <Card sx={{ height: '320px', maxWidth: 340 }}>
                {mediaMetaData?.type.includes('video') ? (
                  <ReactPlayer
                    playing
                    controls
                    volume={0.5}
                    width='340px'
                    height={'215px'}
                    playsinline
                    pip
                    loop
                    // muted
                    url={mediaUrl}
                    light={thumbnailUrl}
                    // light={require('../../assets/noImage.png')}
                    // url='https://www.youtube.com/watch?v=5986IgwaVKE&t=667s'
                    // light='https://example.com/thumbnail.jpg'
                  />
                ) : (
                  <img
                    src={
                      mediaUrl ? mediaUrl : require('../../assets/noImage.png')
                    }
                    height='200px'
                    width={'250px'}
                    alt='Image/video'
                    style={{ padding: '8px' }}
                  />
                )}

                <Divider />

                <CardContent
                  style={{ display: 'flex', flexDirection: 'column' }}
                >
                  <Typography
                    gutterBottom
                    fontSize={'12px'}
                    color='#434343'
                    component='div'
                    fontWeight={'bold'}
                  >
                    {mediaMetaData?.name}
                  </Typography>
                  <Typography color='text.secondary'>{`Size:  ${size} MB`}</Typography>
                  <Typography color='text.secondary'>
                    {`Type:  ${mediaMetaData?.type || ''} `}
                  </Typography>
                  {/* <Typography variant='h6' color='text.secondary'>
              {`Airline:  ${flightDetails?.airline}`}
            </Typography> */}
                </CardContent>
              </Card>
            </>
            {/* )} */}

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
          </Grid>
          <Grid
            style={{ paddingRight: '8px', borderLeft: 'solid 1px #c9c9c9' }}
            item
            xs={12}
            sm={7}
          >
            <div style={{ minHeight: '400px' }}>
              {' '}
              <Typography style={{ height: '45px' }} variant='h4'>
                {' '}
                Media List
              </Typography>
              <Divider style={{ marginBottom: '8px' }} />
              {mediaLoading ? (
                <CircularProgress />
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
                            <Card style={{ height: '300px', width: '100%' }}>
                              <CardHeader
                                style={{ padding: '8px' }}
                                title={onlyName}
                                action={
                                  <LongMenu
                                    // mediaInfo = {storedMedia}
                                    deleteCallbackHandler={() => {
                                      handleDelete(storedMedia);
                                    }}
                                    editCallbackHandler={() => {}}
                                  />
                                }
                              />
                              {storedMedia?.metadata?.contentType?.includes(
                                'video'
                              ) ? (
                                <ReactPlayer
                                  playing
                                  controls
                                  volume={0.5}
                                  width='310px'
                                  height={'125px'}
                                  playsinline
                                  pip
                                  loop
                                  url={storedMedia?.downloadUrl}
                                  light={thumbnailUrl}
                                />
                              ) : (
                                // eslint-disable-next-line jsx-a11y/img-redundant-alt
                                <img
                                  src={storedMedia?.downloadUrl}
                                  height='100px'
                                  width={'150px'}
                                  alt={`Image${onlyName}`}
                                  style={{ padding: '8px' }}
                                />
                              )}

                              <Divider />

                              <CardContent
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                }}
                              >
                                {/* <Typography
                              gutterBottom
                              fontSize={'12px'}
                              color='#434343'
                              component='div'
                              fontWeight={'bold'}
                            >
                              {storedMedia?.metadata?.name}
                            </Typography> */}
                                <Typography
                                  style={{ textAlign: 'left' }}
                                  color='text.secondary'
                                >{`Size:  ${size} MB`}</Typography>
                                <Typography
                                  style={{ textAlign: 'left' }}
                                  color='text.secondary'
                                >
                                  {`Type:  ${
                                    storedMedia?.metadata?.contentType || ''
                                  } `}
                                </Typography>
                                <Typography
                                  style={{ textAlign: 'left' }}
                                  color='text.secondary'
                                >
                                  {`Time Created :  ${new Date(
                                    storedMedia?.metadata?.timeCreated
                                  )} `}
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
                          src={require('../../assets/noRecords.png')}
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

        {}
      </Container>
    </>
  );
}

export default CustomDropzone;
