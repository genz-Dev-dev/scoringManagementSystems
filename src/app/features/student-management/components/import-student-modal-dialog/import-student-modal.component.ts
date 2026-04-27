import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {DepartmentService} from '../../../../core/services/department/department.service';
import {Class} from '../../../../models/class.model';

type ImportStudent = {
  classId: string;
  file: any;
}

@Component({
  selector: 'app-import-student-modal',
  templateUrl: './import-student-modal.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ImportStudentModalComponent implements OnInit{

  @Output() cancel = new EventEmitter<boolean>();
  @Output() importStudent = new EventEmitter<ImportStudent>();
  form: FormGroup;
  classList: Array<Class> = [];

  constructor(private fb: FormBuilder, private classService: DepartmentService) {
    this.handleInitFromBuilder();
  }

  ngOnInit(): void {
    this.handleLoadClass();
  }

  private handleLoadClass() {
    this.classService.getAllClass()
      .subscribe((res) => {
        if(res) {
          this.classList = res.content;
          console.log(this.classList);
        }
      });
  }

  private handleInitFromBuilder() {
    this.form = this.fb.group({
      classId: ["", [Validators.required]],
      file: [null, [Validators.required]],
    })
  }

  public onFileChange(event: any) {
    const file = event.target?.files[0];
    if(file) {
      this.form.patchValue({
        file: file,
      })
    }
  }

  public handleSendData() {
    this.importStudent.emit({
      classId: this.form.get("classId").value,
      file: this.form.get("file").value,
    });
  }

  public handleCloseMadalDialog() {
    this.cancel.emit(false);
  }
}
