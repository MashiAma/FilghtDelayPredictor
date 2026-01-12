import React from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'

import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'

import { CBadge, CNavLink, CSidebarNav } from '@coreui/react'

export const AppSidebarNav = ({ items }) => {
  const navLink = (name, icon, badge, indent = false) => {
    return (
      <span style={{ 
      color: '#000000ff',       // blue text color
      fontWeight: 'bolder',     // bold text
      display: 'flex', 
      alignItems: 'center',
      gap: '8px',             // space between icon and text
    }}>
        {icon
          ? React.cloneElement(icon, { 
            style: { height: 20, width: 20, color: '#040404ff',  fontWeight: 'bolder'}  // blue icon
          }): indent && (
              <span className="nav-icon">
                <span className="nav-icon-bullet"></span>
              </span>
            )}
        {name && name}
        {badge && (
          <CBadge color={badge.color} className="ms-auto" size="sm">
            {badge.text}
          </CBadge>
        )}
       </span>
    )
  }

const navItem = (item, index, indent = false) => {
  const { component, name, badge, icon, ...rest } = item
  const Component = component

  // NavLink style function to set colors based on active state
  const navLinkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    color: isActive ? '#ffffff' : "#000000ff",              // white if active else blue
    backgroundColor: isActive ? "#52609cff" : 'transparent',// blue bg if active else transparent
    //"#02187dff"
    fontWeight: 'bold',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    textDecoration: 'none',
  })

  return (
    <Component as="div" key={index}>
      {rest.to || rest.href ? (
        <CNavLink
          {...(rest.to && { as: NavLink })}
          {...(rest.href && { target: '_blank', rel: 'noopener noreferrer' })}
          {...rest}
          style={navLinkStyle}
        >
          <NavLinkChildren icon={icon} name={name} badge={badge} />
        </CNavLink>
      ) : (
        navLink(name, icon, badge, indent)
      )}
    </Component>
  )
}

// Helper component to render icon with color based on NavLink active state
const NavLinkChildren = ({ icon, name, badge }) => {
  // Use React Router’s useMatch or useLocation hook to detect active route if needed
  // But NavLink passes isActive in style prop only, so trick is to get color from parent style

  // Instead, easiest is to render icon inside NavLink so icon inherits text color
  // So just clone icon with "currentColor" for fill or color

  const iconWithColor = icon
    ? React.cloneElement(icon, { 
        style: { height: 20, width: 20, color: 'currentColor', marginRight: 8 }
      })
    : null

  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {iconWithColor}
      {name}
      {badge && (
        <CBadge color={badge.color} className="ms-auto" size="sm">
          {badge.text}
        </CBadge>
      )}
    </span>
  )
}

  const navGroup = (item, index) => {
    const { component, name, icon, items, to, ...rest } = item
    const Component = component
    return (
      <Component compact as="div" key={index} toggler={navLink(name, icon)} {...rest}>
        {items?.map((item, index) =>
          item.items ? navGroup(item, index) : navItem(item, index, true),
        )}
      </Component>
    )
  }

  return (
    <CSidebarNav as={SimpleBar}>
      {items &&
        items.map((item, index) => (item.items ? navGroup(item, index) : navItem(item, index)))}
    </CSidebarNav>
  )
}

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
}
