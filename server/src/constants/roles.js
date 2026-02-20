export const ROLES = {
  CUSTOMER: "customer",
  OWNER: "owner",
  ADMIN: "admin",
};

export const PERMISSIONS = {
  [ROLES.CUSTOMER]: [""],
  [ROLES.OWNER]: [""],
  [ROLES.ADMIN]: ["manage:all"],
};