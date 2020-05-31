export const getParentRoutePath = routePath => {
  return routePath.substring(0, routePath.lastIndexOf("/"));
};
