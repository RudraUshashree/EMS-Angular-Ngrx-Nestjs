import { Injectable } from '@angular/core';

export interface Menu {
  role: string;
  state: string;
  name: string;
  type: string;
  icon: string;
}

const MENUITEMS = [
  { role: 'admin', state: 'admin', name: 'Dashboard', type: 'link', icon: 'av_timer' },
  { role: 'admin', state: 'admin/manage-employees', name: 'Employees', type: 'link', icon: 'people' },
  { role: 'admin', state: 'admin/manage-leaves', name: 'Leaves Request', type: 'link', icon: 'view_list' },
  { role: 'admin', state: 'admin/manage-projects', name: 'Projects', type: 'link', icon: 'assessment' },
  { role: 'admin', state: 'admin/daily-updates', name: 'Daily Updates', type: 'link', icon: 'assignment' },
  { role: 'employee', state: 'employee', name: 'Dashboard', type: 'link', icon: 'av_timer' },
  { role: 'employee', state: 'employee/leaves', name: 'My Leaves', type: 'link', icon: 'view_list' },
  { role: 'employee', state: 'employee/manage-daily-updates', name: 'Daily Update', type: 'link', icon: 'assignment' },
];

@Injectable()
export class MenuItems {
  getMenuitem(): Menu[] {
    return MENUITEMS;
  }
}
