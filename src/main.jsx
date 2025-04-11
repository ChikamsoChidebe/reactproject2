import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './tailwind.css'
import App from './App'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './Header'
import Home from './Home'
import About from './About'
import Contact from './Contact'
import Footer from './Footer'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <BrowserRouter>
    <Header/>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/about" element={<About/>}/>
      <Route path="/contact" element={<Contact/>}/>
    </Routes>
    <Footer/>
    </BrowserRouter> */}
    <App/>
  </StrictMode>
)    