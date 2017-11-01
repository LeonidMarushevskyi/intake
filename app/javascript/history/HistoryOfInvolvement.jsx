import React from 'react'
import PropTypes from 'prop-types'
import EmptyHistory from 'history/EmptyHistory'
import HistoryTableContainer from 'investigations/HistoryTableContainer'

class HistoryOfInvolvement extends React.Component {
  render() {
    const {historyIsEmpty} = this.props
    return (
      <div className='card show double-gap-top' id='history-card'>
        <div className='card-header'>
          <span>History</span>
        </div>
        {historyIsEmpty ? <EmptyHistory /> : <HistoryTableContainer />}
      </div>
    )
  }
}

HistoryOfInvolvement.propTypes = {
  historyIsEmpty: PropTypes.bool.isRequired,
}

export default HistoryOfInvolvement
