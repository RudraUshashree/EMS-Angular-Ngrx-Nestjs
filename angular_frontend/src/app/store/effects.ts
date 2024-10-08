import { AuthEffects } from "./auth/effects";
import { EmployeeEffects } from "./employee/effects";
import { LeaveEffects } from "./leaves/effects";
import { ProjectEffects } from "./project/effects";

export const allEffects = [
  AuthEffects,
  EmployeeEffects,
  LeaveEffects,
  ProjectEffects
]
