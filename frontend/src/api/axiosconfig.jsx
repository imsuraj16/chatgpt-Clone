import axios from 'axios'


const instance = axios.create({

    baseURL : "https://chatgpt-clone-ankk.onrender.com",
    withCredentials : true
})

export default instance
