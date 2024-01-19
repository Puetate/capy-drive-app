const superAdmin = {
  users: "/admin/users",
  campus: "/admin/campus",
  faculties: "/admin/faculties",
  period: "/admin/periods",
  roles: "/admin/roles",
  careers: "/admin/careers"
};

const admin = {
  users: "/admin/users"
};

const secretary = {
  templates: "/admin/templates",
  students: "/admin/students",
  files: "/admin/files"
};

export const superAdminRoutes = Object.values(superAdmin);
export const adminRoutes = Object.values(admin);
export const secretaryRoutes = Object.values(secretary);

export const routes: Record<string, string[]> = {
  "SUPER-ADMIN": superAdminRoutes,
  ADMIN: adminRoutes,
  SECRETARY: secretaryRoutes
};

export const defaultRoutes: Record<string, string> = {
  "SUPER-ADMIN": superAdmin.users,
  ADMIN: admin.users,
  SECRETARY: secretary.students
};
