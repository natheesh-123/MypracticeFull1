import { createAction, props } from "@ngrx/store";

export interface SaveUserDataPayload {
    id: number;
    name: string;
    email: string;
    password: string;
    role: string;
    permissions: string[];
    profilepicture: string;
    createdat: string;
  }
  
  export const saveUserData = createAction(
    '[UserData] Save User Data',
    props<SaveUserDataPayload>() 
  );

