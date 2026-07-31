import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../services/api";


interface User {

  _id:string;

  username:string;

  email:string;

  phoneNumber?:string;

  role?:string;

  status?:string;

}



interface AuthState {

  user:User | null;

  token:string | null;

  isLoggedIn:boolean;

  loading:boolean;

  error:string | null;

}



const initialState:AuthState = {


  user:
  JSON.parse(
    localStorage.getItem("user") || "null"
  ),


  token:
  localStorage.getItem("token"),


  isLoggedIn:
  !!localStorage.getItem("token"),


  loading:false,


  error:null,


};







// Login API

export const loginUser = createAsyncThunk(


"auth/login",


async(

credentials:{
email:string;
password:string;
},


{rejectWithValue}


)=>{


try{


const response =
await api.post(

"/auth/login",

credentials

);



const {

token,

user

}=response.data;




localStorage.setItem(

"token",

token

);



localStorage.setItem(

"user",

JSON.stringify(user)

);





return {

token,

user

};



}

catch(error:any){


return rejectWithValue(

error.response?.data?.message ||

"Login failed"

);


}



}


);







const authSlice = createSlice({


name:"auth",


initialState,



reducers:{



logout:(state)=>{


state.user=null;

state.token=null;

state.isLoggedIn=false;


localStorage.removeItem(
"token"
);


localStorage.removeItem(
"user"
);



},



},





extraReducers:(builder)=>{


builder


.addCase(

loginUser.pending,

(state)=>{


state.loading=true;

state.error=null;


}


)



.addCase(

loginUser.fulfilled,

(state,action)=>{


state.loading=false;



state.token =
action.payload.token;



state.user =
action.payload.user;



state.isLoggedIn=true;



}



)



.addCase(

loginUser.rejected,

(state,action)=>{


state.loading=false;


state.error =
action.payload as string;


}


);



}



});






export const {
logout

}=authSlice.actions;


export default authSlice.reducer;