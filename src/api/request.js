
// import axios from "axios";
// import Cookies from "js-cookie";


// // const base_url = "https://5f07-118-70-132-104.ngrok-free.app"
// const base_url = "http://localhost:8088/"

// const login_path = ""


// // Truoc khi call API
// axios.interceptors.request.use((req) => {
//     //Noi 2 url voi nhau
//     const jwt = Cookies.get("jwt")
//     const newUrl = base_url + req.url
//     const Authorization = (login_path === req.url || req.url.startsWith("client/"))  ? undefined : `Bearer ${jwt}`
//     return{
//         ...req,
//         url: newUrl,
//         headers: {
//             ...req.headers,
//             Authorization,
//             'ngrok-skip-browser-warning': '1'
//         }
//     }
// })

// //Sau khi co response tra ve
// axios.interceptors.response.use((response) => {
//     return response
// }, (err) => {
//     return Promise.reject(err)
// })

// export default axios;


import axios from "axios";
import Cookies from "js-cookie";

const base_url = "http://localhost:8088/";
const jwtParam = new URLSearchParams(window.location.search).get("jwt");
const userId = new URLSearchParams(window.location.search).get("id");
Cookies.set("jwt" , jwtParam)
Cookies.set("id" , userId)
// Trước khi gọi API
axios.interceptors.request.use((req) => {
    

    const jwt = Cookies.get("jwt")
        const newUrl = base_url + req.url
         const Authorization = ( req.url.startsWith("client/"))  ? undefined : `Bearer ${jwt}`
        return{
            ...req,
            url: newUrl,
            headers: {
                ...req.headers,
                Authorization,
                'ngrok-skip-browser-warning': '1'
            }
        }
    })

   


// console.log(Cookies.ge);

// Sau khi có response trả về
axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (err) => {
        return Promise.reject(err);
    }
);

export default axios;
