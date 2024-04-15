/*
©2022 Pivotree | All rights reserved
*/
import styled from '@emotion/styled';
interface Props {
  theme?: any;
  bgimage?: any;
}

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
