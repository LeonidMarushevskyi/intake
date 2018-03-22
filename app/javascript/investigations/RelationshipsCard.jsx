import PropTypes from 'prop-types'
import React from 'react'
import {EmptyRelationships} from 'common/Relationships'
import RelationshipsContainer from 'investigations/RelationshipsContainer'

const RelationshipsCard = ({areRelationshipsEmpty}) => (
  <div id='relationships-card' className='card show double-gap-top'>
    <div className='card-header'>
      <span>Relationships</span>
    </div>
    {areRelationshipsEmpty ? <EmptyRelationships /> : <RelationshipsContainer />}
  </div>
)

RelationshipsCard.propTypes = {
  areRelationshipsEmpty: PropTypes.bool,
}

export default RelationshipsCard
