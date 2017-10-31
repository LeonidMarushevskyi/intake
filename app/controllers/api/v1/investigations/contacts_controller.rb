# frozen_string_literal: true

# Investigations Contacts Controller handles all service request for
# the creation and modification of investigation contact objects.
module Api
  module V1
    module Investigations
      class ContactsController < ApiController # :nodoc:
        respond_to :json

        PERMITTED_PARAMS = [
          :started_at,
          :purpose,
          :status,
          :note,
          :communication_method,
          :location,
          people: [legacy_descriptor: %i[legacy_id legacy_table_name]]
        ].freeze

        def create
          contact = FerbAPI.make_api_call(
            session['security_token'],
            ExternalRoutes.ferb_api_investigations_contacts_path(investigation_id),
            :post,
            contact_params.as_json
          )
          render json: contact.body, status: contact.status
        end

        def show
          contact = FerbAPI.make_api_call(
            session['security_token'],
            ExternalRoutes.ferb_api_investigations_contact_path(investigation_id, params[:id]),
            :get
          )
          render json: contact.body, status: contact.status
        end

        def update
          contact = FerbAPI.make_api_call(
            session['security_token'],
            ExternalRoutes.ferb_api_investigations_contact_path(investigation_id, params[:id]),
            :put,
            contact_params.as_json
          )
          render json: contact.body, status: contact.status
        end

        private

        def investigation_id
          params[:investigation_id]
        end

        def contact_params
          params.require(:contact).permit(*PERMITTED_PARAMS)
        end
      end
    end
  end
end
