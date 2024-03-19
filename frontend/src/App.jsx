import { useState } from 'react'
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ListOfRoles from './components/Admin/UAC/Role/ListOfRoles';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<ListOfRoles />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
