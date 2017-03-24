import React from 'react'
import AllegationRow from 'components/screenings/AllegationRow'

export default class AllegationsCardView extends React.Component {
  constructor(props, context) {
    super(props, context)
  }

  renderAllegations(allegations) {
    return this.groupedAllegations(allegations)
      .map((allegations) => this.renderAllegation(allegations))
  }

  groupedAllegations(allegations) {
    return allegations.groupBy((allegation) => allegation.get('victim'))
  }

  renderAllegation(allegations) {
    const firstIndex = 0
    return allegations.map((allegation, index) => {
      const displayVictim = (index === firstIndex)
      return (
        <AllegationRow
          displayVictim={displayVictim}
          key={index}
          victim={allegation.get('victim')}
          perpetrator={allegation.get('perpetrator')}
        />
      )
    })
  }

  render() {
    return (
      <div className='card edit double-gap-top' id='allegations-card'>
        <div className='card-header'>
          <span>Allegations</span>
        </div>
        <div className='card-body no-pad-top'>
          <div className='row'>
            <div className='table-responsive'>
              <table className='table table-hover'>
                <thead>
                  <tr>
                    <th scope='col'>Alleged Victim/Children</th>
                    <th scope='col'>Alleged Perpetrator</th>
                    <th scope='col'>Allegation(s)</th>
                  </tr>
                </thead>
                <tbody>
                  {this.renderAllegations(this.props.allegations)}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

AllegationsCardView.propTypes = {
  allegations: React.PropTypes.object.isRequired,
}
