import Header from "./Header.jsx";
import {Outlet} from "react-router-dom";
import React from 'react'
import Footer from "./Footer.jsx";
import Sidebar from "./Sidebar.jsx";

function Layout() {
  return (
    <main>
    <Header />
    {/* <Sidebar/> */}
    <Outlet />
    <Footer />
  </main>
  )
}

export default Layout