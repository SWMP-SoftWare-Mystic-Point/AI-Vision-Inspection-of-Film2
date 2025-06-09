import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Capstone from './component/page/Capstone';

function App(){
    return (
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Capstone/>}></Route>            
          </Routes>
        </BrowserRouter>
    );
}

export default App;