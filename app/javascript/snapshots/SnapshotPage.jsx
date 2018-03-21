import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'react-redux'
import {getSnapshotIdValueSelector} from 'selectors/snapshotSelectors'
import {createSnapshot, clearSnapshot} from 'actions/snapshotActions'
import {clearPeople} from 'actions/personCardActions'
import {clearHistoryOfInvolvement} from 'actions/historyOfInvolvementActions'
import {clearRelationships} from 'actions/relationshipsActions'
import PersonSearchFormContainer from 'containers/snapshot/PersonSearchFormContainer'
import PersonCardView from 'snapshots/PersonCardView'
import HistoryOfInvolvementContainer from 'containers/snapshot/HistoryOfInvolvementContainer'
import HistoryTableContainer from 'containers/snapshot/HistoryTableContainer'
import EmptyHistory from 'views/history/EmptyHistory'
import RelationshipsCardContainer from 'containers/snapshot/RelationshipsCardContainer'
import PageHeader from 'common/PageHeader'
import SnapshotSideBar from 'snapshots/SnapshotSideBar'

export class SnapshotPage extends React.Component {
  componentDidMount() {
    const {id, createSnapshot} = this.props
    if (!id) {
      createSnapshot()
    }
  }

  componentWillUnmount() {
    this.props.unmount()
  }

  startOverButton() {
    const {startOver} = this.props
    return (
      <button type='button'
        className='btn primary-btn pull-right'
        disabled={false}
        onClick={startOver}
      >
        Start Over
      </button>
    )
  }

  render() {
    const {participants} = this.props
    return (
      <div>
        <div>
          <PageHeader pageTitle='Snapshot' button={this.startOverButton()} />
        </div>
        <div className='container'>
          <div className='row'>
            <SnapshotSideBar participants={participants} />
            <div className='col-md-10'>
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
                <RelationshipsCardContainer />
                <HistoryOfInvolvementContainer empty={<EmptyHistory />} notEmpty={<HistoryTableContainer />} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

SnapshotPage.propTypes = {
  createSnapshot: PropTypes.func,
  id: PropTypes.string,
  participants: PropTypes.array,
  startOver: PropTypes.func,
  unmount: PropTypes.func,
}

const mapStateToProps = (state) => ({
  id: getSnapshotIdValueSelector(state),
  participants: state.get('participants').toJS(),
})

const mapDispatchToProps = (dispatch) => ({
  createSnapshot: () => dispatch(createSnapshot()),
  startOver: () => {
    dispatch(createSnapshot())
    dispatch(clearPeople())
    dispatch(clearHistoryOfInvolvement())
    dispatch(clearRelationships())
  },
  unmount: () => {
    dispatch(clearPeople())
    dispatch(clearHistoryOfInvolvement())
    dispatch(clearRelationships())
    dispatch(clearSnapshot())
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(SnapshotPage)

