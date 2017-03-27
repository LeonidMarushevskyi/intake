import CheckboxListFilter from 'components/common/CheckboxListFilter'
import React from 'react'
import SCREENING_DECISION from 'ScreeningDecision'
import {browserHistory} from 'react-router'

export default class ScreeningsFilter extends React.Component {
  constructor() {
    super(...arguments)
    this.onChange = this.onChange.bind(this)
  }

  valueAsArray(queryValue) {
    if (queryValue) {
      return [].concat(queryValue)
    } else {
      return []
    }
  }

  onChange(query) {
    browserHistory.push({
      pathname: '/screenings',
      query: query,
    })
  }

  render() {
    var screeningDecisions = this.valueAsArray(this.props.query['screening_decisions[]'])
    return (
      <div>
        <CheckboxListFilter
          collection={SCREENING_DECISION}
          legend={'Decision'}
          name={'screening-decision'}
          selected={screeningDecisions}
          onChange={(newScreeningDecisions) => this.onChange({
            'screening_decisions[]': newScreeningDecisions,
          })}
        />
      </div>
    )
  }
}

ScreeningsFilter.propTypes = {
  query: React.PropTypes.object,
}

ScreeningsFilter.defaultProps = {
  query: {},
}
