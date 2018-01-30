import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'react-redux'

const SnapshotPage = ({id}) => (
  <div>
    <p>I'm a snapshot! My Id is {id}</p>
  </div>
)

SnapshotPage.propTypes = {
  id: PropTypes.string,
}

SnapshotPage.defaultProps = {
}

function mapStateToProps(state) {
  const snapshot = state.get('snapshot')
  return {
    id: snapshot.get('id')
  }
}

export default connect(mapStateToProps)(SnapshotPage)

