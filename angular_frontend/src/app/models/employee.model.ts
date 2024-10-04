export interface IAddEmployeePayload {
  name: string;
  email: string;
  password: string;
  dob: string;
  contact: string;
  address: string;
  city: string;
  zipcode: string;
  experience: number;
  worked_technologies: string[];
  salary: number;
  emp_type: string;
  work_type: string;
  doj: string;
  image: string
}

export interface IEmployee {
    _id: string;
    role: string;
    name: string;
    email: string;
    dob: string;
    assigned_leaves: number;
    balanced_leaves: number;
    contact: string;
    address: string;
    city: string;
    zipcode: string;
    experience: number;
    worked_technologies: string;
    salary: number;
    emp_type: string;
    work_type: string;
    doj: string;
    status: string;
    image: string;
    createdAt: string;
    updatedAt: string;
    token: string;
    photoUrl: string;
}

export interface IUpdateEmployeePayload {
  name?: string;
  email?: string;
  dob?: string;
  contact?: string;
  address?: string;
  city?: string;
  zipcode?: string;
  experience?: number;
  worked_technologies?: string[];
  salary?: number;
  emp_type?: string;
  work_type?: string;
  doj?: string;
  image?: string;
  status?: string;
}

export interface IUpdateEmployeeResponse {
  message: string;
  employee: IEmployee;
}
