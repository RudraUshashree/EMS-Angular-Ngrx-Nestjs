import { IEmp } from "./employee.model";

export interface IAddDailyUpdatePayload {
  emp: [],
  work: string,
  project_type?: string,
  project?: string,
  skill_title?: string,
  hours: number,
  update_content: string
}

export interface Project {
  _id: string,
  title: string,
  emp: {
    _id: string,
    name: string,
  }
}

export interface IDailyUpdate {
  _id: string,
  emp: IEmp,
  work: string,
  skill_title?: string,
  project_type?: string,
  project?: Project[],
  hours: number,
  update_content: string,
  createdAt?: string,
  updatedAt?: string,
  __v?: number
}

export interface IDailyUpdatesResponse {
  message: string,
  dailyUpdate: IDailyUpdate;
}

export interface IUpdateDailyUpdatePayload {
  work?: string,
  skill_title?: string,
  project_type?: string,
  project?: string,
  hours?: number,
  update_content?: string
}
