# frozen_string_literal: true

# Investigations Controller handles all service request for
# the creation and modification of investigation objects.
module Api
  module V1
    class InvestigationsController < ApiController # :nodoc:
      respond_to :json

      def screening
        response = FerbAPI.make_api_call(
          session['security_token'],
          ExternalRoutes.ferb_api_investigations_screening(params[:id]),
          :get
        )
        render json: response.body
      end
    end
  end
end
