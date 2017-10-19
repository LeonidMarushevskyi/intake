import React from 'react'

const ScreeningSubmitButtonWithModal = () => (
  <div className='row'>
    <div className='centered double-gap-top double-gap-bottom'>
      <button
        className='btn btn-primary'
        data-toggle='modal'
        data-target='#submitModal'
      >
        Submit
      </button>
    </div>
    <div aria-label='submit modal confirmation' className='modal fade' id='submitModal'>
      <div className='modal-dialog' role='document'>
        <div className='modal-content'>
          <div className='modal-body'>
            <p>
              Congratulations! You have completed the process to submit a screening.
            </p>
            <p>
              This is just a learning environment. If your Decision was to promote to referral,
              this does NOT create an actual referral and it will not appear in CWS/CMS.
            </p>
          </div>
          <div className='modal-footer'>
            <div className='row'>
              <div className='centered'>
                <a href='/' >
                  <button className='btn btn-primary' href='/' type='button'>Proceed</button>
                </a>
                <button aria-label='Close' className='btn btn-default' data-dismiss='modal' type='button'>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

export default ScreeningSubmitButtonWithModal

