import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
  useTheme,
} from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import { Cookies } from "react-cookie";
import { FaEye, FaEyeSlash, FaLock, FaUser } from "react-icons/fa";
import { MdLogin } from "react-icons/md";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { captureLoggedInUser, toggleSessionPrompt } from "./redux/root_actions";
import {
  LoginButton,
  LoginDiv,
  LoginLabel,
  LoginLayoutWrapper,
  StyledForm,
  WelcomeLabel,
} from "./style";

// import { signInWithEmailAndPassword } from 'firebase/auth';
import {
  ConfirmationResult,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  signInWithPopup,
} from "firebase/auth";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
// import 'react-phone-input-2/lib/style.css';
import OTPCapture from "./OTPCapture";
import provider from "./authProvider";
import { auth } from "./customFirebaseConfig";
import { customAuth } from "./firebaseConfig";
import { userData } from "./userStubbedData";

interface Props {
  children?: null;
}

const Login: FC<Props> = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();

  const [showPassword, setShowPassword] = React.useState(false);
  const [pcapsState, passscapsState] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [invalidCreds, setInvalidCreds] = useState(false);
  const [popupBlocked, setPopupBlocked] = useState(false);
  const [existingAccount, setExistingAccount] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [invalidNumber, setInvalidNumber] = useState(false);
  const [customErrorData, setCustomErrorData] = useState({
    errorOccured: false,
    errorMsg: "",
  });
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const [captureOTP, setOTPCaptureScreen] = useState(false);
  const [savedOtp, setSavedOtp] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  // const [invalidCreds, setInvalidCreds] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const [state, setState] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    dispatch(toggleSessionPrompt(false));
  }, []);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handlekeypress = (e: KeyboardEvent) => {
    if (e.getModifierState("CapsLock")) {
      passscapsState(true);
    } else {
      passscapsState(false);
    }
  };

  const handleChange = (event: any): void => {
    let name = event?.target.name;
    let value = event?.target.value;
    event.target.setCustomValidity("");
    setInvalidCreds(false);
    setState({
      ...state,
      [name]: value,
    });
  };

  const onFormSubmit = async (event: any) => {
    event.preventDefault();
    const cookies = new Cookies();
    setLoginLoading(true);
    try {
      // const auth = getAuth();
      // await firebase.auth().signInWithEmailAndPassword(state.username, state.password);

      const loginResp: any = userData?.find(
        (user: any) =>
          user.userName === state.username && user.password === state.password
      );
      if (loginResp) {
        let cookieData = {
          jwtToken: loginResp?.accessToken,
        };
        let tempdata = JSON.stringify(cookieData);
        cookies.set("eventShuffle", tempdata, {
          path: "/",
        });
        navigate("/eventshuffle");
        setLoginLoading(false);
        dispatch(captureLoggedInUser(loginResp));
      } else {
        setLoginLoading(false);
        setInvalidCreds(true);
      }
    } catch (error) {
      setLoginLoading(false);
      setInvalidCreds(true);
    }
  };

  const handleGoogleSignIn = async () => {
    const cookies = new Cookies();
    try {
      // const auth = getAuth();
      // await firebase.auth().signInWithEmailAndPassword(state.username, state.password);
      const signInRes: any = await signInWithPopup(customAuth, provider);
      const credential: any =
        GoogleAuthProvider.credentialFromResult(signInRes);

      const token = credential?.accessToken;
      const user = signInRes.user;
      let cookieData = {
        jwtToken: token,
      };
      let tempdata = JSON.stringify(cookieData);
      cookies.set("eventShuffle", tempdata, {
        path: "/",
      });
      navigate("/eventshuffle");
      setLoginLoading(false);
      dispatch(captureLoggedInUser(signInRes));
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.error("Sign In err===>", credential);
      setLoginLoading(false);

      if (error.code === "auth/popup-blocked") {
        setPopupBlocked(true);
      } else {
        setInvalidCreds(true);
      }
    }
  };

  const handleGetOtp = () => {
    const phoneNumberRegex = /^[5-9]\d{9}$/;
    const onlyPhone = phoneNumber?.toString()?.slice(-10);
    if (phoneNumberRegex.test(onlyPhone)) {
      sendOTPToUser();
    } else {
      setInvalidNumber(true);
    }
  };

  //   const verifyRecaptcha = async (
  //     recaptchaVerifier: RecaptchaVerifier,
  //     timeout: number
  //   ): Promise<boolean> => {
  //     return new Promise<boolean>((resolve, reject) => {
  //       // Start the reCAPTCHA verification process
  //       recaptchaVerifier
  //         .render()
  //         .then(() => {
  //           // Resolve the promise when reCAPTCHA is successfully rendered
  //           resolve(true);
  //         })
  //         .catch((error) => {
  //           // Reject the promise if there's an error during reCAPTCHA rendering
  //           reject(error);
  //         });

  //       // Set a timeout to reject the promise if verification takes too long
  //       setTimeout(() => {
  //         reject(new Error('ReCAPTCHA verification timed out'));
  //       }, timeout);
  //     });
  //   };

  const sendOTPToUser = async () => {
    // setLoginLoading(true)
    const appVerifier: any = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {}
    );
    const onlyPhone = phoneNumber?.toString()?.slice(-10);
    const lengthOfPhoneWithCode = phoneNumber?.length;
    const countryCode = phoneNumber
      ?.toString()
      ?.slice(0, lengthOfPhoneWithCode - 10);

    const phoneNumberWithCountryCode = `+${countryCode} ${onlyPhone}`;
    signInWithPhoneNumber(auth, phoneNumberWithCountryCode, appVerifier)
      ?.then((confitmationOTP: any) => {
        setConfirmationResult(confitmationOTP);
        setOTPCaptureScreen(true);
      })
      .catch((err: any) => {
        setCustomErrorData({
          errorOccured: true,
          errorMsg: err.code || "Invalid Phone Number",
        });
        console.error("otp error=====>", err);
      });
    // try {
    //   const confitmationOTP = await signInWithPhoneNumber(
    //     auth,
    //     phoneNumberWithCountryCode,
    //     appVerifier
    //   );
    //   setConfirmationResult(confitmationOTP);
    //   setOTPCaptureScreen(true);
    //   // setOTPCaptureScreen(true);
    // } catch (err: any) {
    //   setCustomErrorData({
    //     errorOccured: true,
    //     errorMsg: err.code || 'Invalid Phone Number',
    //   });
    //   console.error('otp error=====>', err);
    // }
  };

  //   const handleVerifyOTP = async (otp: any) => {
  //     try {
  //       const credential = PhoneAuthProvider.credential(
  //         confirmationResult?.verificationId || '',
  //         otp
  //       );
  //       await signInWithCredential(customAuth, credential);

  //       //   const token = credential.;
  //       //   const user = credential?.user;
  //       let cookieData = {
  //         jwtToken: `21111`,
  //       };
  //       const cookies = new Cookies();

  //       let tempdata = JSON.stringify(cookieData);
  //       cookies.set('eventShuffle', tempdata, {
  //         path: '/',
  //       });
  //       navigate('/eventshuffle');
  //       setLoginLoading(false);
  //       dispatch(captureLoggedInUser(credential));
  //       // OTP verification successful, proceed with authenticated user
  //     } catch (error: any) {
  //       if (error.code === 'auth/timeout') {
  //         console.error('OTP confirmation timed out');
  //         // Handle timeout error, e.g., display error message to user
  //       } else {
  //         console.error('Error verifying OTP:', error);
  //         // Handle other errors, e.g., display error message to user
  //       }
  //     }
  //   };

  const confirmOtp = async (otp: string) => {
    try {
      // Confirm OTP
      const credential: any = await confirmationResult?.confirm(otp);
      // console.log('User authenticated successfully:', credential?.user);
      const token = credential?.accessToken;
      const user = credential.user;
      let cookieData = {
        jwtToken: token,
      };
      const cookies = new Cookies();

      let tempdata = JSON.stringify(cookieData);
      cookies.set("eventShuffle", tempdata, {
        path: "/",
      });
      navigate("/eventshuffle");
      setLoginLoading(false);
      dispatch(captureLoggedInUser(credential));

      // return credential;
    } catch (err) {
      setLoginLoading(false);
      setCustomErrorData({
        errorOccured: true,
        errorMsg: "Incorrect OTP",
      });
      console.error("otp error=====>", err);
    }
  };

  return (
    <Box style={{ alignContent: "center", textAlign: "center" }}>
      {loginLoading && (
        <CircularProgress
          color="primary"
          style={{ margin: "160px", zIndex: 5 }}
        />
      )}
      <Card
        style={{
          maxWidth: 345,
          opacity: loginLoading ? 0.3 : 1,
          pointerEvents: loginLoading ? "none" : "auto",
        }}
      >
        <LoginLayoutWrapper
          style={{
            border: "solid 1px #c9c9c9",
            borderRadius: "8px",
            margin: "auto",
            padding: "2px 16px",
            background: "#f3f3ff",
            minHeight: "400px",
            height: "fit-content",
            marginTop: "-16px",
          }}
        >
          <Container
            fixed
            style={{
              textAlign: "center",
              marginTop: "4px",
              marginBottom: "8px",
              height: "80px",
              width: "210px",
            }}
          >
            <img
              src={require("./assets/Logo.png")}
              height="100%"
              width={"100%"}
              alt="Logo"
              style={{
                aspectRatio: 3 / 2,
                objectFit: "contain",
                mixBlendMode: "darken",
              }}
            />
          </Container>
          <Divider style={{ margin: "8px" }} />
          <Container fixed>
            {invalidCreds && (
              <Alert style={{ marginTop: "8px" }} severity="error">
                {" "}
                {"Invalid Credentials"}
              </Alert>
            )}

            {popupBlocked && (
              <Alert style={{ marginTop: "8px" }} severity="info">
                {" "}
                {"Enable popup blocker from your url"}
              </Alert>
            )}

            {customErrorData?.errorOccured && (
              <Alert style={{ marginTop: "8px" }} severity="error">
                {customErrorData?.errorMsg}
              </Alert>
            )}
            {captureOTP ? (
              <OTPCapture
                onComplete={(otp: string): void => {
                  setLoginLoading(true);
                  confirmOtp(otp);
                  //   handleVerifyOTP(otp);
                  setSavedOtp(otp);
                }}
                toggleBackToLoginPage={() => {
                  setOTPCaptureScreen(false);
                }}
                phoneNumber={phoneNumber}
              />
            ) : (
              <LoginDiv style={{ marginTop: "8px" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    margin: "8px",
                    marginTop: "0px",
                    // borderTop: 'solid 1px #a7a7a7',
                  }}
                >
                  <LoginLabel style={{ marginTop: "0px" }}>
                    {"Login To Event Shuffle App"}{" "}
                  </LoginLabel>{" "}
                </div>
                {pcapsState && (
                  <Typography
                    fontSize={"14px"}
                    fontWeight={500}
                    color="#1565c0"
                    style={{ margin: "0px 10px" }}
                  >
                    {"Caps Lock is on"}
                  </Typography>
                )}

                {/* <FormControl fullWidth sx={{ m: 1 }} variant="outlined">
                  <LoginButton
                    onClick={() => handleGoogleSignIn()}
                    variant="contained"
                    type="submit"
                    style={{ background: "#fff" }}
                    startIcon={
                      <img
                        src={require("./assets/google.png")}
                        height="25px"
                        width={"25px"}
                        alt="Logo"
                      />
                    }
                    // disabled={state?.username === '' || state?.password === ''}
                  >
                    <WelcomeLabel
                      style={{
                        color: theme?.palette?.primary?.main,
                        fontWeight: "bold",
                      }}
                      color={theme?.palette?.primary?.main}
                    >
                      {"Sign In with Google"}
                    </WelcomeLabel>
                  </LoginButton>
                </FormControl> */}
                {/* <Divider>
                  <Chip label="OR" size="small" />
                </Divider> */}

                {!existingAccount ? (
                  <StyledForm onSubmit={onFormSubmit}>
                    <FormControl fullWidth sx={{ m: 1 }} variant="outlined">
                      <InputLabel htmlFor="outlined-adornment-username">
                        User Name
                      </InputLabel>
                      <OutlinedInput
                        id="outlined-adornment-username"
                        type={"text"}
                        name="username"
                        value={state.username}
                        required={state.username ? false : true}
                        onKeyPress={(event: any) => handlekeypress(event)}
                        onInvalid={(event: any) => {
                          if (state.username) {
                            //do nothing
                          } else {
                            event.target.setCustomValidity(
                              "Username is required"
                            );
                          }
                        }}
                        onChange={(event: any) => handleChange(event)}
                        startAdornment={
                          <InputAdornment position="start">
                            <FaUser color="primary" />
                          </InputAdornment>
                        }
                        placeholder="Enter user name"
                        label="User Name"
                        // autoFocus
                      />
                    </FormControl>

                    <FormControl fullWidth sx={{ m: 1 }} variant="outlined">
                      <InputLabel
                        color="primary"
                        htmlFor="outlined-adornment-password"
                      >
                        {"Password"}
                      </InputLabel>
                      <OutlinedInput
                        id="outlined-adornment-password"
                        type={showPassword ? "text" : "password"}
                        value={state.password}
                        name="password"
                        // ref={register({ required: true, maxLength: 80 })}
                        required={state.password ? false : true}
                        onKeyPress={(event: any) => handlekeypress(event)}
                        onChange={(event: any) => handleChange(event)}
                        onInvalid={(event: any) => {
                          if (state.password) {
                            //do nothing
                          } else {
                            event.target.setCustomValidity(
                              "Password is required"
                            );
                          }
                        }}
                        placeholder="Enter password"
                        startAdornment={
                          <InputAdornment position="start">
                            <FaLock color="primary" />
                          </InputAdornment>
                        }
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showPassword ? <FaEye /> : <FaEyeSlash />}
                            </IconButton>
                          </InputAdornment>
                        }
                        label="Password"
                      />
                    </FormControl>

                    <FormControl fullWidth sx={{ m: 1 }} variant="outlined">
                      <LoginButton
                        onClick={() => {}}
                        variant="contained"
                        type="submit"
                        startIcon={<MdLogin />}
                        // disabled={state?.username === '' || state?.password === ''}
                      >
                        <WelcomeLabel
                          color={theme?.palette?.primary?.contrastText}
                        >
                          {"Login"}
                        </WelcomeLabel>
                      </LoginButton>
                    </FormControl>
                    {/* <Button
                      color="primary"
                      onClick={() => {
                        setExistingAccount(false);
                      }}
                    >
                      Sign In with Phone Number
                    </Button> */}
                  </StyledForm>
                ) : (
                  <>
                    <FormControl fullWidth sx={{ m: 1 }} variant="outlined">
                      {/* <InputLabel htmlFor='outlined-adornment-phoneNumber'>
                        Mobile Number
                      </InputLabel> */}
                      <PhoneInput
                        country={"in"}
                        value={phoneNumber}
                        inputProps={{
                          name: "phoneNumber",
                          required: true,
                          autoFocus: true,
                        }}
                        enableSearch
                        inputStyle={{
                          width: "370px",
                          fontFamily: "Arial",
                          height: "40px",
                        }}
                        searchClass=""
                        //    required={phoneNumber ? false : true}
                        //    onEnterKeyPress={(event: any) => handlekeypress(event)}
                        // onKeyDown={(event: any) => {
                        //   if (event?.key === 'Enter') {
                        //     handleGetOtp();
                        //   }
                        // }}
                        onChange={(val: any) => {
                          //   let value = event?.target.value;
                          setInvalidNumber(false);
                          setPhoneNumber(val);
                        }}
                      />
                      {/* <OutlinedInput
                        id='outlined-adornment-phoneNumber'
                        type={'number'}
                        name='phoneNumber'
                        value={phoneNumber}
                        required={phoneNumber ? false : true}
                        onKeyPress={(event: any) => handlekeypress(event)}
                        onKeyDown={(event: any) => {
                          if (event?.key === 'Enter') {
                            handleGetOtp();
                          }
                        }}
                        onChange={(event: any) => {
                          let value = event?.target.value;
                          setInvalidNumber(false);
                          setPhoneNumber(value);
                        }}
                        startAdornment={
                          <InputAdornment position='start'>
                            
                            <LoginCountrySelect
                              defaultValue={{
                                code: 'IN',
                                label: 'India',
                                phone: '+91',
                              }}
                              sendLocationBack={(selectedOption: any) => {
                                setCountryCode(selectedOption);
                              }}
                            />
                          </InputAdornment>
                        }
                        placeholder='Enter 10 digit Phone Number'
                        label='Mobile Number'
                        autoFocus
                      /> */}
                      {invalidNumber && (
                        <Typography
                          style={{
                            textAlign: "left",
                            fontSize: "12px",
                            color: "#f36161",
                          }}
                          color="warning"
                        >{`Please enter valid mobile number(10 digits)`}</Typography>
                      )}
                    </FormControl>
                    <FormControl fullWidth sx={{ m: 1 }} variant="outlined">
                      <LoginButton
                        onClick={() => handleGetOtp()}
                        variant="contained"
                        type="submit"
                        startIcon={<MdLogin />}
                        // disabled={state?.username === '' || state?.password === ''}
                      >
                        <WelcomeLabel
                          color={theme?.palette?.primary?.contrastText}
                        >
                          {"Get otp"}
                        </WelcomeLabel>
                      </LoginButton>
                    </FormControl>
                    <div
                      id="recaptcha-container"
                      style={{ marginTop: "10px", margin: "auto" }}
                      // className="justify-center flex"
                    ></div>
                    <Button
                      color="primary"
                      onClick={() => {
                        setExistingAccount(true);
                      }}
                    >
                      Already Have an account? SignIn
                    </Button>
                  </>
                )}
              </LoginDiv>
            )}
          </Container>
        </LoginLayoutWrapper>
      </Card>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          marginLeft: "24px",
          position: "fixed",
          bottom: "20px",
        }}
      >
        {/* <FooterLabel>
            {<FaRegCopyright  color='primary' fontSize={'small'} />}{' '}
          </FooterLabel>
          <FooterLabel>{'2023 All rights reserved by Pivotree'} </FooterLabel> */}
      </div>
    </Box>
  );
};

export default Login;
