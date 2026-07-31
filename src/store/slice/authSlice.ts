import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import { api } from "../../services/api";


// ================= USER TYPE =================

interface User {

  _id: string;

  username: string;

  email: string;

  phoneNumber: string;

  role?: string;

  status?: string;

}


// ================= AUTH STATE =================

interface AuthState {

  user: User | null;

  token: string | null;

  isLoggedIn: boolean;

  loading: boolean;

  error: string | null;

}


// ================= LOAD SAVED USER =================

const savedToken =
  localStorage.getItem("token");


const savedUser =
  localStorage.getItem("user");


let userData: User | null = null;


try {

  userData = savedUser
    ? JSON.parse(savedUser)
    : null;


}

catch(error){

  console.error(
    "User parse error:",
    error
  );


  localStorage.removeItem("user");

  userData = null;

}



// ================= INITIAL STATE =================


const initialState: AuthState = {


  user:userData,


  token:savedToken,


  isLoggedIn:
    !!savedToken,


  loading:false,


  error:null,


};




// ================= REGISTER =================


export const registerUser =
createAsyncThunk(


"auth/register",


async(


data:{
 username:string;
 phoneNumber:string;
 email:string;
 password:string;
},


{
 rejectWithValue

}


)=>{


try{


const response =
await api.post(

"/auth/register",

data

);



return response.data;



}

catch(error:any){


console.error(

"Register Error:",

error.response?.data

);



return rejectWithValue(

error.response?.data?.message ||

"Registration failed"

);


}


}

);






// ================= LOGIN =================


export const loginUser =
createAsyncThunk(


"auth/login",


async(


credentials:{


email:string;


password:string;


},


{

rejectWithValue

}


)=>{


try{


console.log(
"========== LOGIN START =========="
);



console.log(

"Email:",

credentials.email

);



const response =
await api.post(

"/auth/login",

credentials

);



console.log(

"Backend Response:",

response.data

);



const {

token,

user

}=response.data;



// =======================
// CHECK TOKEN
// =======================


if(!token){


console.error(

"Token missing from backend"

);



return rejectWithValue(

"Token not received"

);


}



// =======================
// SAVE TOKEN
// =======================


localStorage.setItem(

"token",

token

);



// =======================
// SAVE USER
// =======================


localStorage.setItem(

"user",

JSON.stringify(user)

);



console.log(

"Saved Token:",

localStorage.getItem("token")

);



console.log(

"Saved User:",

localStorage.getItem("user")

);





return {


token,

user


};



}

catch(error:any){



console.error(

"Login Error:",

error.response?.data ||

error.message

);



return rejectWithValue(

error.response?.data?.message ||

"Login failed"

);


}


}

);







// ================= AUTH SLICE =================


const authSlice =
createSlice({


name:"auth",


initialState,



reducers:{



// ================= LOGOUT =================


logout:(state)=>{


console.log(

"Logout clicked"

);



state.user=null;


state.token=null;


state.isLoggedIn=false;


state.loading=false;


state.error=null;




localStorage.removeItem(

"token"

);



localStorage.removeItem(

"user"

);



console.log(

"Local storage cleared"

);



},



},




extraReducers:(builder)=>{



builder



// ================= REGISTER =================


.addCase(

registerUser.pending,

(state)=>{


state.loading=true;

state.error=null;


}

)



.addCase(

registerUser.fulfilled,

(state)=>{


state.loading=false;

state.error=null;


}

)



.addCase(

registerUser.rejected,

(state,action)=>{


state.loading=false;


state.error =
action.payload as string;


}

)






// ================= LOGIN =================


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



state.error=null;


}

)




.addCase(

loginUser.rejected,

(state,action)=>{


state.loading=false;


state.token=null;


state.user=null;


state.isLoggedIn=false;


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