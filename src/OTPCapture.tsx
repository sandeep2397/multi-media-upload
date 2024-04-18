import { Box, Button, TextField, Typography } from '@mui/material';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';

interface OTPCaptureProps {
  phoneNumber: string;
  length?: number;
  onComplete: (otp: string) => void;
  toggleBackToLoginPage: () => void;
}

const OTPCapture: React.FC<OTPCaptureProps> = ({
  length = 6,
  onComplete,
  phoneNumber,
  toggleBackToLoginPage,
}) => {
  // const {phoneNumber} = props;
  const [otp, setOTP] = useState<string[]>(new Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>(
    Array(length).fill(null)
  );

  const handleChange = (index: number, value: string) => {
    const newOTP = [...otp];
    newOTP[index] = value;
    setOTP(newOTP);

    if (!newOTP.includes('')) {
      onComplete(newOTP.join(''));
    }
  };

  useEffect(() => {
    if (inputRefs) {
      inputRefs?.current?.[0]?.focus();
    }
  }, []);
  //   const handleKeyDown = (
  //     event: React.KeyboardEvent<HTMLInputElement>,
  //     index: number
  //   ) => {
  //     if (event?.key === 'Backspace' && index > 0 && !otp[index]) {
  //       handleChange(index - 1, '');
  //     } else if (
  //       event?.key === 'ArrowRight' &&
  //       index < length - 1 &&
  //       otp[index]
  //     ) {
  //       inputRefs.current[index + 1]?.focus();
  //     } else if (event?.key === 'ArrowLeft' && index > 0) {
  //       inputRefs.current[index - 1]?.focus();
  //     }
  //   };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = event.target;
    if (/^\d*$/.test(value) && value.length <= 1) {
      handleChange(index, value);
      if (value.length === 1 && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (event.key === 'Backspace' && index > 0 && !otp[index]) {
      handleChange(index - 1, '');
    } else if (event.key === 'ArrowRight' && index < length - 1 && otp[index]) {
      inputRefs.current[index + 1]?.focus();
    } else if (event.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <Box style={{ alignContent: 'center', textAlign: 'center' }}>
      <div
        style={{
          textAlign: 'center',
          margin: 'auto',
          height: '80px',
          width: '210px',
        }}
      >
        <img
          src={require('./assets/verifyOtp.jpg')}
          height='100%'
          width={'100%'}
          alt='Logo'
          style={{
            aspectRatio: 3 / 2,
            objectFit: 'contain',
            mixBlendMode: 'darken',
          }}
        />
      </div>
      <div style={{ margin: '16px 0px' }}>
        {' '}
        <Typography style={{ fontSize: '18px', fontWeight: '500' }}>
          Verify with OTP
        </Typography>
        <Typography style={{ fontSize: '12px', color: '#a7a7a7' }}>
          {`Sent to +91 ${phoneNumber}`}
        </Typography>
      </div>

      <div>
        {otp.map((digit, index) => (
          <TextField
            key={index}
            inputRef={(el) => (inputRefs.current[index] = el)}
            type='text'
            //   maxLength={1}
            value={digit}
            onChange={(e: any) => handleInputChange(e, index)}
            onKeyDown={(e: any) => handleKeyDown(e, index)}
            inputProps={{ maxLength: 1 }}
            style={{
              width: '30px',
              height: '42px!important',
              padding: '4px!important',
              marginRight: '10px',
            }}
            sx={{
              '.MuiInputBase-input': {
                height: '50px!important',
                width: '30px!important',
                padding: '6px!important',
                textAlign: 'center',
                fontSize: '22px',
                fontWeight: '500',
              },
            }}
          />
        ))}
      </div>
      <div
        id='recaptcha-container'
        style={{ marginTop: '10px', margin: 'auto' }}
        // className="justify-center flex"
      ></div>
      <Button
        color='primary'
        style={{ fontWeight: 'bold', marginTop: '16px' }}
        onClick={() => {
          toggleBackToLoginPage();
        }}
      >
        Back to Login Page
      </Button>
    </Box>
  );
};

export default OTPCapture;
