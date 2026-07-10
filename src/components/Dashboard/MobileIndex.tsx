import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getUserData } from '../../api/auth/auth';
import { setAuthData } from '../../reducer/AuthSlice';


// Component
import SignOutComponent from '../Auth/SignOut';

export default function MobileIndex() {
    const [open, setOpen] = useState(false)
    const dispatch = useDispatch();
    

    const fetch = async () => {
      const result = await getUserData();
      if(result.status === 200){
        dispatch(setAuthData(result?.data))
      }
    }

    useEffect(() => {
      fetch();
    }, [])

    return (
      <>
        <SignOutComponent open={open} handleCancel={() => setOpen(false)}/>
        <Outlet/>
      </>
    )
}
