export const ROLES = {
  CUSTOMER: "customer",
  OWNER: "owner",
  ADMIN: "admin",
};

// Useful for Role-Based Access Control (RBAC) in middlewares
export const PERMISSIONS = {
  [ROLES.CUSTOMER]: ["read:canteen", "create:order", "read:order"],
  [ROLES.OWNER]: ["manage:canteen", "manage:menu", "manage:order"],
  [ROLES.ADMIN]: ["manage:all"],
};