import React from 'react'
import {SideBar, NavLinks, NavLink} from 'react-wood-duck'

const ScreeningSideBar = () => (
  <div className='col-md-2 hide-mobile'>
    <SideBar>
      <NavLinks>
        <NavLink text='Screening Information' href='#screening-information-card' />
        <NavLink text='People & Roles' href='#search-card' />
        <NavLink text='Narrative' href='#narrative-card' />
        <NavLink text='Incident Information' href='#incident-information-card' />
        <NavLink text='Allegations' href='#allegations-card' />
        <NavLink text='Relationships' href='#relationships-card' />
        <NavLink text='Worker Safety' href='#worker-safety-card' />
        <NavLink text='History' href='#history-card' />
        <NavLink text='Cross Report' href='#cross-report-card' />
        <NavLink text='Decision' href='#decision-card' />
      </NavLinks>
    </SideBar>
  </div>
)

export default ScreeningSideBar
