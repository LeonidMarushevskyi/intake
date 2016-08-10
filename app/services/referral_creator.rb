# frozen_string_literal: true
require 'luid'

# ReferralCreator is a service class which is responsible for creating
# a referral using the API endpoint
class ReferralCreator
  def self.create
    reference = LUID.generate.first
    response = make_api_request_with_params(reference: reference)
    raise 'Error creating referral' if response.status != 201
    response.body
  end

  def self.make_api_request_with_params(referral_params)
    ::API.connection.post do |req|
      req.url '/api/v1/referrals'
      req.headers['Content-Type'] = 'application/json'
      req.body = { referral: referral_params }.to_json
    end
  end
  private_class_method :make_api_request_with_params
end
