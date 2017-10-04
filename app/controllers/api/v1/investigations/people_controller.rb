# frozen_string_literal: true

# Investigations Controller handles all service request for
# the creation and modification of investigation objects.
module Api
  module V1
    module Investigations
      class PeopleController < ApiController # :nodoc:
        respond_to :json

        def index
          response = FerbAPI.make_api_call(
            session['security_token'],
            ExternalRoutes.ferb_api_investigations_people_path(params[:investigation_id]),
            :get
          )
          render json: response.body
        end
      end
    end
  end
end
