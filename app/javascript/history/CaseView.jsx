import React from 'react'
import PropTypes from 'prop-types'

const CaseView = ({
  caseId,
  county,
  dateRange,
  focusChild,
  parents,
  restrictedAccessStatus,
  status,
  worker,
}) => (
  <tr>
    <td>{dateRange}</td>
    <td>
      <div className='row'>Case</div>
      <div className='row'>{caseId}</div>
      <div className='row'>({status})</div>
      {
        restrictedAccessStatus &&
        <div className='row information-flag'>{restrictedAccessStatus}</div>
      }
    </td>
    <td>{county}</td>
    <td>
      <div className='row'>Focus Child: {focusChild}</div>
      <div className='row'>Parent(s): {parents}</div>
      <div className='row'>Worker: {worker}</div>
    </td>
  </tr>
)

CaseView.propTypes = {
  caseId: PropTypes.string,
  county: PropTypes.string,
  dateRange: PropTypes.string,
  focusChild: PropTypes.string,
  parents: PropTypes.string,
  restrictedAccessStatus: PropTypes.string,
  status: PropTypes.string,
  worker: PropTypes.string,
}

export default CaseView
