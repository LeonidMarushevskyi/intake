import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'react-redux'
import {getSnapshotIdValueSelector} from 'selectors/snapshotSelectors'
import {createSnapshot} from 'actions/snapshotActions'
import PersonSearchFormContainer from 'containers/snapshot/PersonSearchFormContainer'
import PersonCardView from 'snapshots/PersonCardView'
import HistoryOfInvolvementContainer from 'containers/screenings/HistoryOfInvolvementContainer'
import HistoryTableContainer from 'containers/screenings/HistoryTableContainer'
import EmptyHistory from 'views/history/EmptyHistory'

class SnapshotPage extends React.Component {
  componentDidMount() {
    const {id, createSnapshot} = this.props
    if (!id) {
      createSnapshot()
    }
  }

  render() {
    const {participants} = this.props
    return (
      <div className='row'>
        <div className='card edit double-gap-bottom' id='snapshot-card'>
          <div className='card-body'>
            <div className='row'>
              <div className='col-md-12'>
                <div className='double-pad-top'>
                  The Child Welfare History Snapshot allows you to search CWS/CMS for people and their past history with CWS.
                  To start, search by any combination of name, date of birth, or social security number. Click on a person from
                  the results to add them to the Snapshot, and their basic information and history will automatically appear below.
                  You can add as many people as you like, and when ready, copy the summary of their history.
                  You will need to manually paste it into a document or a field in CWS/CMS.
                </div>
              </div>
            </div>
          </div>
        </div>
        <PersonSearchFormContainer />
        {participants.map(({id}) =>
          <PersonCardView key={id} personId={id} />
        )}
        <HistoryOfInvolvementContainer empty={<EmptyHistory />} notEmpty={<HistoryTableContainer />} />
      </div>
    )
  }
}

SnapshotPage.propTypes = {
  createSnapshot: PropTypes.func,
  id: PropTypes.string,
  participants: PropTypes.array,
}

SnapshotPage.defaultProps = {
}

function mapStateToProps(state) {
  return {
    id: getSnapshotIdValueSelector(state),
    participants: state.get('participants').toJS(),
  }
}

function mapDispatchToProps(dispatch) {
  return {createSnapshot: () => dispatch(createSnapshot())}
}

export default connect(mapStateToProps, mapDispatchToProps)(SnapshotPage)

