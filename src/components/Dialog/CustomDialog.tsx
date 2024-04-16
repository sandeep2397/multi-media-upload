import { useTheme } from '@emotion/react';

import { IconButton, Dialog as _Dialog } from '@mui/material';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/material/styles';
import { FC, ReactNode, useState } from 'react';
import { FaX } from 'react-icons/fa6';
interface Props {
  icon: any;
  title: any;
  body: ReactNode;
  handleSave?: any;
  saveTitle?: string;
  saveIcon?: any;
  isSaveDisabled?: boolean;
  customFooter?: ReactNode;
  handleClose: () => void;
  style?: any;
  bodyStyle?: any;
  hasResetButton?: boolean;
  handleResetPassword?: () => void;
  fullWidth?: boolean;
}

const BootstrapDialog = styled(_Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const CustomDialog: FC<Props> = (props: Props) => {
  const theme: any = useTheme();
  const {
    title,
    body,
    isSaveDisabled,
    style,
    bodyStyle,
    customFooter,
    handleSave,
    saveTitle,
    saveIcon,
    handleClose,
    hasResetButton,
    handleResetPassword,
  } = props;
  const [resetButtonClicked, setResetButtonClicked] = useState(false);

  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby='customized-dialog-title'
      open={true}
      fullWidth={props.fullWidth}
      scroll='body'
      sx={{
        '& .MuiPaper-root': {
          maxWidth: '90vw',
          ...style,
        },
      }}
    >
      <IconButton
        aria-label='close'
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.common.white,
        }}
      >
        <FaX />
      </IconButton>
      <DialogTitle
        sx={{
          p: '12px',
          bgcolor: theme.palette.primary.main,
          color: '#fff',
        }}
      >
        <props.icon
          sx={{ color: '#fff' }}
          style={{ marginRight: '8px', marginTop: '4px' }}
          fontSize='20px'
        />
        {title}
      </DialogTitle>
      <DialogContent style={{ minHeight: '120px', ...bodyStyle }} dividers>
        {body}
      </DialogContent>
      {customFooter && customFooter}
    </BootstrapDialog>
  );
};

export default CustomDialog;
