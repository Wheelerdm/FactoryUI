import * as signalR from '@aspnet/signalr';
import { Component, OnInit } from '@angular/core';
import { Factory } from '../factory';
import {FactoryService} from '../factory.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'factories',
  templateUrl: './factories.component.html',
  styleUrls: ['./factories.component.css']
})

export class FactoriesComponent implements OnInit {

  private notificationUrl = environment.notificationUrl;  // URL to web api

  closeResult: string;

  rootFactory: Factory;
  newFactory: Factory;
  selectedFactory: Factory;
  showFactoryCreator: boolean;
  showFactoryEditor: boolean;

  name:string;
  children:number;
  
  //showFactoryCreator: Factory;
  constructor(private factoryService: FactoryService ) { }

  ngOnInit() {
    this.getRootFactory();
    this.showFactoryCreator = false;
    this.showFactoryEditor = false;

    const connection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Debug)
      .withUrl(this.notificationUrl,
        {skipNegotiation: true,                           //removing these two lines would allow long polling as a backup  
        transport: signalR.HttpTransportType.WebSockets}  //for older browsers
      )
      .build();
    
      connection.start().then(
        function()
        {
          console.log("connected");
        }
        ).catch(function (err){
            return console.error(err.toString());
        });

        connection.on("BroadcastMessage",(type: String, factory:Factory)=>{
          console.log(type);
          console.log(factory);
          
          switch (type){
            case 'create' : {
                this.addCreatedFactory(factory);
                break
            }
            case 'update' : {
                this.updateFactory(factory);
                break
            }
            case 'delete' : {
                this.removeDeletedFactory(factory);
                break
          }
            default : {
                console.log("not type case found for notification");
                break
            }
        }
          console.log("broadcast received");
        });
      
  }

  updateFactory(factory:Factory)
  {
    let i =this.rootFactory.children.findIndex(f => f.id == factory.id);

    if (i>=0)
    {
      this.rootFactory.children[i] = factory;
    }
  }
  
  removeDeletedFactory(factory:Factory):void
  {
    let i =this.rootFactory.children.findIndex(f => f.id == factory.id);

    let root = this.rootFactory;

    if (i>=0){
      root.children.splice(i,1);
    }
    else //search for a grandchild to remove
    {
      for(var ii = 0; ii <root.children.length;ii++)
      {
        if(root.children[ii].id == factory.parentID)
        {
          let k = root.children[ii].children.findIndex(child=> child.id == factory.id);
          if(k>=0)
          {
            root.children[ii].children.splice(k,1);
          }
        }
      }
    }
  }
  addCreatedFactory(factory:Factory)
  {
    let root = this.rootFactory
    
    //Nodes can be added to the Root(level 1) or to a Factory(level 2)
    if(factory.parentID == root.id) 
    {
      root.children.splice(root.children.length,0,factory);
    }
    else
    { 
      var i = root.children.findIndex(f => f.id == factory.parentID);
      if (i>=0)
      {
        root.children[i].children.splice(root.children[i].children.length,0,factory);
      }
    }                  
  }
  getRootFactory(): void {
    console.log("get Root Factory");
    this.factoryService.getRootFactory()
        .subscribe(factories => { this.rootFactory = factories;
        console.log(this.rootFactory);});
  }
  createFactory( )
  {
    this.newFactory = new Factory();
    this.newFactory.name="";

    this.newFactory.parentID = this.rootFactory.id;
    
    this.showFactoryEditor = false;
    this.showFactoryCreator = true;
 
  }

  selected(f):void{
    if(f.parentID != -1)  //Root node is not editable / deletable
      this.selectedFactory = f;

  }
  childSelection(f):void{
    console.log("child selection - factories");
    if(f.parentID != -1)  //Root node is not editable / deletable
    {
    this.selectedFactory = f;
    this.showFactoryCreator = false;
    this.showFactoryEditor = true;
    }
  }
  onEditorClosed(){
    this.showFactoryEditor = false;
    this.selectedFactory = null;
  }
  onCreatorClosed()
  {
    this.showFactoryCreator = false;
  }
  //TODO: Remove - No longer required w/ Notification Service Implementation
  // onNewFactory(f: Factory)
  // {
  //   this.rootFactory.children.splice(
  //     this.rootFactory.children.length,
  //     0,
  //     f);
 
  // }
  onFactoryDeleted()
  {
    //TODO: Remove - No longer required w/ Notification Service Implementation
    // let i =this.rootFactory.children.findIndex(f => f === this.selectedFactory);

    // if (i>=0){
    //   this.rootFactory.children.splice(i,1);
    // }
    this.showFactoryEditor = false;
    
  }


}
