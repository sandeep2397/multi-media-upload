/*
©2022 Pivotree | All rights reserved
*/
import axios from 'axios';
import { toggleSnackbar } from '../redux/root_actions';

const completeFtpOperation = async (
  generateJsonInp: any,
  callbackhandler: any,
  dispatch: any,
  module: string,
  progressbarCallbackHandler: any,
  typeIndex?: number,
  processingIndex?: number,
  otherType?: string
) => {
  try {
    const generateJsonOutResp = await axios.post(
      `https://nodepvtwms.pivotree-solutions.com:1414/generateJsonFile`,
      generateJsonInp
    );
    console.log(generateJsonOutResp);

    try {
      let uploadToServerInp = {
        ...generateJsonInp,
        createdDate: generateJsonOutResp?.data?.createdDate,
      };
      const uploadToServerOutput = await axios.post(
        `https://nodepvtwms.pivotree-solutions.com:1414/uploadToServer`,
        uploadToServerInp
      );

      try {
        // const config = {
        //   onDownloadProgress: (data: any) => {
        //     //Set the progress value to show the progress bar
        //     progressbarCallbackHandler(data);
        //      setProgress(Math.round((100 * data.loaded) / data.total))
        //   },
        // };

        const shellScriptOutput = await axios.post(
          `https://nodepvtwms.pivotree-solutions.com:1414/runshellscript`,
          {
            module,
          }
          // config
        );

        callbackhandler(typeIndex, processingIndex, otherType);
      } catch (shellErrOutput: any) {
        dispatch(
          toggleSnackbar({
            isOpen: true,
            message: 'Data creation failed',
            severity: 'error',
            error: shellErrOutput,
          })
        );
        // console.error(shellErrOutput);
      }
    } catch (errorGenResp: any) {
      dispatch(
        toggleSnackbar({
          isOpen: true,
          message: 'Data creation failed',
          severity: 'error',
          error: errorGenResp,
        })
      );
    }
  } catch (err) {
    // Handle Error Here
    console.error(err);
  }
};

export const uploadJsonData = (
  jsonData: object,
  type: string,
  userId: string,
  module: string,
  url: string,
  callbackHandler: any,
  dispatch: any,
  progressbarCallbackHandler?: any,
  index?: number,
  processingIndex?: number,
  otherType?: string
) => {
  let generateJsonInp = {
    data: {
      ...jsonData,
    },
    type,
    userId,
    module,
  };
  completeFtpOperation(
    generateJsonInp,
    callbackHandler,
    dispatch,
    module,
    progressbarCallbackHandler,
    index,
    processingIndex,
    otherType
  );
  // axios
  //   .post(`https://nodepvtwms.pivotree-solutions.com:1414/generateJsonFile`, {
  //     data: {
  //       requestMethod: 'POST',
  //       url,
  //       data: jsonData,
  //     },
  //     type,
  //     userId,
  //   })
  //   .then((resp: any) => {
  //     axios
  //       .post(`https://nodepvtwms.pivotree-solutions.com:1414/uploadToServer`, {
  //         type,
  //         userId,
  //         module,
  //         createdDate: resp?.data?.createdDate,
  //         data: {
  //           requestMethod: 'POST',
  //           url,
  //           data: jsonData,
  //         },
  //       })
  //       .then((resp: any) => {
  //         const config = {
  //           onDownloadProgress: (data: any) => {
  //             //Set the progress value to show the progress bar
  //             progressbarCallbackHandler(data);
  //             // setProgress(Math.round((100 * data.loaded) / data.total))
  //           },
  //         };

  //         axios
  //           .post(
  //             'https://nodepvtwms.pivotree-solutions.com:1414/runshellscript',
  //             {
  //               module,
  //             },
  //             config
  //           )
  //           .then(() => {
  //             callbackHandler();
  //           })
  //           .catch((errorGenResp: any) => {
  //             dispatch(
  //               toggleSnackbar({
  //                 isOpen: true,
  //                 message: 'Data creation failed',
  //                 severity: 'error',
  //                 error: errorGenResp,
  //               })
  //             );
  //           });
  //       })
  //       .catch((err: any) => {
  //         dispatch(
  //           toggleSnackbar({
  //             isOpen: true,
  //             message: 'Data creation failed',
  //             severity: 'error',
  //             error: err,
  //           })
  //         );
  //       });
  //   })
  //   .catch((err: any) => {
  //     dispatch(
  //       toggleSnackbar({
  //         isOpen: true,
  //         message: 'Data creation failed',
  //         severity: 'error',
  //         error: err,
  //       })
  //     );
  //   });
};
