import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DbservicesService {

  baseURL:string="https://localhost:7200/api";

  constructor(private http : HttpClient) { }

  postRecord(tableName:any, val:any){
    return this.http.post(`${this.baseURL}/${tableName}`, val);
  }
  getRecord(tableName:any){
    return this.http.get(`${this.baseURL}/${tableName}`);
  }
  deleteRecord(tableName:any){
    return this.http.delete(`${this.baseURL}/${tableName}`);
  }
  updateRecord(tableName:any, val:any){
    return this.http.put(`${this.baseURL}/${tableName}`, val);
  }

}
