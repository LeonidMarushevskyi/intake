import PropTypes from 'prop-types'
import React from 'react'

const PageError = ({errorCount}) => (
  <div className='page-error'>
    <div className='container'>
      <div className='row'>
        <p className='text-center'>
          {!errorCount && 'Something went wrong, sorry! Please try your last action again.'}
          {Boolean(errorCount) && `${errorCount} error(s) have been identified. Please fix them and try submitting again.`}
        </p>
      </div>
    </div>
  </div>
)

PageError.propTypes = {
  errorCount: PropTypes.number,
}

export default PageError
