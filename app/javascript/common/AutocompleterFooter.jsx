import React from 'react'
import PropTypes from 'prop-types'
import CreateUnknownPerson from 'screenings/CreateUnknownPerson'
import ShowMoreResults from 'common/ShowMoreResults'
import classNames from 'classnames'

const AutocompleterFooter = ({canCreateNewPerson, canLoadMoreResults, onLoadMoreResults, onCreateNewPerson}) => {
  const className = classNames(
    {'col-md-6': canLoadMoreResults && canCreateNewPerson},
    {'col-md-12': canLoadMoreResults ^ canCreateNewPerson}
  )
  return (
    <div className='row half-pad-top half-pad-bottom half-pad-right half-pad-left' >
      {
        canLoadMoreResults &&
          <div className={className}>
            <ShowMoreResults onClick={onLoadMoreResults} />
          </div>
      }
      {
        canCreateNewPerson &&
          <div className={className}>
            <CreateUnknownPerson onClick={onCreateNewPerson} />
          </div>
      }
    </div>
  )
}

AutocompleterFooter.propTypes = {
  canCreateNewPerson: PropTypes.bool,
  canLoadMoreResults: PropTypes.bool,
  onCreateNewPerson: PropTypes.func,
  onLoadMoreResults: PropTypes.func,
}

export default AutocompleterFooter
