import React from 'react'
import AllegationRow from 'components/screenings/AllegationRow'

const AllegationsEditView = ({allegations, onSave, onCancel}) => {
  const groupedAllegations = (allegations) => (
    allegations.groupBy((allegation) => allegation.get('victim'))
  )

  const renderAllegation = (allegations) => {
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

  const renderAllegations = (allegations) => (
    groupedAllegations(allegations).map((allegations) => renderAllegation(allegations))
  )

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
                {renderAllegations(allegations)}
              </tbody>
            </table>
          </div>
        </div>
        <div className='row'>
          <div className='centered'>
            <button className='btn btn-primary' onClick={onSave}>Save</button>
            <button className='btn btn-default' onClick={onCancel}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}

AllegationsEditView.propTypes = {
  allegations: React.PropTypes.object.isRequired,
  onCancel: React.PropTypes.func.isRequired,
  onSave: React.PropTypes.func.isRequired,
}

export default AllegationsEditView
