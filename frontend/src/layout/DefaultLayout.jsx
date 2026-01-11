import React from 'react'
import { AppContent, AppSidebar, Footer, AppHeader } from '../components/index.jsx'

const DefaultLayout = () => {
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <AppContent />
        </div>
        {/* <Footer /> */}
      </div>
    </div>
  )
}

export default DefaultLayout
