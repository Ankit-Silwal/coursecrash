import authRoutes from "./modules/auth/auth.routes.mjs";
import userRoutes from "./modules/users/user.routes/routes.mjs";

export const setupRoutes = (app) => {
  app.use('/api/auth', authRoutes);
  app.use('/api/user',userRoutes)
};
