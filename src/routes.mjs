import authRoutes from "./modules/auth/auth.routes.mjs";
import userRoutes from "./modules/users/user.routes/routes.mjs";
import adminroutes from "./modules/admin/admin.routes/adminroutes.mjs";
import instructorroutes from "./modules/instructor/instructor.routes/instructorroutes.mjs";

export const setupRoutes = (app) => {
  app.use('/api/auth', authRoutes);
  app.use('/api/user',userRoutes)
  app.use('/api/admin',adminroutes)
  app.use('/api/instructor',instructorroutes)
};
