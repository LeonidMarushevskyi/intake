# frozen_string_literal: true

require 'rails_helper'

describe ApiError do
  it 'returns 500 by default' do
    error_class = ApiError.new({})

    expect(error_class.api_error[:response_body]).to eq('Internal Server Error')
    expect(error_class.api_error[:http_code]).to eq(500)
  end

  it 'returns the correct exception information passed in' do
    error_class = ApiError.new(
      message: 'This HTTP status is used as an Easter egg in some websites',
      sent_attributes: 'brew coffee',
      url: '/path/to/somewhere',
      method: :get,
      response: OpenStruct.new(
        status: 418,
        body: "I'm a teapot"
      )
    )

    expect(error_class.message).to eq('This HTTP status is used as an Easter egg in some websites')
    expect(error_class.api_error[:sent_attributes]).to eq('brew coffee')
    expect(error_class.api_error[:url]).to eq('/path/to/somewhere')
    expect(error_class.api_error[:method]).to eq(:get)
    expect(error_class.api_error[:response_body]).to eq("I'm a teapot")
  end
end
