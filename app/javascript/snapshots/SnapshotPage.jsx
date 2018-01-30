import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'react-redux'

export class SnapshotPage extends React.Component {
  render() {
    return (
      <div>
        <p>I'm a snapshot!</p>
      </div>
    )
  }
}

SnapshotPage.propTypes = {
}

SnapshotPage.defaultProps = {
}

export default connect(null)(SnapshotPage)

