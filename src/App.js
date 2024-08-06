import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from './components/login/Login';
import SignUp from './components/sign-up/SignUp';
import DashBoard from './components/dashboard/DashBoard';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='login' element={<Login/>}/>
        <Route path='sign-up' element={<SignUp/>}/>
        <Route path='dashboard' element={<DashBoard/>}/>
      </Routes>
    </BrowserRouter>
  );
};

export default App;