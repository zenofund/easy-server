export const UserRole = {
  BUYER: 'BUYER',
  SELLER: 'SELLER',
  INSPECTOR: 'INSPECTOR',
  ADMIN: 'ADMIN',
} as const;

export type UserRoleType = keyof typeof UserRole;

export const getDashboardUrl = (role?: string): string => {
  if (!role) return '#home';
  
  const normalizedRole = role.toUpperCase();
  
  switch (normalizedRole) {
    case UserRole.ADMIN:
      return '#admin';
    case UserRole.SELLER:
      return '#seller-dashboard';
    case UserRole.INSPECTOR:
      return '#inspector-dashboard';
    case UserRole.BUYER:
    default:
      return '#buyer-dashboard';
  }
};
