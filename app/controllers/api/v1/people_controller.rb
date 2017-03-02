# frozen_string_literal: true

# Participants Controller handles all service request for
# the creation and modification of screening participant objects.
module Api
  module V1
    class PeopleController < ApiController # :nodoc:
      respond_to :json

      def create
        person = Person.new(person_params.to_h)
        created_person = PersonRepository.create(person)
        render json: created_person
      end

      def update
        person = Person.new(person_params.to_h)
        updated_person = PersonRepository.update(person)
        render json: updated_person
      end

      def search
        people_results = PersonSearchRepository.search(params[:search_term])
        render json: people_results
      end

      def show
        person = PersonRepository.find(params[:id])
        render json: person
      end

      # rubocop:disable MethodLength
      def person_params
        params.require(:person).permit(
          :id,
          :first_name,
          :middle_name,
          :last_name,
          :name_suffix,
          :gender,
          :date_of_birth,
          :ssn,
          addresses: [
            :id,
            :street_address,
            :city,
            :state,
            :zip,
            :type
          ],
          phone_numbers: [
            :id,
            :number,
            :type
          ],
          languages: [],
          races: [
            :race,
            :race_detail
          ],
          ethnicity: [
            :hispanic_latino_origin,
            :ethnicity_detail
          ]
        )
      end
    end
  end
end
