// import React from 'react';
// import { Routes, Route } from 'react-router-dom';
// import LoginPage from '../../pages/LoginPage';
// import RegisterPage from '../../pages/RegisterPage';

// const AuthRoute = () => (
//   <Routes>
//     <Route path="/login" element={<LoginPage />} />
//     <Route path="/registration" element={<RegisterPage />} />
//   </Routes>
// );

// export default AuthRoute;

import React from 'react';
import LoginPage from '../../pages/LoginPage';
import RegisterPage from '../../pages/RegisterPage';

const AuthRoute = () => (
  <>
    <LoginPage />
    <RegisterPage />
  </>
);

export default AuthRoute;

