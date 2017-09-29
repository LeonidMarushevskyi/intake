# frozen_string_literal: true

# Investigations Contacts Controller handles all service request for
# the creation and modification of investigation contact objects.
module Api
  module V1
    module Investigations
      class ContactsController < ApiController # :nodoc:
        respond_to :json

        PERMITTED_PARAMS = %i[
          started_at
          purpose
          status
          note
          communication_method
          location
        ].freeze

        def create
          contact = FerbAPI.make_api_call(
            session['security_token'],
            ExternalRoutes.ferb_api_investigations_contacts(params[:investigation_id]),
            :post,
            contact_params.as_json
          )
          render json: contact.body, status: contact.status
        end

        private

        def contact_params
          params.require(:contact).permit(*PERMITTED_PARAMS)
        end
      end
    end
  end
end
