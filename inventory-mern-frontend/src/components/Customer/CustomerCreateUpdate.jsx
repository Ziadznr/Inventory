import React from 'react'
import { Fragment } from 'react'
import { useSelector } from 'react-redux';
import store from '../../redux/store/store';
import { OnChangeCustomerInput } from '../../redux/state-slice/customer-slice';
import { CreateCustomerRequest, FillCustomerFormRequest } from '../../APIRequest/CustomerAPIRequest';
import { ErrorToast, IsEmail, IsEmpty } from '../../helper/FormHelper';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';

const CustomerCreateUpdate = () => {
let FormValue=useSelector((state)=>(state.customer.FormValue))

let navigate=useNavigate();

let [ObjectID,SetObjectID]=useState(0)

useEffect(()=>{
    let params=new URLSearchParams(window.location.search)
    let id=params.get('id');
    if (id!=null) {
        SetObjectID(id);
       
        (async()=>{
            await FillCustomerFormRequest(id);
        })()
    }
    
},[])

const SaveChange=async ()=>{
    if (IsEmpty(FormValue.CustomerName)) {
        ErrorToast("Customer Name Required !")
    }
    else if(IsEmpty(FormValue.Phone)){
        ErrorToast("Customer Mobile Number Required !")
    }
    else if(IsEmail(FormValue.Email)){
        ErrorToast("Customer Email Address Required !")
    }
    else{
        if (await CreateCustomerRequest(FormValue,ObjectID)) {
            navigate("/CustomerListPage")
        }
    }
}

  return (
    <Fragment>
        <div className=' container-fluid'>
            <div className=' row'>
                <div className=' col-12'>
                    <div className=' card'>
                        <div className=' card-body'>
                            <div className=' row'>
                                <h5>Save Customer</h5>
                                <hr className=' bg-light' />
                                {/* <div className=' col-4 p-2'>
                                    <label className=' form-label'>Object ID</label>
                                    <input value={ObjectID} type="text" className=' form-control form-control-sm' />
                                </div> */}
                                <div className=' col-4 p-2'>
                                    <label className=' form-label'>Customer Name</label>
                                    <input onChange={(e)=>{store.dispatch(OnChangeCustomerInput({Name:"CustomerName",Value:e.target.value}))}} value={FormValue.CustomerName} type="text" className=' form-control form-control-sm' />
                                </div>
                                <div className=' col-4 p-2'>
                                    <label className=' form-label'>Mobile No</label>
                                    <input onChange={(e)=>{store.dispatch(OnChangeCustomerInput({Name:"Phone",Value:e.target.value}))}} value={FormValue.Phone} type="text" className=' form-control form-control-sm' />
                                </div>
                                <div className=' col-4 p-2'>
                                    <label className=' form-label'>Email</label>
                                    <input onChange={(e)=>{store.dispatch(OnChangeCustomerInput({Name:"Email",Value:e.target.value}))}} value={FormValue.Email} type="text" className=' form-control form-control-sm' />
                                </div>
                                <div className=' col-12 p-2'>
                                    <label className=' form-label'>Address</label>
                                    <textarea onChange={(e)=>{store.dispatch(OnChangeCustomerInput({Name:"Address",Value:e.target.value}))}} value={FormValue.Address} className=' form-control form-control-sm' rows={4}/>
                                </div>
                            </div>
                            <div className=' row'>
                                <div className=' col-4 p-2'>
                                    <button onClick={SaveChange} className=' btn btn-sm my-3 btn-success'>Save Change</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Fragment>
  )
}

export default CustomerCreateUpdate;