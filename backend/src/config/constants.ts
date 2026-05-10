export const USER_ROLES = ["Requester", "Validator"] as const;
export const REQUEST_STATUSES = ["Pending", "Approved", "Rejected"] as const;

export type UserRole = (typeof USER_ROLES)[number];
export type RequestStatus = (typeof REQUEST_STATUSES)[number];
