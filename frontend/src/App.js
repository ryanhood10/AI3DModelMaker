import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import AnotherPage from './components/AnotherPage';
import BestPractices from './components/BestPractices';
import Footer from './components/Footer';
import Header from './components/Header';
import HomePage from './components/HomePage'


function App() {
  return (
    <Router>
      <Routes>

          <Route path="/"
           element={
            <React.Fragment>
              <Header />
           <HomePage />
           <Footer />
           </React.Fragment>

           } />  
           <Route path="/another"
           element={
            <React.Fragment>
              <Header />
           <AnotherPage />
           <Footer />
           </React.Fragment>

           } />

        <Route path="/BestPractices"
           element={
            <React.Fragment>
              <Header />
           <BestPractices />
           <Footer />
           </React.Fragment>

           } />
       
      </Routes>
    </Router>
  );
}

export default App;
