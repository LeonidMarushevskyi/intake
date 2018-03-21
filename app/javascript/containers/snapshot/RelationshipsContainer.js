import {connect} from 'react-redux'
import {Relationships} from 'snapshots/Relationships'
import {getPeopleSelector} from 'selectors/screening/relationshipsSelectors'
import {createSnapshotPerson} from 'actions/personCardActions'
import {getSnapshotIdValueSelector} from 'selectors/snapshotSelectors'

const mapStateToProps = (state, _ownProps) => ({
  people: getPeopleSelector(state).toJS(),
  snapshotId: getSnapshotIdValueSelector(state),
})

const mapDispatchToProps = (dispatch) => ({
  onClick: (relationship, snapshotId) => {
    const relationshipsPerson = {
      snapshotId,
      legacy_descriptor: {
        legacy_id: relationship.legacy_descriptor && relationship.legacy_descriptor.legacy_id,
        legacy_source_table: relationship.legacy_descriptor && relationship.legacy_descriptor.legacy_table_name,
      },
    }
    dispatch(createSnapshotPerson(relationshipsPerson))
  },
  dispatch,
})

export default connect(mapStateToProps, mapDispatchToProps)(Relationships)
