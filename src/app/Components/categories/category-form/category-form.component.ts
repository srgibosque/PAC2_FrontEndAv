import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryDTO } from 'src/app/Models/category.dto';
import { CategoryService } from 'src/app/Services/category.service';
import { SharedService } from 'src/app/Services/shared.service';
import { catchError, finalize, map, take, throwError } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss'],
})
export class CategoryFormComponent implements OnInit {
  category: CategoryDTO;
  title: UntypedFormControl;
  description: UntypedFormControl;
  css_color: UntypedFormControl;

  categoryForm: UntypedFormGroup;
  isValidForm: boolean | null;

  private isUpdateMode: boolean;
  private validRequest: boolean;
  private categoryId: string | null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private categoryService: CategoryService,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private sharedService: SharedService,
    private store: Store<AppState>
  ) {
    this.isValidForm = null;
    this.categoryId = this.activatedRoute.snapshot.paramMap.get('id');
    this.category = new CategoryDTO('', '', '');
    this.isUpdateMode = false;
    this.validRequest = false;

    this.title = new UntypedFormControl(this.category.title, [
      Validators.required,
      Validators.maxLength(55),
    ]);

    this.description = new UntypedFormControl(this.category.description, [
      Validators.required,
      Validators.maxLength(255),
    ]);

    this.css_color = new UntypedFormControl(this.category.css_color, [
      Validators.required,
      Validators.maxLength(7),
    ]);

    this.categoryForm = this.formBuilder.group({
      title: this.title,
      description: this.description,
      css_color: this.css_color,
    });
  }

  ngOnInit(): void {
    let errorResponse: any;

    // update
    if (this.categoryId) {
      this.isUpdateMode = true;
      this.categoryService.getCategoryById(this.categoryId)
      .subscribe(
        (category) => {
          this.category = category;

          this.title.setValue(this.category.title);
          this.description.setValue(this.category.description);
          this.css_color.setValue(this.category.css_color);

          this.categoryForm = this.formBuilder.group({
            title: this.title,
            description: this.description,
            css_color: this.css_color,
          });
        },

        (error: any) => { 
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse);
        }

      )
      // try {
      //   this.category = await this.categoryService.getCategoryById(
      //     this.categoryId
      //   );

      //   this.title.setValue(this.category.title);

      //   this.description.setValue(this.category.description);

      //   this.css_color.setValue(this.category.css_color);

      //   this.categoryForm = this.formBuilder.group({
      //     title: this.title,
      //     description: this.description,
      //     css_color: this.css_color,
      //   });
      // } catch (error: any) {
      //   errorResponse = error.error;
      //   this.sharedService.errorLog(errorResponse);
      // }
    }
  }

  private editCategory(): void {
    let errorResponse: any;
    let responseOK: boolean = false;
    if (this.categoryId) {

      this.store.select('authApp').pipe(
        map((response) => response.credentials.user_id),
        take(1)
      ).subscribe((userId) => {
        if(userId){
          this.category.userId = userId;
          this.categoryService.updateCategory(this.categoryId!, this.category)
          .pipe(
            catchError((error: HttpErrorResponse) => {
              this.sharedService.errorLog(error.error);
              return throwError(error);
            }),
            finalize(async () => {
              await this.sharedService.managementToast(
                'categoryFeedback',
                responseOK,
                errorResponse
              );

              if (responseOK) {
                this.router.navigateByUrl('categories');
              }
            })
          )
          .subscribe(() => {
            responseOK = true;
          })
        }
      })
    }
  }

  private createCategory(): void {
    let errorResponse: any;
    let responseOK: boolean = false;
    this.store.select('authApp').pipe(
      map((response) => response.credentials.user_id),
      take(1)
    ).subscribe((userId) => {
      if(userId){
        this.category.userId = userId;
        this.categoryService.createCategory(this.category)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            this.sharedService.errorLog(error.error);
            return throwError(error);
          }),
          finalize(async () => {
            await this.sharedService.managementToast(
              'categoryFeedback',
              responseOK,
              errorResponse
            );

            if (responseOK) {
              this.router.navigateByUrl('categories');
            }
          })
        )
        .subscribe(() => {
          responseOK = true;
        })
      }
    })
  }

  saveCategory() {
    this.isValidForm = false;

    if (this.categoryForm.invalid) {
      return;
    }

    this.isValidForm = true;
    this.category = this.categoryForm.value;

    if (this.isUpdateMode) {
      this.editCategory();
    } else {
      this.createCategory();
    }
  }
}
