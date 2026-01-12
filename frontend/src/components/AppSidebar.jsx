import React, { useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CModalTitle,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

// import { logo } from './../../assets/brand/logo.jpg'
// import { sygnet } from 'src/assets/brand/sygnet'
import logoImage from '../assets/images/logo.png';

// sidebar nav config
import navigation from '../routes/navigation'
import { AuthContext } from '../context/AuthContext'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const { user } = useContext(AuthContext)
  const role = user?.role

  const filterNavItems = (items) =>
    items
      .filter((item) => !item.roles || item.roles.includes(role))
      .map((item) =>
        item.items
          ? { ...item, items: filterNavItems(item.items) }
          : item
      )

  const filteredNav = filterNavItems(navigation)

  return (
    <CSidebar
      className="border-end"
      color="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    //style={{backgroundColor:"#01156cff"}}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/" className="d-flex align-items-center" style={{ textDecoration: 'none' }}>
          <img src={logoImage} alt="Logo" height={32} />
          <CModalTitle style={{ color: "#01156cff", fontWeight: 'bolder', fontSize: '1.38rem', marginLeft: '20px' }}>Sky Guard</CModalTitle>
          {/* <CIcon customClassName="sidebar-brand-full" 
          icon={logoImage} 
          height={32} />
          <CIcon customClassName="sidebar-brand-narrow" 
          // icon={sygnet} 
          height={32} /> */}
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      <AppSidebarNav items={filteredNav} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
