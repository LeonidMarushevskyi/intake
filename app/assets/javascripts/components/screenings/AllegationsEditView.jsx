import React from 'react'
import AllegationRow from 'components/screenings/AllegationRow'

const AllegationsEditView = ({allegations, onSave, onCancel, onChange}) => {
  const groupedAllegations = (allegations) => (
    allegations.groupBy((allegation) => allegation.get('victim'))
  )

  const setRenderFlags = (allegations) => {
    const firstIndex = 0
    return allegations.map((allegation, index) => {
      const displayVictim = (index === firstIndex)
      return allegation.set('display_victim', displayVictim)
    })
  }

  const allegationsWithViewFlag = (allegations) => {
    const flattenDepth = 1
    const groupedMap = groupedAllegations(allegations)
      .map((allegations, _victim) => setRenderFlags(allegations))
    return groupedMap.toList().flatten(flattenDepth)
  }

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
                {allegationsWithViewFlag(allegations).map((allegation, index) =>
                  <AllegationRow
                    displayVictim={allegation.get('display_victim')}
                    key={index}
                    victim={allegation.get('victim')}
                    perpetrator={allegation.get('perpetrator')}
                    onChange={onChange}
                  />
                )}
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
  onChange: React.PropTypes.func.isRequired,
  onSave: React.PropTypes.func.isRequired,
}

export default AllegationsEditView
