import { Component, OnDestroy, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { Actions, ofActionSuccessful, Select, Store } from '@ngxs/store';
import { FormTypeBuilder, NgTypeFormGroup } from 'reactive-forms-typed';
import { AuthLoginFailAction, AuthLoginWithEmailAndPasswordAction } from '@states/auth/auth.actions';
import { ILoginForm } from './login.form';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthState } from '@states/auth/auth.state';

@Component({
    selector: 'login',
    templateUrl: 'login.component.html',
    styleUrls: [`login.component.scss`]
  })
  export class LoginComponent implements OnInit, OnDestroy {

  @Select(AuthState.IsLoading) working$: Observable<boolean>;
  formGroup: NgTypeFormGroup<ILoginForm>;
  hasError: boolean = false;
  private subscription: Subscription[] = [];

  constructor(
    private store: Store,
    private actions: Actions,
    private formTypeBuilder: FormTypeBuilder
  ) { }
    
    ngOnInit(){
      
      this.formGroup = this.formTypeBuilder.group<ILoginForm>({
        username: [null, [Validators.required, Validators.email]],
        password: [null, [Validators.required, Validators.minLength(4)]]
      });

      this.formGroup.setFormErrors({
        username:{
          required: 'Email is required'
        },
        password:{
          required: 'Password is required',
        minlength: 'Password is invalid'
        }
      });

      const onFailAuth$ = this.actions.pipe(
        ofActionSuccessful(AuthLoginFailAction),
        tap(() => {
          this.hasError = true;
          this.formGroup.reset();
        })
      )

      this.subscription = [...this.subscription, onFailAuth$.subscribe()];

    }

  submit() {
    const { username : email, password} = this.formGroup.value;
    if (this.formGroup.valid) {
      this.store.dispatch(new AuthLoginWithEmailAndPasswordAction({ email, password }));
    }
  }

  ngOnDestroy() {
    if (this.subscription.length) {
      this.subscription.forEach(s => s.unsubscribe());
    }
  }
  
  } 
