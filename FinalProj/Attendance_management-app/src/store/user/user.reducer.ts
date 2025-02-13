import { createReducer, on } from "@ngrx/store";
import { initialStateUserData } from "./user.state";
import { saveUserData } from "./user.actions";

export const userReducer = createReducer(
    initialStateUserData,
    on(saveUserData, (state, {id,name,email,password,role,permissions,profilepicture,createdat}) => ({
        id,
        name,
        email,
        password,
        role,
        permissions,
        profilepicture,
        createdat
    }))
)