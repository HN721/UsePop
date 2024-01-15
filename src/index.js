import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Star from './star.js';
import App from './App';
import { useState } from 'react';

function Test (){
  const[movie ,setMovie] =useState(0);
  return(
    <div>
    <Star color='blue' maxRating={10} onSetRating={setMovie}/>
    <p>This Movie  Was rated {movie} Star</p>
    </div>
    
  )
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    {/* <Star maxRating={5} message={['terrible','bad' ,'okay','good','Amzing']}/>
    <Star size={24} color="red" className="test" defaultRating={3}/> */}
    {/* <Test/> */}
    
  </React.StrictMode>
);


