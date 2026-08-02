import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import { api } from "../../services/api";



// ================= USER TYPE =================


export interface User {

  _id:string;

  username:string;

  email:string;

  phoneNumber:string;

  role?:string;

  status?:string;

}



// ================= STATE =================


interface AuthState {


  user:User|null;


  token:string|null;


  isLoggedIn:boolean;


  loading:boolean;


  error:string|null;


}



// ================= LOCAL STORAGE =================


const token =
localStorage.getItem("token");


const user =
localStorage.getItem("user");



const initialState:AuthState = {


user:user
?
JSON.parse(user)
:
null,


token,


isLoggedIn:
Boolean(token),


loading:false,


error:null,


};






// ================= REGISTER =================


export const registerUser =
createAsyncThunk(


"auth/register",


async(data:{


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



const response =
await api.post(

"/auth/login",

credentials

);




const {

token,

user

}=response.data;




if(!token){


return rejectWithValue(

"Token missing"

);


}




localStorage.setItem(

"token",

token

);



localStorage.setItem(

"user",

JSON.stringify(user)

);




// Axios header update


api.defaults.headers.common[

"Authorization"

]=

`Bearer ${token}`;




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










// ================= GET PROFILE =================


export const getCurrentUser =
createAsyncThunk(


"auth/profile",


async(_,{

rejectWithValue

})=>{


try{


const response =
await api.get(

"/auth/profile"

);



return response.data.user;



}

catch(error:any){


return rejectWithValue(

"User fetch failed"

);


}


}

);










// ================= SLICE =================



const authSlice =
createSlice({


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



delete api.defaults.headers.common[

"Authorization"

];



},




clearError:(state)=>{


state.error=null;


}



},





extraReducers:(builder)=>{


builder





// REGISTER


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








// LOGIN


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


state.user=null;


state.token=null;


state.isLoggedIn=false;


state.error =
action.payload as string;



}

)








// PROFILE


.addCase(

getCurrentUser.fulfilled,

(state,action)=>{


state.user =
action.payload;



localStorage.setItem(

"user",

JSON.stringify(action.payload)

);


}

);




}


});







export const {

logout,

clearError

}=authSlice.actions;



export default authSlice.reducer;