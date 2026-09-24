import axios from "axios";
const api = axios.create({baseURL:"http://localhost:5000/api"});

//automatically add token to request headers
api.interceptors.request.use((config)=>{
    const token=localStorage.getItem("token");
    if(token){
        config.headers.Authorization=`Bearer ${token}`;
    }
    return config;
});
export default api;
//multer -> receives file ->file system ->store image in/uploads

//mongodb -> store image path

//jwt-> identifies logged in user

//authMiddleware -> verifies token -> identifies user -> allows access to protected routes