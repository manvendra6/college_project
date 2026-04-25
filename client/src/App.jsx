import React, { use } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import Forgotpassword from './pages/Forgotpassword'
import useCurrentuser from "./Hookes/use.currentuser"
import { useSelector } from 'react-redux'
import Home from './pages/Home'
import userGetcity from './Hookes/use.getcity'
import useShopdata from './Hookes/use.getmyShop'
import CreateEditShop from './pages/createEditshop'
import Additems from './pages/Additems'
import Itemedit from './pages/Itemedit'
import useGetshopcity from './Hookes/use.getShopcity'
import CartItem from './pages/cartItem'
import Chackoutpage from './pages/chackoutpage'
import Orderplaced from './pages/Orderplaced'
import Orderpage from './pages/Orderpage'
import OwnerOrders from './pages/OwnerOrders'
import SearchPage from './pages/SearchPage'
import Deliverydashboard from './Components/Deliverydashboard'
import GestureController from './Components/GestureController'


function App() {
 
  
  useCurrentuser()
  useShopdata()
  userGetcity()
  useGetshopcity()
 
  const {userData}= useSelector(state=>state.user)
  
 
  return (
    <div>
      <GestureController />
      <Routes>
        <Route path='/signup' element={!userData ?<Signup/>:<Navigate to={"/"} />} /> 
        <Route path='/signin' element={!userData ?<Signin/>:<Navigate to={"/"} />} />
        <Route path='/forgotpass' element={!userData ?<Forgotpassword/>:<Navigate to={"/"} />}/>
        <Route path="/" element={userData ?<Home/>:<Navigate to={"/signin"} />}/>
       <Route path='/create-editshop' element={userData?<CreateEditShop/>: <Navigate to='/signin' />}
       />
       <Route path='/add-items' element={userData?<Additems/>: <Navigate to='/signin' />}
       />
       <Route path='/item-edit/:itemId' element={userData?<Itemedit/>:<Navigate to='/signin' />}/> 

       <Route path='/cart' element={userData?<CartItem/>:<Navigate to='/signin' />}/>
       
       <Route path='/chackout' element={userData?<Chackoutpage/>:<Navigate to='/signin'/>}/>
       <Route path='/order-placed' element={userData?<Orderplaced/>:<Navigate to='/signin' />}/>
        <Route path='/order-page' element={userData?<Orderpage/>:<Navigate to='/signin' />}/>
        <Route path='/search' element={userData ? <SearchPage /> : <Navigate to='/signin' />} />
        <Route path='/owner-orders' element={userData?.role === 'owner' ? <OwnerOrders /> : <Navigate to='/signin' />} />
        <Route path='/delivery-dashboard' element={userData?.role === 'delivery Boy' ? <Deliverydashboard /> : <Navigate to='/signin' />} />
      </Routes>
    </div>
  )
}

export default App