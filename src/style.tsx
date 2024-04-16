import styled from '@emotion/styled';
import { Button, FormLabel, Grid } from '@mui/material';
import { rgba } from 'polished';

interface Props {
  theme?: any;
  borderColor?: boolean;
  bgimage?: any;
}

export const LargeText = styled(FormLabel)`
  position: relative;
  text-align: left;
  padding-left: 50px;
  min-height: 60px;
  display: inline-flex;
  align-items: center;
  vertical-align: middle !important;
  font-family: Roboto Black;
  border: 1px solid
    ${(props: Props) =>
      props.borderColor ? props.borderColor : props.theme.palette.innerpack};
`;

export const LoginLayoutWrapper = styled.div`
  @media only screen and (min-width: 1200px) {
    top: 10%;
  }

  @media only screen and (max-width: 992px) {
    top: 10%;
  }

  position: absolute;
  left: 0;
  right: 0;
  top: 15%;
  max-width: 425px;
  margin-left: 24px;
`;

export const LoginLabel = styled.h1`
  font-family: ${(props: Props) => props.theme.typography.body1.fontFamily};
  margin-right: 2px;
  color: #434343;
  font-size: 16px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.36;
  letter-spacing: normal;
  text-align: left;
  width: auto;
  height: auto;
  margin: 0;
  margin-top: 16px;
`;

export const WelcomeLabel = styled.h4`
  font-family: ${(props: Props) => props.theme.typography.body1.fontFamily};
  margin-right: 2px;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.36;
  letter-spacing: normal;
  text-align: left;
  width: auto;
  height: auto;
  margin: 0;
`;

export const FooterLabel = styled.h6`
  font-family: ${(props: Props) => props.theme.typography.body1.fontFamily};
  margin-right: 2px;
  color: #a7a7a7;
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.8;
  letter-spacing: normal;
  text-align: left;
  width: auto;
  height: auto;
  margin: 0;
`;

export const LoginDiv = styled.h1`
  display: flex;
  flex-direction: column;
`;

export const RowContainer = styled(Grid)`
  margin-left: 0px;
`;
export const RightContainer = styled(Grid)`
  width: 60%;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  border-color: rgba(0, 0, 0, 0.1);
  padding: 0px;
  background-image: url(../../assets/images/loginbanner.png);
  background-repeat: no-repeat;
  background-position: 50% 50%;
  height: 100vh;
  background-size: cover;
  @media (max-width: 996px) {
    display: none;
  }
`;
export const LeftContainer = styled(Grid)`
  width: 40%;
  height: 100vh;
  @media (max-width: 996px) {
    width: 100%;
  }
`;

export const LoginFooter = styled.div`
  position: relative;
  bottom: -100px;
`;

export const ImageDiv = styled.div`
  height: 80px;
  width: 210px;
  background-image: url(${(props: Props) => props.bgimage});
`;
export const StyledForm = styled.form``;

export const LoginButton = styled(Button)`
  &:hover {
    outline: none;
    background-color: ${(props: Props) =>
      rgba(props.theme.palette.primary.main, 0.1)} !important;
    span {
      color: ${(props: Props) => props.theme.palette.primary.main} !important;
    }
    h4 {
      color: ${(props: Props) => props.theme.palette.primary.main} !important;
    }
    border: solid 1px ${(props: Props) => props.theme.palette.primary.main} !important;
    box-shadow: none;
  }
`;

export const UserLabel = styled.h6`
  font-family: ${(props: Props) => props.theme.typography.body1.fontFamily};
  margin-right: 2px;
  color: #a7a7a7;
  font-size: 10px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.36;
  letter-spacing: normal;
  text-align: left;
  width: auto;
  height: auto;
  margin: 0;
  line-height: 1.3;
`;
