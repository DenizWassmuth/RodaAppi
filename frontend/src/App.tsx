import './App.css'
import './index.css'

import Navbar from "./components/NavBar.tsx";
import {Route, Routes} from "react-router-dom";
import LandingPage from "./components/LandingPage.tsx";
import RodasPage from "./components/RodasPage.tsx";
import WorkshopsPage from "./components/WorkshopsPage.tsx";

function App() {

  return (
      <>
          <header><Navbar/></header>
          <Routes>
              <Route path={"/"} element={<LandingPage/>}/>
              <Route path={"/rodas"} element={<RodasPage/>}/>
              <Route path={"/workshops"} element={<WorkshopsPage/>}/>
          </Routes>
      </>
  )
}

export default App
