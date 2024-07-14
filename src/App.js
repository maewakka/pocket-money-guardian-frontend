import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from './components/login/Login';
import SignUp from './components/sign-up/SignUp';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='login' element={<Login/>}/>
        <Route path='sign-up' element={<SignUp/>}/>
      </Routes>
      
    </BrowserRouter>
  );
};

export default App;