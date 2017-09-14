# frozen_string_literal: true

# System codes Controller handles loading legacy system codes
# from the lov service
module Api
  module V1
    class SystemCodesController < ApiController # :nodoc:
      respond_to :json

      def index
        response = FerbAPI.make_api_call(
          session['security_token'],
          ExternalRoutes.ferb_api_lov,
          :get
        )
        render json: response.body, status: response.status
      end
    end
  end
end
