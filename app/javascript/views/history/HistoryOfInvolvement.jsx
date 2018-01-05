import React from 'react'
import PropTypes from 'prop-types'
import CardView from 'views/CardView'

class HistoryOfInvolvement extends React.Component {
  render() {
    const {historyIsEmpty, empty, notEmpty} = this.props
    return (
      <CardView
        id='history-card'
        title='History'
        mode='show'
        show={historyIsEmpty ? empty : notEmpty}
      />
    )
  }
}

HistoryOfInvolvement.propTypes = {
  empty: PropTypes.object,
  historyIsEmpty: PropTypes.bool.isRequired,
  notEmpty: PropTypes.object,
}

export default HistoryOfInvolvement
