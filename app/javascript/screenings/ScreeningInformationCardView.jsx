import PropTypes from 'prop-types'
import React from 'react'
import ScreeningCardHeader from 'screenings/ScreeningCardHeader'
import ScreeningInformationFormContainer from 'screenings/screeningInformation/ScreeningInformationFormContainer'
import ScreeningInformationShowContainer from 'screenings/screeningInformation/ScreeningInformationShowContainer'

export default class ScreeningInformationCardView extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {mode: this.props.mode}
  }

  render() {
    const {mode} = this.state
    const showEdit = this.props.editable && mode === 'show'
    const onEdit = () => this.setState({mode: 'edit'})
    const toggleShow = () => this.setState({mode: 'show'})
    return (
      <div className={`card ${mode} double-gap-top`} id='screening-information-card'>
        <ScreeningCardHeader onEdit={onEdit} title='Screening Information' showEdit={showEdit}/>
        {mode === 'edit' && <ScreeningInformationFormContainer toggleShow={toggleShow} />}
        {mode === 'show' && <ScreeningInformationShowContainer />}
      </div>
    )
  }
}

ScreeningInformationCardView.propTypes = {
  editable: PropTypes.bool.isRequired,
  mode: PropTypes.string,
}
