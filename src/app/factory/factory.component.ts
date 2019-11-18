import { Component, OnInit,Input, EventEmitter, Output } from '@angular/core';
import { Factory } from '../factory';

@Component({
  selector: 'factory',
  templateUrl: './factory.component.html',
  styleUrls: ['./factory.component.css']
})
export class FactoryComponent implements OnInit {
  
  @Input() factory:Factory;
  @Input() level:number;
  @Output () deleteRequested = new EventEmitter();
  @Output () selected = new EventEmitter();
  @Output () createRequested = new EventEmitter();

  public isSelected: Boolean = false;
  public isExpanded: Boolean = true;
  public isRoot:boolean = false;
  public hasChildren = false;
  
  constructor() {
    this.isSelected = false;
   }

   addFactory()
   {
      this.createRequested.emit();
   }
  ngOnInit() {
    this.level++;
    if(this.factory.parentID == - 1)
      this.isRoot = true;
    else
      this.isRoot = false;

    if (this.factory.children.length > 0)
      this.hasChildren = true;      
    else
      this.hasChildren = false;
  }

  expandToggled()
  {
    this.isExpanded = !(this.isExpanded);
  }
  deleteChild(factory)
  {
    
    let i =this.factory.children.findIndex(f => f === factory);
    
    if (i>=0){
      this.factory.children.splice(i,1);
    }
  }

  deleteClicked(){
    this.deleteRequested.emit(this.factory); 
  }
  select(){
    this.selected.emit(this.factory);
    this.isSelected = true;
  }
  childSelection(f):void{

    this.selected.emit(f);
  
  }

}
