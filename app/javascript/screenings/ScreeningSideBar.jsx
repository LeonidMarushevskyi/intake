import React from 'react'
import {SideBar, NavLinks, NavLink} from 'react-wood-duck'

const ScreeningSideBar = () => (
  <div className='col-md-2 hide-mobile'>
    <SideBar>
      <NavLinks>
        <NavLink text='Screening Information' href='#screening-information-card-anchor' />
        <NavLink text='People & Roles' href='#search-card-anchor' />
        <NavLink text='Narrative' href='#narrative-card-anchor' />
        <NavLink text='Incident Information' href='#incident-information-card-anchor' />
        <NavLink text='Allegations' href='#allegations-card-anchor' />
        <NavLink text='Relationships' href='#relationships-card-anchor' />
        <NavLink text='Worker Safety' href='#worker-safety-card-anchor' />
        <NavLink text='History' href='#history-card-anchor' />
        <NavLink text='Cross Report' href='#cross-report-card-anchor' />
        <NavLink text='Decision' href='#decision-card-anchor' />
      </NavLinks>
    </SideBar>
  </div>
)

export default ScreeningSideBar
