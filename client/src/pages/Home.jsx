import React from 'react'
import Userdashboard from '../Components/Userdashboard'
import Ownerdashboard from '../Components/Ownerdashboard'
import Deliverydashboard from '../Components/Deliverydashboard'
import { useSelector } from 'react-redux'

const Home = () => {
    const { userData } = useSelector(state => state.user);
    
     
  return (
    <div>
      {userData.role=="user"&& <Userdashboard/>}
      {userData.role=="owner"&&<Ownerdashboard/>}
       {userData.role=="delivery Boy" &&<Deliverydashboard/>}
      </div>
  )
}

export default Home