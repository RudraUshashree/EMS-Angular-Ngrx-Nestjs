export interface ILeaveAddPayload {
  leaves: number;
  leaves_type?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  reason?: string | null;
  duration?: string;
}

export interface ILeaveAddResponse {
  message: string,
  balanced_leaves: number;
  leave: ILeave
}

interface IEmployeeNameAndId {
  _id: string;
  name: string;
}

export interface IAssociatedData {
  keys?: string[],
  values?: number[]
}

export interface ILeavesResponse {
  balanced_leaves: number;
  leaves : ILeave[]
}

export interface ILeaveDeleteResponse {
  message: string;
  balanced_leaves: number,
  leaveId : string;
}

export interface ILeave {
  _id: string;
  emp: string | IEmployeeNameAndId;
  leaves: number,
  leave_status: string,
  duration: string | null,
  leaves_type: string,
  reason: string,
  start_date: string,
  end_date: string,
  createdAt?: string,
  updatedAt?: string,
  __v?: number
}

export interface IUpdateEmployeeLeaveStatusPayload {
  empId: string,
  noOfLeaves: string;
  leave_status: string;
}

export interface IUpdateEmployeeLeaveStatusResponse {
  message: string;
  leave: ILeave;
}
