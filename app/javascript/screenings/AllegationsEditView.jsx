import AllegationRow from 'screenings/AllegationRow'
import AlertErrorMessage from 'common/AlertErrorMessage'
import PropTypes from 'prop-types'
import React from 'react'
import ScreeningCardHeader from 'screenings/ScreeningCardHeader'

const AllegationsEditView = ({
  allegations,
  onSave,
  onCancel,
  onChange,
  alertErrorMessage,
  required,
}) => {
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
    <div className={'card edit double-gap-top'} id='allegations-card'>
      <ScreeningCardHeader
        onEdit={() => {}}
        title='Allegations'
        showEdit={false}
      />
      <div className='card-body no-pad-top'>
        { alertErrorMessage && <AlertErrorMessage message={alertErrorMessage} /> }
        <div className='row'>
          <div className='col-md-12'>
            <table className='table table-hover'>
              <thead>
                <tr>
                  <th scope='col'>Alleged Victim/Children</th>
                  <th scope='col'>Alleged Perpetrator</th>
                  <th scope='col'>Allegation(s){required && ' (Required)'}</th>
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
                    allegationTypes={allegation.get('allegation_types')}
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
  alertErrorMessage: PropTypes.string,
  allegations: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  required: PropTypes.bool.isRequired,
}

export default AllegationsEditView
