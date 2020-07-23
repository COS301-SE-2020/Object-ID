import { Injectable } from '@angular/core';
import { CanActivate,
         ActivatedRouteSnapshot,
         RouterStateSnapshot, 
         Router} from '@angular/router';

import { ApiService } from './api.service';
@Injectable()
export class CanActivateRouteGuard implements CanActivate {
  constructor(private auth: ApiService,private router: Router) {

  }
public canActivate(route : ActivatedRouteSnapshot , state : RouterStateSnapshot){

  if(!this.auth.isLoggedIn()) {
          this.router.navigate(['']); // choose either default route like here
          return false;
      }
  return true;
}
}