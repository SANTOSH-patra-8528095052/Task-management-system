import Header from "./Header.jsx";
import {Outlet} from "react-router-dom";
import React from 'react'
import Footer from "./Footer.jsx";

function Layout() {
  return (
    <main>
    <Header />
    <Outlet />
    <Footer />
  </main>
  )
}

export default Layout