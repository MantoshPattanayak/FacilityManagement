import { useState } from 'react'
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ListOfRoles from './components/Admin/UAC/Role/ListOfRoles';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Route>
          <Route path='/' element={<ListOfRoles />} />
        </Route>
      </BrowserRouter>
    </>
  )
}

export default App
