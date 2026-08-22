export const AUDIT_ACTIONS = [
  "CREATE",
  "UPDATE",
  "DELETE",
  "LOGIN",
  "LOGOUT",
  "VIEW",
  "DOWNLOAD",
  "OTHER",
] as const;
export type AuditAction = (typeof AUDIT_ACTIONS)[number];

export const AUDIT_ACTION_LABELS: Record<AuditAction, string> = {
  CREATE: "Tạo mới",
  UPDATE: "Cập nhật",
  DELETE: "Xoá",
  LOGIN: "Đăng nhập",
  LOGOUT: "Đăng xuất",
  VIEW: "Xem",
  DOWNLOAD: "Tải xuống",
  OTHER: "Khác",
};

export const AUDIT_ACTION_STYLES: Record<AuditAction, string> = {
  CREATE: "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-400",
  UPDATE: "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
  DELETE: "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400",
  LOGIN:
    "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
  LOGOUT: "bg-gray-100 text-gray-600 dark:bg-gray-500/15 dark:text-gray-300",
  VIEW: "bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
  DOWNLOAD:
    "bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
  OTHER: "bg-gray-100 text-gray-600 dark:bg-gray-500/15 dark:text-gray-300",
};

export interface AuditLog {
  idAuditLog: string;
  idAccount: string;
  userName: string;
  action: AuditAction;
  targetType: string;
  httpMethod: string;
  uri: string;
  ipAddress: string;
  success: boolean;
  detail: string;
  createdAt: string;
}

export interface AuditLogPage {
  content: AuditLog[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}
