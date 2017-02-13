import React from 'react'
import ScreeningsFilter from 'components/screenings/ScreeningsFilter'
import ScreeningsTable from 'components/screenings/ScreeningsTable'
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
    const url = `/api/v1/${pathname}${search}`
    Utils.request('GET', url)
      .then((jsonResponse) => {
        this.setState({screenings: jsonResponse})
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
