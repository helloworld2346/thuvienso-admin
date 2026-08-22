export interface Role {
  idRole: string;
  roleName: string;
}

export interface Account {
  idAccount: string;
  accountName: string;
  userName: string;
  roleEntity: Role | null;
}

export interface AccountPayload {
  accountName: string;
  password: string;
  userName: string;
  role: string;
}

export interface RolePayload {
  roleName: string;
}
