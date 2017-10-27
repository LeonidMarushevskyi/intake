import {connect} from 'react-redux'
import RelationshipsCard from 'investigations/RelationshipsCard'
import {getRelationshipsSelector} from 'selectors/relationshipsSelectors'

const mapStateToProps = (state, _ownProps) => ({
  areRelationshipsEmpty: getRelationshipsSelector(state).isEmpty(),
})

export default connect(mapStateToProps)(RelationshipsCard)
