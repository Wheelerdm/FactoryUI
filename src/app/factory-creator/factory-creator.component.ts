import { Component, OnInit, EventEmitter,Output, Input } from '@angular/core';
import { Factory } from '../factory';
import { FactoryService } from '../factory.service';


@Component({
  selector: 'factory-creator',
  templateUrl: './factory-creator.component.html',
  styleUrls: ['./factory-creator.component.css']
})
export class FactoryCreatorComponent implements OnInit {
  @Output() closed: EventEmitter<any> = new EventEmitter();
  @Output() saved: EventEmitter<Factory> = new EventEmitter();
  @Input() factory:Factory;
  
  public childrenCount:number;
  public validationFails:boolean;

  constructor(private factoryService: FactoryService) { }
  
 
  ngOnInit() {
    this.validationFails = false;
  }
  onHide(){

    this.closed.emit();
  }
  inputValid():Boolean{
    if(this.factory.upperBound < this.factory.lowerBound)
    { 
      this.validationFails = true;
      console.log(this.validationFails);
      return false;
    }
    else if (this.factory.name == "" || isNaN(this.factory.upperBound) || isNaN(this.factory.lowerBound))
    {
      this.validationFails = true;
      return false;
    }
    else
    {
      this.validationFails = false;
      return true;
    }
  }
 
  onSave()
  {

    //enforce validation
    this.validationFails = !this.inputValid();
    if(this.validationFails){
      return;
    }

    this.factory.children = [];
    for (let i = 0; i < this.childrenCount; i++) {
      this.createChild();
    }

    this.factoryService
    .addFactory(this.factory)
    .subscribe(factory => {
      this.factory.id = factory.id;
      this.saved.emit(this.factory)
      this.onHide();  
    }
    );
    
    console.log(this.factory);
    
  }

  private createChild() {
    let child = new Factory();
    child.name = this.factoryService.generateChildName(this.factory.lowerBound, this.factory.upperBound);
    child.parentID = this.factory.id;
    child.children = [];
    this.factory.children.push(child);
  }


}
