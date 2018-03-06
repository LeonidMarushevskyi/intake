import React from 'react'
import {SideBar, NavLinks, NavLink} from 'react-wood-duck'
import PropTypes from 'prop-types'
import nameFormatter from 'utils/nameFormatter'

const SnapshotSideBar = (props) => (
  <div className='col-md-2 hide-mobile'>
    <SideBar>
      <NavLinks>
        <NavLink key={1} text='People & Roles' href='#search-card-anchor' >
          <NavLinks nested={true} >
            {props.participants && props.participants.map(({id, first_name, last_name, middle_name, name_suffix}) =>
              <NavLink
                key={id}
                text={nameFormatter({first_name, last_name, middle_name, name_suffix})}
                href={`#participants-card-${id}`}
                preIcon='fa fa-user'
              />
            )}
          </NavLinks>
        </NavLink>
        <NavLink text='Relationships' href='#relationships-card-anchor' />
        <NavLink text='History' href='#history-card-anchor' />
      </NavLinks>
    </SideBar>
  </div>
)

SnapshotSideBar.propTypes = {
  participants: PropTypes.array.isRequired,
}

SnapshotSideBar.defaultProps = {
  participants: [],
}

export default SnapshotSideBar
