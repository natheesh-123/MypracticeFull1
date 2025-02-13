export interface UserState{
    id:number|null;
    name:string|null;
    email:string|null;
    password:string|null;
    role:string|null;
    permissions:string[]|null;
    profilepicture:string|null;
    createdat:string|null;
}

export const initialStateUserData:UserState = {
    id:null,
    name:null,
    email:null,
    password:null,
    role:null,
    permissions:[],
    profilepicture:null,
    createdat:null
}