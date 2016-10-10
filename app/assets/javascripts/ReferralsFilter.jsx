import CheckboxListFilter from 'CheckboxListFilter'
import React from 'react'
import ResponseTime from 'ResponseTime'
import ScreeningDecision from 'ScreeningDecision'
import {browserHistory} from 'react-router'

export default class ReferralsFilter extends React.Component {
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
          collection={ResponseTime}
          legend={'Response Time'}
          name={'response-time'}
          selected={responseTimes}
          onChange={(newResponseTimes) => this.onChange({
            'response_times[]': newResponseTimes,
            'screening_decisions[]': screeningDecisions,
          })}
        />
        <CheckboxListFilter
          collection={ScreeningDecision}
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

ReferralsFilter.propTypes = {
  query: React.PropTypes.object,
}

ReferralsFilter.defaultProps = {
  query: {},
}
