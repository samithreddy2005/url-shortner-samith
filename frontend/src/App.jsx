import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home/Home';
import LoginPage from './Pages/LoginPage/LoginPage';
import './index.css';
import PrivateRoute from './Components/PrivateRoute/PrivateRoute';
import { HeaderMegaMenu } from './Components/Navbar/HeaderMegaMenu';
import Profile from './Components/Profile/Profile';
import ShortenUrl from './Pages/ShortenUrl/ShortenUrl';
import MyUrls from './Pages/MyUrls/MyUrls';




function App() {
 return (
   <Router>
       <HeaderMegaMenu/>
       <Routes>
           <Route path='/' element={<Home/>}/>
           <Route path='/profile' element={<Profile />} />
           <Route path='/login' element={<LoginPage/>} />
           <Route path='/url/shortener' element={<ShortenUrl/>} />
           <Route path='/url/list' element={<MyUrls/>} />
           <Route element={<PrivateRoute/>}>


           </Route>
       </Routes>
   </Router>
 )
}


export default App
