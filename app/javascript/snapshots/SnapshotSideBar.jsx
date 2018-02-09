import React from 'react'
import {SideBar, NavLinks, NavLink} from 'react-wood-duck'

const SnapshotSideBar = () => (
  <div className='col-md-2 hide-mobile'>
    <SideBar>
      <NavLinks>
        <NavLink text='People & Roles' href='#search-card-anchor' />
        <NavLink text='History' href='#history-card-anchor' />
      </NavLinks>
    </SideBar>
  </div>
)

export default SnapshotSideBar
