export const existRoute = (routes: string[], idRoute: string | null) => {
  const resFilter = routes.find((item) => item === idRoute);
  if (resFilter) {
    return true;
  } else {
    return false;
  }
};
