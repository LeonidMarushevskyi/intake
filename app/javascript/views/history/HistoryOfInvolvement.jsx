import React from 'react'
import PropTypes from 'prop-types'

class HistoryOfInvolvement extends React.Component {
  render() {
    const {historyIsEmpty, empty, notEmpty} = this.props
    return (
      <div>
        <span className='anchor' id='history-card-anchor'/>
        <div className='card show double-gap-top' id='history-card'>
          <div className='card-header'>
            <span>History</span>
          </div>
          {historyIsEmpty && empty}
          {!historyIsEmpty && notEmpty}
        </div>
      </div>
    )
  }
}

HistoryOfInvolvement.propTypes = {
  empty: PropTypes.object,
  historyIsEmpty: PropTypes.bool.isRequired,
  notEmpty: PropTypes.object,
}

export default HistoryOfInvolvement
