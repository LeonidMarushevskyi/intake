import CheckboxListFilter from 'components/common/CheckboxListFilter'
import React from 'react'
import RESPONSE_TIME from 'ResponseTime'
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
    var responseTimes = this.valueAsArray(this.props.query['response_times[]'])
    var screeningDecisions = this.valueAsArray(this.props.query['screening_decisions[]'])
    return (
      <div>
        <CheckboxListFilter
          collection={RESPONSE_TIME}
          legend={'Response Time'}
          name={'response-time'}
          selected={responseTimes}
          onChange={(newResponseTimes) => this.onChange({
            'response_times[]': newResponseTimes,
            'screening_decisions[]': screeningDecisions,
          })}
        />
        <CheckboxListFilter
          collection={SCREENING_DECISION}
          legend={'Decision'}
          name={'screening-decision'}
          selected={screeningDecisions}
          onChange={(newScreeningDecisions) => this.onChange({
            'response_times[]': responseTimes,
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
