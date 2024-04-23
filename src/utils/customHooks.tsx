import { useSelector } from 'react-redux';

export const useGetUserId = () => {
  const loggedInData =
    useSelector((state: any) => state.Common.loggedInData) || {};
  // const onlyPhone = phoneNumber?.toString()?.slice(-10);

  return (
    loggedInData?.user?.email ||
    loggedInData?.user?.phoneNumber?.toString()?.slice(-10) ||
    ''
  );
};
