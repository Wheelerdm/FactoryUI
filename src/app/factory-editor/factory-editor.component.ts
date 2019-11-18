import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Factory } from '../factory';
import { FactoryService } from '../factory.service';


@Component({
  selector: 'factory-editor',
  templateUrl: './factory-editor.component.html',
  styleUrls: ['./factory-editor.component.css']
})
export class FactoryEditorComponent implements OnInit {
 
  @Input() factory:Factory;
  @Output() closed: EventEmitter<any> = new EventEmitter();
  @Output() deleted: EventEmitter<any> = new EventEmitter();
  
  public childrenCount:number;
  public status:string;
  submitMessage = "Attempting Save!"
  public name:string; 
  public childrenToGenerate:string;
  public originalchildrenCount:number;
  public originalUpperBound:number;
  public originalLowerBound:number;
  public validationFails:boolean;

  constructor(private factoryService: FactoryService) {
  }
  ngOnChanges()
  {
    if(this.factory == null)
    {
      return;
    }

    if( this.factory.children == null)
      this.childrenCount = 0;
    else
      this.childrenCount = this.factory.children.length;

    this.originalchildrenCount = this.childrenCount;
    this.originalUpperBound = this.factory.upperBound;
    this.originalLowerBound = this.factory.lowerBound;
  }

  ngOnInit() {

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
  onSubmit(){

    this.validationFails = !this.inputValid();
    if(this.validationFails){
      return;
    }

    this.status="Saving...";

    if(this.factory.children.length == this.childrenCount)
    {
      this.factoryService.updateFactory(this.factory)
      .subscribe(factory => this.status = this.factory.name + " saved successfully");
    }
    else //regenerate children
    {
    this.factoryService.updateFactory(this.factory)
      .subscribe(factory =>{

        if(this.regenerateChildren()) //e.g. upperBound, lowerBound or child count changed
        {
          //Delete old children
          for (let i = 0; i < this.originalchildrenCount; i++) {
            this.factoryService.deleteFactory(this.factory.children[i].id).subscribe();
          }
          this.factory.children=[];

          //Generate new children
          let allDoneCount:number =0;
          
          for (let i = 0; i < this.childrenCount; i++) {
            this.createChild();
            console.log(this.factory)
            this.factoryService.addFactory(this.factory.children[i])
              .subscribe(c=> {
                  this.factory.children[i].id = c.id;
                  this.status = "Saved name: " + c.name;
                  
                  if(allDoneCount=this.childrenCount){
                    this.status = this.factory.name + " save completed";
                  }

                  allDoneCount++;
                });
              }
              
          this.originalchildrenCount = this.factory.children.length;
        }
        else{
          this.status = 'save completed';
        }
          
      });
    }
  
  }
  private regenerateChildren() {
    let regenerate: boolean = false;

    if(this.originalchildrenCount != this.childrenCount)
    {
      regenerate = true;
    }
    if(this.originalLowerBound != this.factory.lowerBound)
    {
      regenerate = true;
    }
    if(this.originalUpperBound != this.factory.upperBound)
    {
      regenerate = true;
    }

    return regenerate ;
  }

  private createChild() {
    let child = new Factory();
    child.name = this.factoryService.generateChildName(this.factory.lowerBound, this.factory.upperBound);
    child.parentID = this.factory.id;
    child.children = [];
    this.factory.children.push(child);
  }
  onDelete(){
    this.factoryService.deleteFactory(this.factory.id)
    .subscribe(factory => {
      this.deleted.emit(factory)
    }
      );
  }
   
  onClose()
  {
    this.closed.emit();
  }
  //todo: Refactor to Factory.ts or service layer
  regenerate()
  {
    
    this.factory.children.forEach(child => {
        this.factoryService.deleteFactory(this.factory.id)
      .subscribe()
    }
    );
    
    this.factory.children=[];
  }

 

}
