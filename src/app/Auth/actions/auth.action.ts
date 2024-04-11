import { createAction, props } from "@ngrx/store";

export const login = createAction(
  '[AUTH] Login',
  props<{email: string, password: string}>()
)

export const loginSuccess = createAction(
  '[AUTH] LoginSuccess',
  props<{user_id: string , access_token: string}>()
)

export const logout = createAction(
  '[AUTH] Logout'
)