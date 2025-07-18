export const RoleMetadata = {
    SUPER_ADMIN: {
      name: 'SUPER_ADMIN',
      description: 'Super administrator with all permissions.',
    },
    ADMIN: {
      name: 'ADMIN',
      description: 'Administrator with management permissions.',
    },
    CUSTOMER: {
      name: 'CUSTOMER',
      description: 'Regular customer user.',
    },
  } as const;