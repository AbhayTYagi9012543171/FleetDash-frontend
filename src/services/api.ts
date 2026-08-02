import axios from "axios";

import type {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";



// ======================================
// API BASE URL
// ======================================


const API_URL =
import.meta.env.VITE_API_URL ||
"http://localhost:5003/api";




// ======================================
// Axios Instance
// ======================================


export const api = axios.create({

baseURL: API_URL,


headers:{

"Content-Type":"application/json",

},


withCredentials:false,


timeout:15000,


});





// ======================================
// Logout Helper
// ======================================


const logoutUser =()=>{


localStorage.removeItem(
"token"
);


localStorage.removeItem(
"user"
);


delete api.defaults.headers.common[
"Authorization"
];



};







// ======================================
// REQUEST INTERCEPTOR
// ======================================


api.interceptors.request.use(


(config:InternalAxiosRequestConfig)=>{


const token =
localStorage.getItem("token");



if(token){


config.headers.Authorization =
`Bearer ${token}`;


}



if(import.meta.env.DEV){


console.log(

"🚀 API REQUEST",

{

method:
config.method?.toUpperCase(),

url:
`${config.baseURL}${config.url}`,

token:
token
?
"Present"
:
"Missing"

}

);


}



return config;


},



(error)=>{


return Promise.reject(error);


}



);








// ======================================
// RESPONSE INTERCEPTOR
// ======================================


api.interceptors.response.use(


(response:AxiosResponse)=>{


if(import.meta.env.DEV){


console.log(

"✅ API SUCCESS",

{

status:
response.status,

data:
response.data

}

);


}



return response;


},




(error:AxiosError)=>{



const status =
error.response?.status;



if(import.meta.env.DEV){


console.error(

"❌ API FAILED",

{

status,

message:
error.message,

data:
error.response?.data

}

);


}





// =============================
// Unauthorized
// =============================


if(status===401){



console.warn(
"Session expired"
);



logoutUser();



if(
window.location.pathname !== "/login"
){


window.location.replace(
"/login"
);


}



}







// =============================
// Forbidden
// =============================


if(status===403){


console.warn(
"Access Forbidden"
);


}







// =============================
// Server Error
// =============================


if(status && status>=500){


console.error(
"Server Error"
);


}







// =============================
// Network Error
// =============================


if(!error.response){


console.error(

"Network Error - Backend unavailable"

);


}





return Promise.reject(error);



}



);