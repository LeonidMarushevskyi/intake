import PropTypes from 'prop-types'
import React from 'react'
import {EmptyRelationships} from 'investigations/Relationships'
import RelationshipsContainer from 'screenings/RelationshipsContainer'

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
