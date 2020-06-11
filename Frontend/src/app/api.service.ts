import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule} from '@angular/common/http'; 

const httpOptions = {
  headers: new HttpHeaders({ 
    'Access-Control-Allow-Origin':'*'
   
  })
};

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  //private _postsURL = "https://5edf5eb29ed06d001696d120.mockapi.io/cos301/vehicles";

  constructor(private http:HttpClient) { }

  search(numberPlate){
    return this.http.get("https://5edf5eb29ed06d001696d120.mockapi.io/cos301/vehicles?filter="+numberPlate+"");
  //  return [{numplate:"123ABC", color:"red", make:"Toyota"},{numplate:"hello", color:"blue", make:"Kia"}];
  

   }


   Dsearch(numberplate, color, make, model, flag){
    return this.http.post("http://127.0.0.1:8000/api/v1/vehicle/search_and/", {
      filters:{
        "license_plate": numberplate,
        "color": color,
        "make": make,
        "model": model,
        "saps_flagged": flag
      }
    });
  
   }
}
