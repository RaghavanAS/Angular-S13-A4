import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CityService } from '../Services/City-Service';


@Injectable()
export class CityListResolveService implements Resolve<any> {

  constructor(private _cityService: CityService) { }
// invike the cityService before all
  resolve(route: ActivatedRouteSnapshot) {
      console.log('resolve city list initiated');
    return this._cityService.getCityList();
  }
}
