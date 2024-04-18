import { useSelector } from 'react-redux';

export const useGetUserId = () => {
  const loggedInData =
    useSelector((state: any) => state.Common.loggedInData) || {};
  return loggedInData?.user?.email || loggedInData?.user?.phoneNumber || '';
};
