// // import axios from "axios";

// // export const api = axios.create({
// //   baseURL: "http://localhost:5003/api",
// //   headers: {
// //     "Content-Type": "application/json",
// //   },
// // });


// // // =====================
// // // Request Interceptor
// // // Add JWT Token Automatically
// // // =====================

// // api.interceptors.request.use(
// //   (config) => {

// //     const token = localStorage.getItem("token");


// //     console.log(
// //       "TOKEN:",
// //       token
// //     );


// //     if (token) {

// //       config.headers.Authorization =
// //         `Bearer ${token}`;

// //     }


// //     console.log(
// //       "➡️",
// //       config.method,
// //       `${config.baseURL}${config.url}`
// //     );


// //     return config;

// //   },


// //   (error) => {

// //     return Promise.reject(error);

// //   }
// // );



// // // =====================
// // // Response Interceptor
// // // =====================

// // api.interceptors.response.use(

// //   (response) => {

// //     console.log(
// //       "✅",
// //       response.data
// //     );

// //     return response;

// //   },


// //   (error) => {

// //     console.error(
// //       "❌",
// //       error.response?.status
// //     );


// //     console.error(
// //       error.response?.data
// //     );


// //     return Promise.reject(error);

// //   }

// // );



// import axios from "axios";

// export const api = axios.create({
//   baseURL: "http://localhost:5003/api",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: false,
// });

// // =====================
// // Request Interceptor
// // =====================

// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     console.log(
//       `➡️ ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`
//     );

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // =====================
// // Response Interceptor
// // =====================

// api.interceptors.response.use(
//   (response) => {
//     console.log("✅ API Response:", response.data);
//     return response;
//   },
//   (error) => {
//     console.error("❌ API Error:", error.response?.status);
//     console.error(error.response?.data || error.message);

//     return Promise.reject(error);
//   }
// );



import axios from "axios";


export const api = axios.create({

  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:5003/api",

  headers: {
    "Content-Type": "application/json",
  },

});


// =====================
// Request Interceptor
// =====================

api.interceptors.request.use(

  (config) => {

    const token = localStorage.getItem("token");

    console.log("TOKEN:", token);


    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;

    }


    console.log(
      "➡️",
      config.method?.toUpperCase(),
      `${config.baseURL}${config.url}`
    );


    return config;

  },


  (error) => {

    return Promise.reject(error);

  }

);


// =====================
// Response Interceptor
// =====================

api.interceptors.response.use(

  (response) => {

    console.log(
      "✅ API Response:",
      response.data
    );

    return response;

  },


  (error) => {

    console.error(
      "❌ API Error:",
      error.response?.status
    );


    console.error(
      "Message:",
      error.response?.data || error.message
    );


    return Promise.reject(error);

  }

);