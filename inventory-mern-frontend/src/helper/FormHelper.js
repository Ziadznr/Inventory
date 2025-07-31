import { toast } from 'react-hot-toast';
const EmailRegx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MobileRegx= /^(?:\+?88)?01[3-9]\d{8}$/;

class FormHelper{
    IsEmpty(value){
        return !value || value.trim().length === 0;
    
    }
    IsMobile(value){
        return MobileRegx.test(value)
    }
    IsEmail(value){
        return EmailRegx.test(value)
    }
    ErrorToast(msg){
        toast.error(msg,{position:"top-center"})
    }
     SuccessToast(msg){
        toast.success(msg,{position:"top-right"})
    }
    getBase64(file){
        return new Promise((resolve,reject)=>{
            const reader=new FileReader();
            reader.readAsDataURL(file);
            reader.onload=()=>resolve(reader.result);
            reader.onerror=(error)=>reject(error);
        })
    }
}



export const {IsEmpty,IsEmail,IsMobile,ErrorToast,SuccessToast,getBase64}=FormHelper;