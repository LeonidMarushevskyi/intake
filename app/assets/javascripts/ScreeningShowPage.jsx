import * as Utils from 'utils/http'
import Immutable from 'immutable'
import React from 'react'

export default class ScreeningShowPage extends React.Component {
  constructor() {
    super(...arguments)
    this.state = {
      screening: Immutable.fromJS({
        report_narrative: '',
      }),
    }

    this.fetch = this.fetch.bind(this)
  }

  componentDidMount() {
    this.fetch()
  }

  fetch() {
    const {params} = this.props
    const xhr = Utils.request('GET', `/screenings/${params.id}.json`)
    xhr.done((xhrResp) => {
      this.setState({screening: Immutable.fromJS(xhrResp.responseJSON)})
    })
  }

  render() {
    return (
      <div className='card double-gap-top' id='narrative-card'>
        <div className='card-header'>
          <span>Narrative</span>
        </div>
        <div className='card-body'>
          <div className='row'>
            <div className='col-md-6'>
              <label className='no-gap'>Report Narrative</label>
              <div className='c-gray'>{this.state.screening.get('report_narrative')}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ScreeningShowPage.propTypes = {
  params: React.PropTypes.object.isRequired,
}
