import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule} from '@angular/common/http'; 

//add token to header


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http:HttpClient) { }

  //login
  submitLogin(username, password){
    return this.http.post("http://127.0.0.1:8000/api-auth/", {
      "username": username,
      "password": password
    });
  }

  setToken(token){
    localStorage.setItem("token",token[0].token);
  }
  removeToken(){
    localStorage.removeItem("token");
  }

  getToken(){
    return localStorage.getItem("token");
  }

  isLoggedIn(){
    if(this.getToken() === null){
      return false;
    }
    return true;
  }

  //searches  
  search(numberPlate){
     const httpOptions = {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Authorization': "Token " + this.getToken()
      })
    };
    return this.http.post("http://127.0.0.1:8000/api/v1/vehicle/search", {
      "search": numberPlate
    },httpOptions );
  
  

   }


   Dsearch(numberplate, color, make, model, flag){

    const httpOptions = {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Authorization': "Token " + this.getToken()
      })
    };
    
    return this.http.post("http://127.0.0.1:8000/api/v1/vehicle/search_advanced", {
    "type": "and",
    "filters":{
        "license_plate": numberplate,
        "color": color,
        "make": make,
        "model": model,
        "saps_flagged": flag
      }
    },httpOptions );
  
   }

   filterFlagged(filter){

    const httpOptions = {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Authorization': "Token " + this.getToken()
      })
    };

    return this.http.get("http://127.0.0.1:8000/api/v1/vehicle/get_saps_flagged",
    httpOptions );

   }
}
