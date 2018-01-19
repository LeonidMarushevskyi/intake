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
      <div className='semibold'>Case</div>
      <div>({status})</div>
      <div className='c-dark-grey'>{caseId}</div>
      {
        restrictedAccessStatus &&
        <div className='information-flag'>{restrictedAccessStatus}</div>
      }
    </td>
    <td>{county}</td>
    <td>
      <div><span className='semibold'>Focus Child:</span> {focusChild}</div>
      <div><span className='semibold'>Parent(s):</span> {parents}</div>
      <div><span className='semibold'>Worker:</span> {worker}</div>
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
