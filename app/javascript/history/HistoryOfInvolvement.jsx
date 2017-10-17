import React from 'react'
import PropTypes from 'prop-types'
import EmptyHistory from 'history/EmptyHistory'
import HistoryTable from 'history/HistoryTable'

class HistoryOfInvolvement extends React.Component {
  // componentDidMount() {
  // const {investigationId, actions: {build}} = this.props
  // build({investigation_id: investigationId})
  // }
  render() {
    const {historyIsEmpty} = this.props
    return (
      <div className='card show double-gap-top' id='history-card'>
        <div className='card-header'>
          <span>History</span>
        </div>
        {historyIsEmpty ? <EmptyHistory /> : <HistoryTable />}
      </div>
    )
  }
}

HistoryOfInvolvement.propTypes = {
  historyIsEmpty: PropTypes.bool.isRequired,
}

export default HistoryOfInvolvement
