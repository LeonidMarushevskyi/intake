import * as Utils from 'utils/http'
import Immutable from 'immutable'
import React from 'react'

export default class ScreeningEditPage extends React.Component {
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

  setField(fieldSeq, value) {
    const screening = this.state.screening.setIn(fieldSeq, value)
    this.setState({screening: screening})
  }

  render() {
    return (
      <div className='card edit double-gap-top' id='narrative-card'>
        <div className='card-header'>
          <span>Narrative</span>
        </div>
        <div className='card-body'>
          <div className='row'>
            <div className='col-md-6'>
              <label className='no-gap' htmlFor='screening[report_narrative]'>Report Narrative</label>
              <textarea
                name='screening[report_narrative]'
                id='screening[report_narrative]'
                value={this.state.screening.get('report_narrative') || ''}
                onChange={(event) => this.setField(['report_narrative'], event.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ScreeningEditPage.propTypes = {
  params: React.PropTypes.object.isRequired,
}
