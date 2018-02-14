import * as screeningActions from 'actions/screeningActions'
import {fetch as fetchScreenings, createScreening} from 'actions/screeningsActions'
import {createSnapshot} from 'actions/snapshotActions'
import PropTypes from 'prop-types'
import React from 'react'
import ScreeningsTable from 'screenings/ScreeningsTable'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import PageHeader from 'common/PageHeader'
import {isFeatureActive} from 'common/config'

export class HomePage extends React.Component {
  constructor() {
    super(...arguments)
  }

  componentDidMount() {
    if (isFeatureActive('screenings')) {
      this.props.actions.fetchScreenings()
    }
  }

  startScreeningButton() {
    const {actions: {createScreening}} = this.props
    return (
      <button type='button'
        className='btn primary-btn pull-right'
        disabled={false}
        onClick={createScreening}
      >
        Start Screening
      </button>
    )
  }

  startSnapshotButton() {
    const {actions: {createSnapshot}} = this.props
    return (
      <button type='button'
        className='btn primary-btn pull-right'
        disabled={false}
        onClick={createSnapshot}
        style={{marginRight: '10px'}}
      >
        Start Snapshot
      </button>
    )
  }

  buttons() {
    return (
      <div>
        {isFeatureActive('screenings') && this.startScreeningButton() || <div />}
        {isFeatureActive('snapshot') && this.startSnapshotButton() || <div />}
      </div>
    )
  }

  render() {
    return (
      <div>
        <div>
          <PageHeader pageTitle='Dashboard' button={this.buttons()} />
        </div>
        <div className='container'>
          <div className='row gap-top'>
            <div className='col-md-3' />
            <div className='col-md-9'>
              { isFeatureActive('screenings') && <ScreeningsTable screenings={this.props.screenings} /> }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

HomePage.propTypes = {
  actions: PropTypes.object.isRequired,
  screenings: PropTypes.array,
}

function mapStateToProps(state, _ownProps) {
  return {
    screenings: state.get('screenings').toJS(),
  }
}

function mapDispatchToProps(dispatch, _ownProps) {
  const actions = {fetchScreenings, createScreening, createSnapshot, ...screeningActions}
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage)
