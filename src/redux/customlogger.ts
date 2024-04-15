const loggerMiddleware =
  (store: { getState: () => any }) =>
  (next: (arg0: any) => void) =>
  (action: any) => {
    console.log('STATE BEFORE', store.getState());
    console.log('ACTION DISPATCHED', action);
    next(action);
    console.log('STATE AFTER', store.getState());
  };
export default loggerMiddleware;
