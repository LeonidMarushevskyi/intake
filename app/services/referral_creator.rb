require 'luid'

class ReferralCreator
  def self.create
    reference = LUID.generate.first
    response = ::API.connection.post do |req|
      req.url '/api/v1/referrals'
      req.headers['Content-Type'] = 'application/json'
      req.body = { referral: { reference: reference } }.to_json
    end
    if response.status == 201
      response.body
    else
      raise 'Error creating referral'
    end
  end
end
