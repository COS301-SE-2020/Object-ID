import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public form: FormGroup;
  public Dform: FormGroup;
  
  
   answer:any=null;
   answer2:any=null;
   temporary:any=[];
  constructor(private api:ApiService, private fb:FormBuilder) { 
    this.form = this.fb.group({
      numPlate:[null, {
        validators:[
          Validators.required
        ]
      }]
    });

    this.Dform = this.fb.group({
      numplate:[null, {
        validators:[]
      }],
      color:[null, {
        validators:[]
      }],
      make:[null, {
        validators:[]
      }],
      model:[null, {
        validators:[]
      }],
      flag:[null, {
        validators:[]
      }]
    });
  }

  ngOnInit(): void {
   
  }

  search(){
    // console.log(this.form.value.numPlate);
    this.api.search(this.form.value.numPlate).subscribe((data)=>{
      this.answer=data;
      console.log(this.answer);
    });
   
  }

  Dsearch(){
    console.log(this.Dform.value.numplate, this.Dform.value.color, this.Dform.value.make, this.Dform.value.model, this.Dform.value.flag);
    this.api.Dsearch(this.Dform.value.numplate, this.Dform.value.color, this.Dform.value.make, this.Dform.value.model, this.Dform.value.flag).subscribe((data2)=>{
      this.answer2=[data2];
      console.log(this.answer2);
    });
  }

}
