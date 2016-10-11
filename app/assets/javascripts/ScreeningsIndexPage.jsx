import React from 'react'
import ScreeningsFilter from 'ScreeningsFilter'
import ScreeningsTable from 'ScreeningsTable'
import * as Utils from 'utils/http'

export default class ScreeningsIndexPage extends React.Component {
  constructor() {
    super(...arguments)
    this.state = {
      screenings: [],
    }
    this.updateIndex = this.updateIndex.bind(this)
  }

  componentDidMount() {
    this.updateIndex()
  }

  componentDidUpdate(prevProps, _prevState) {
    if (prevProps.location !== this.props.location) {
      this.updateIndex()
    }
  }

  updateIndex() {
    const {pathname, search} = this.props.location
    const url = `${pathname}.json${search}`
    const xhr = Utils.request('GET', url, null, null)
    xhr.done((xhrResp) => {
      this.setState({screenings: xhrResp.responseJSON})
    })
  }

  render() {
    const {query} = this.props.location
    return (
      <div>
        <div className='col-md-3'>
          <ScreeningsFilter query={query} />
        </div>
        <div className='col-md-9'>
          <ScreeningsTable screenings={this.state.screenings} />
        </div>
      </div>
    )
  }
}

ScreeningsIndexPage.propTypes = {
  location: React.PropTypes.object,
}
