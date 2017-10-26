import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router'

const ContactLog = ({investigationId, contactLogs}) => (
  <div className='card show double-gap-top'>
    <div className='card-header'>
      <span>{`Contact Log (${contactLogs.length})`}</span>
    </div>
    <div className='card-body'>
      <div className='table-responsive'>
        <table className='table table-hover'>
          <colgroup>
            <col className='col-md-2' />
            <col className='col-md-2'/>
            <col className='col-md-2' />
            <col className='col-md-6'/>
          </colgroup>
          <thead>
            <tr>
              <th scope='col'>Date/Time</th>
              <th scope='col'>People present</th>
              <th scope='col'>Method/Status</th>
              <th scope='col'>Notes</th>
            </tr>
          </thead>
        </table>
      </div>
      <div className='row'>
        <div className='centered'>
          <Link to={`/investigations/${investigationId}/contacts/new`} target='_blank'>Create New Contact</Link>
        </div>
      </div>
    </div>
  </div>
)

ContactLog.propTypes = {
  contactLogs: PropTypes.array,
  investigationId: PropTypes.string.isRequired,
}

export default ContactLog
