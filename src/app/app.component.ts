import { Component, OnInit } from '@angular/core';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from './app.service';

interface ITodo {
  name?: string;
  description?: string;
  comments?: string[];
  editable: boolean;
  hypi?: {
    id?: string;
    appName?: string;
    created?: string;
    updated?: string;
    modelTypeName?: string;
    releaseName?: string;
    pagingToken?: string;
    read?: Date;
  };
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ],
  animations: [
    trigger('moveInLeft', [
      transition('void=> *', [ style({transform: 'translateX(300px)'}),
        animate('200ms ease-out', keyframes([
          style({transform: 'translateX(300px)'}),
          style({transform: 'translateX(0)'})

        ])) ]),
      transition('*=>void', [ style({transform: 'translateX(0px)'}),
        animate('250ms ease-in', keyframes([
          style({transform: 'translateY(-20px)', opacity: 1, offset: 0.2}),
          style({transform: 'translateY(250px)', opacity: 0, offset: 1})

        ])) ])

    ])
  ]
})
export class AppComponent implements OnInit {
  todoArray: ITodo[] = [];

  public form: FormGroup;

  constructor(private fb: FormBuilder, private appService: AppService) {
  }

  ngOnInit(): void {
    this.constructForm();
    this.appService.findTodos().subscribe(
      result => {
        console.log(result);
      }, (err) => console.log(err));
  }


  constructForm() {
    this.form = this.fb.group({
      todo: this.fb.control(null, Validators.required),
      description: this.fb.control(null, Validators.required)
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    const newTodo: ITodo = {
      name: this.form.get('todo').value,
      editable: false,
      description: this.form.get('description').value,
    };
    this.todoArray.push(newTodo);
    this.form.reset();
  }

  onDeleteItem(index) {
    this.todoArray.splice(index, 1);
  }


  onEdit(todo: ITodo, i: number) {
    todo.editable = true;
    console.log(todo, i);
  }

  onSave(todo: ITodo, value?: string, i?: number) {
    todo.editable = false;
    todo.description = value;
    // this.todoArray.find()
    console.log(todo);
  }
}
