export const ROUTES = {
  DVS_START: "/dvs-start",
  DVS_SELECT_JOURNEY: "/dvs-start",
  // GDS Routes
  SELECT_APP: "/select-app",
  SELECT_DOCUMENT: "/select-document",
  // Common Routes
  CREDENTIAL_OFFER_VIEWER: "/view-credential-offer/:itemId",
};

export const dvsRoutes = [ROUTES.DVS_START, ROUTES.DVS_SELECT_JOURNEY];
export const gdsRoutes = [ROUTES.SELECT_APP, ROUTES.SELECT_DOCUMENT];
export const commonRoutes = [ROUTES.CREDENTIAL_OFFER_VIEWER];
