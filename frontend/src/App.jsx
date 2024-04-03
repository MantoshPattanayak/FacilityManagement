import { useState } from 'react'
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ListOfRoles from './components/Admin/UAC/Role/ListOfRoles';
import CreateRole from './components/Admin/UAC/Role/CreateRole';
import EditRole from './components/Admin/UAC/Role/EditRole';







function App() {

  return (
    <>
   
      <BrowserRouter>
      <div>


      
     
 



    
 
 

        {/* here UAC */}
        <Routes>
          <Route path='/UAC/Role/ListOfRoles' element={<ListOfRoles/>} />
        </Routes>



 

     
      </div>
      </BrowserRouter>
    </>
  )
}

export default App
