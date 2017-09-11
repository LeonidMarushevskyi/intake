import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router'

const ContactLog = ({id}) => (
  <div className='card show double-gap-top'>
    <div className='card-header'>
      <span>Contact Log</span>
    </div>
    <div className='card-body'>
      <div className='row'>
        <div className='centered'>
          <Link to={`/investigations/${id}/contacts/new`}>Create New Contact</Link>
        </div>
      </div>
    </div>
  </div>
)

ContactLog.propTypes = {
  id: PropTypes.string.isRequired,
}

export default ContactLog
