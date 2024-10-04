import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Menu, MenuItems } from '../../../shared/menu-items/menu-items';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { IEmployee } from 'src/app/models/employee.model';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducer';
import { selectGetOneEmployee } from 'src/app/store/employee/selectors';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [DemoMaterialModule, NgFor, NgIf, RouterModule, CommonModule, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class AppSidebarComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;
  userRole: string | null = '';
  userName: string | null = '';
  employee$: Observable<IEmployee | null>;
  menuItems: Menu[] = [];

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public menuList: MenuItems,
    private store: Store<AppState>
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.userRole = sessionStorage.getItem('loggedUserRole');
    this.userName = sessionStorage.getItem('loggedUserName');
    this.menuItems = this.filterMenuItems();

    this.employee$ = this.store.select(selectGetOneEmployee);
  }

  ngOnInit(): void { }

  filterMenuItems() {
    const filterMenus = this.menuList.getMenuitem().filter((item: Menu) => {
      return item.role === this.userRole
    });
    return filterMenus;
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
