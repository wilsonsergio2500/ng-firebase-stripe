import { Component, OnInit, OnDestroy } from '@angular/core';
import { IRegistrationForm } from './register.form';
import { FormTypeBuilder, NgTypeFormControl, NgTypeFormGroup } from 'reactive-forms-typed';
import { Store, Select, Actions, ofActionSuccessful } from '@ngxs/store';
import { Validators } from '@angular/forms';
import { AuthCreateUserwithEmailAndPasswordAction, AuthRegistrationErrorAction } from '@states/auth/auth.actions';
import { AuthState } from '@states/auth/auth.state';
import { Observable, Subscription, merge } from 'rxjs';
import { tap, delay } from 'rxjs/operators';

@Component({
    selector: 'register',
    templateUrl: 'register.component.html',
    styleUrls: [`register.component.scss`]
  })
  export class RegisterComponent implements OnInit, OnDestroy {

    formGroup: NgTypeFormGroup<IRegistrationForm>;
    @Select(AuthState.getErrorMessage) error$: Observable<string>;
    private subscriptions: Subscription[];

    @Select(AuthState.IsLoading) working$: Observable<boolean>;

    constructor(
        private formTypeBuilder: FormTypeBuilder,
        private store: Store,
        private actions: Actions
    ) {
    }

    ngOnInit() {

        this.formGroup = this.formTypeBuilder.group<IRegistrationForm>({
            username: [null, [Validators.required, Validators.email]],
            password: [null, [Validators.required, Validators.minLength(6)]],
            confirmPassword: [null, [
                (c: NgTypeFormControl<string, IRegistrationForm>) => {
                    if (c && c.parent && (c.parent.value as IRegistrationForm).password === c.value) {
                        return null;
                    }
                    return { notMatch: true };
                }
            ]]
        });

        this.formGroup.setFormErrors({
            username: {
                required: 'Username is required',
                email: 'Username must be a valid email'
            },
            password: {
                required: 'Password is required',
                minlength: 'Password is invalid'
            },
            confirmPassword: {
                notMatch: 'Password must match'
            }
        });

        const onPasswordChange$ = this.formGroup.controls.password.valueChanges.pipe(
            delay(1),
            tap(_ => {
                this.formGroup.controls.confirmPassword.updateValueAndValidity();
            })
        ).subscribe();

        const finalized$ = merge(this.actions.pipe(ofActionSuccessful(AuthRegistrationErrorAction)), this.actions.pipe(ofActionSuccessful(AuthCreateUserwithEmailAndPasswordAction))).pipe(
            tap(() => this.formGroup.reset())
        ).subscribe();
        
        this.subscriptions = [onPasswordChange$, finalized$];

    }

    Submit() {

        const { username : email, password } = this.formGroup.value;
        this.store.dispatch(new AuthCreateUserwithEmailAndPasswordAction({ email, password }));

    }

    ngOnDestroy() {
        if (this.subscriptions) {
            this.subscriptions.forEach(g => g.unsubscribe());
        }
    }
  
  } 
