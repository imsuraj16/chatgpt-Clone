import axios from "../../api/axiosconfig";
import { loadMessage } from "../reducers/messageSlice";



export const getChatMessages = (chatId)=>async(dispatch)=>{

    try {
        const {data} = await axios.get(`/api/chat/${chatId}/messages`)
       dispatch(loadMessage(data))
    } catch (error) {
        console.log(error.message);
        
    }
}