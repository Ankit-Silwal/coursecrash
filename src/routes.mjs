import authRoutes from "./modules/auth/auth.routes.mjs";

export const setupRoutes = (app) => {
  app.use('/api/auth', authRoutes);
};
