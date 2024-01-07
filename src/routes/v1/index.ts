import express from "express";
<<<<<<< Updated upstream
// import authRoute from './auth.route';
// import userRoute from './user.route';
=======
import campaignRoute from "./campaign.route";
>>>>>>> Stashed changes
import docsRoute from "./docs.route";
import config from "../../config/config";

const router = express.Router();

const defaultRoutes = [
<<<<<<< Updated upstream
  // {
  //   path: '/auth',
  //   route: authRoute
  // },
  // {
  //   path: '/users',
  //   route: userRoute
  // }
=======
  {
    path: "/campaign",
    route: campaignRoute,
  },
>>>>>>> Stashed changes
];

const devRoutes = [
  // routes available only in development mode
  {
    path: "/docs",
    route: docsRoute,
  },
];

<<<<<<< Updated upstream
// defaultRoutes.forEach((route) => {
//   router.use(route.path, route.route);
// });
=======
defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
>>>>>>> Stashed changes

if (config.env === "development") {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

export default router;
