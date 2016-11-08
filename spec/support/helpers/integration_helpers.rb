# frozen_string_literal: true

module IntegrationHelpers
  def faraday_helper(&block)
    faraday_stub = Faraday.new do |builder|
      builder.adapter :test, &block
    end
    allow(API).to receive(:connection).and_return(faraday_stub)
  end
end

RSpec.configure do |config|
  config.include IntegrationHelpers, type: :feature
end
