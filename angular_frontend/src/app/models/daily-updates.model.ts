interface IEmp {
  _id: string,
  name: string
}

export interface IAddDailyUpdatePayload {
  emp: [],
  work: string,
  project_type?: string,
  project?: string,
  skill_title?: string,
  hours: number,
  update_content: string
}

export interface IDailyUpdate {
  _id: string,
  emp: IEmp,
  work: string,
  skill_title?: string,
  project_type?: string,
  project?: [],
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
