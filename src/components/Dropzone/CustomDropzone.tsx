import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  OutlinedInput,
  Snackbar,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import CardContent from '@mui/material/CardContent';
import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { MdAttachFile } from 'react-icons/md';
import ReactPlayer from 'react-player';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { v4 } from 'uuid';
// import VideoThumbnailGenerator from 'video-thumbnail-generator';
import { DialogActions } from '@mui/material';
import 'firebase/storage';
import {
  getMetadata,
  ref,
  updateMetadata,
  uploadBytes,
} from 'firebase/storage';
import { FaUpload } from 'react-icons/fa';
import { MdCloudUpload, MdOutlineCancel } from 'react-icons/md';
import '../../firebaseConfig';
import { mediaDb } from '../../firebaseConfig';
import CustomDialog from '../Dialog/CustomDialog';
import CountrySelect from '../select/Dropdown';
import StarRating from '../star-rating/StarRating';

interface Props {
  handleClose: (isConfirm?: any) => void;
  mode: string;
}

interface State {
  Description?: string;
  ImageId?: string;
  Author?: string;
  Location?: any;
  imageDimension?: any;
}

function CustomDropzone(props: Props) {
  const theme: any = useTheme();
  const [invalidFileType, setInvalidMediaType] = useState(false);
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
    Author: '',
    imageDimension: null,
    Location: { code: 'IN', label: 'India', phone: '91' },
  };

  let initImageUrl = '';

  //useState

  const [state, setState] = useState<State>(initState);
  const [mediaUrl, setMediaUrl]: any = useState(initImageUrl);

  const onDrop = useCallback((acceptedFiles: any) => {
    setInvalidMedia(false);

    setInvalidMediaType(false);
    const formData: any = new FormData();
    const fileUploaded = acceptedFiles?.[0] || {};
    const fileName = fileUploaded?.name;
    formData.append('form-data', fileUploaded, fileName);
  }, []);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({ onDrop });

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

  useEffect(() => {
    if (acceptedFiles && acceptedFiles?.length > 0) {
      let uploadedFiles: any = acceptedFiles || [];
      // setFiles(uploadedFiles);

      let mediaInfo = uploadedFiles?.[0] || null;

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
        setMediaMetaData(mediaInfo);
        setInvalidMedia(false);
        setState({
          ...state,
          ImageId: mediaName,
          Author: mediaName,
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
        //     Author: mediaName,
        //     imageDimension,
        //   });
        // };
      } else {
        setInvalidMedia(true);
        setMediaUrl('');
        setInvalidMediaType(true);
        setMediaMetaData(null);
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

  const handleUploadClick = async () => {
    let mediaRef = null;
    setLoading(true);
    setMediaLoading(true);

    // if (mediaMetaData?.type.includes('image')) {
    //   mediaRef = ref(mediaDb, `images/${mediaMetaData?.name + '_' + v4()}`);
    // } else {
    //   mediaRef = ref(mediaDb, `videos/${mediaMetaData?.name + '_' + v4()}`);
    // }

    mediaRef = ref(mediaDb, `mediaFiles/${mediaMetaData?.name + '_' + v4()}`);
    try {
      const uploadedFile = await uploadBytes(mediaRef, mediaMetaData);
      let metadata: any = await getMetadata(mediaRef);
      metadata = {
        ...metadata,
        customMetadata: {
          description: state?.Description,
          locationName: state?.Location?.label,
          locationCode: state?.Location?.code,
          rating,
        },
      };
      // Object.assign(metadata.customMetadata, {
      //   description: 'Custom name',
      // });
      try {
        await updateMetadata(mediaRef, metadata);
      } catch (err) {
        setInvalidMedia(true);
      }
      setLoading(false);
      setMediaUploadToServer(true);
      props.handleClose(true);
    } catch (err) {
      setInvalidMedia(true);
    }

    // uploadBytes(mediaRef, mediaMetaData)
    //   .then(() => {
    //     setLoading(false);
    //     fetchAllMediaApi();
    //   })
    //   .catch((err) => {
    //     setLoading(false);
    //     setMediaUploadToServer(false);
    //   });
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

  const handleRatingChange = (value: any) => {
    setRating(value);
    // You can perform additional actions here, such as submitting the rating to a server
  };

  const footer = () => {
    return (
      <DialogActions>
        <Button
          onClick={() => props.handleClose(false)}
          variant='outlined'
          startIcon={<MdOutlineCancel />}
        >
          {'Cancel'}
        </Button>

        <Button
          variant='contained'
          startIcon={<FaUpload></FaUpload>}
          onClick={() => handleUploadClick()}
          disabled={mediaMetaData === null || invalidFileType}
          style={{
            height: '32px',
            marginRight: '8px',
          }}
        >
          Upload
        </Button>
      </DialogActions>
    );
  };

  const body = () => {
    return (
      <Box style={{ margin: '0px 16px' }}>
        {mediaLoading ? (
          <CircularProgress />
        ) : (
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

            {/* {loading && <CircularProgress />} */}

            {/* {renderfiles} */}
          </div>
        )}

        <Divider style={{ margin: '12px' }} />
        <Grid container spacing={2}>
          {' '}
          <Grid item xs={6} md={8}></Grid>
          <Grid item xs={6} md={6}>
            <Typography variant='h6'>Additional Meta data : </Typography>
            <div
              className='card-container'
              style={{
                padding: '0px 8px',
                gridTemplateColumns: `repeat(2, 1fr)`,
              }}
            >
              <div className='card-item'>
                <TextField
                  id='outlined-desc'
                  label='Description'
                  variant='standard'
                  type='text'
                  name='Description'
                  value={state?.Description}
                  onChange={(e) => {
                    let val = e?.target?.value;
                    setState({
                      ...state,
                      Description: val,
                    });
                  }}
                />
              </div>
              <div className='card-item'>
                <CountrySelect
                  sendLocationBack={(selectedOption: any) => {
                    setState({
                      ...state,
                      Location: selectedOption,
                    });
                  }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '4px' }}>
              <h3>Rate this content:</h3>
              <StarRating defaultValue={rating} onChange={handleRatingChange} />
            </div>
          </Grid>
          <Grid item xs={6} md={6}>
            <Typography fontSize={'16px'} fontWeight={'bold'}>
              Preview
            </Typography>
            <div
              style={{
                borderRadius: '4px',
                boxShadow:
                  '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
                maxHeight: '215px',
                // transition
                maxWidth: '310px!important',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <div>
                {' '}
                {mediaMetaData?.type.includes('video') ? (
                  <ReactPlayer
                    playing
                    controls
                    volume={0.5}
                    width='100%'
                    height={'215px'}
                    playsinline
                    pip
                    style={{ position: 'relative', bottom: '10px' }}
                    loop
                    // muted
                    url={mediaUrl}
                    light={thumbnailUrl}
                    // light={require('../../assets/noImage.png')}
                    // url='https://www.youtube.com/watch?v=5986IgwaVKE&t=667s'
                    // light='https://example.com/thumbnail.jpg'
                  />
                ) : (
                  // eslint-disable-next-line jsx-a11y/img-redundant-alt
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
              </div>
              <div style={{ width: '70%' }}>
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
                </CardContent>
              </div>
            </div>
          </Grid>
        </Grid>

        {invalidFileType && (
          <Snackbar
            open={invalidFileType}
            autoHideDuration={6000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          >
            <Alert
              onClose={handleClose}
              variant='filled'
              sx={{ width: '100%' }}
              severity='error'
            >
              {'Invalid File type attached'}
            </Alert>
          </Snackbar>
        )}
      </Box>
    );
  };
  return (
    <CustomDialog
      icon={MdCloudUpload}
      title={props.mode === 'edit' ? 'Edit Media Data' : 'Create Media Data'}
      body={body()}
      customFooter={footer()}
      style={{
        transform: 'translate(0px, -5%)',
        // ...style,
        // minWidth: '1050px',
        width: '1050px',
        height: '485px',
      }}
      bodyStyle={{
        height: 'auto',
      }}
      handleClose={() => props.handleClose(false)}
    />
  );
}

export default CustomDropzone;
