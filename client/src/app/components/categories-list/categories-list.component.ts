import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.css']
})
export class CategoriesListComponent implements OnInit {
  public panelOpenState : boolean;
  public filter : string;

  constructor( ) { }

  ngOnInit(): void {
    this.filter = '';
    this.panelOpenState = false;
  }

  // link to all products component
  @Output ()
  childEvent = new EventEmitter<string>();
  
  public changeProductPipe(requestedFilter):void{
    // send the event to all products component
    this.childEvent.emit(requestedFilter);
    this.filter = requestedFilter
  }
}
