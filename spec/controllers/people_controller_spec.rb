# frozen_string_literal: true
require 'rails_helper'

describe PeopleController do
  describe '#create' do
    it 'Creates a new person' do
      person = {
        first_name: 'Homer',
        last_name: 'Simpson',
        gender: 'male',
        date_of_birth: '05/29/1990',
        ssn: '123-23-1234',
        address: {
          street_address: '123 fake st',
          city: 'Springfield',
          state: 'NY',
          zip: '12345'
        }
      }.with_indifferent_access
      allow(PersonCreator).to receive(:create).and_return(person)
      post :create
      assert_response :success
    end
  end
end
