# frozen_string_literal: true

# People Controller handles all service request for
# the creation and modification of person objects.
class PeopleController < ApplicationController
  def new
    respond_to do |format|
      format.html do
        render :show
      end
    end
  end

  def create
    respond_to do |format|
      format.json do
        person = Person.new(person_params.to_h)
        created_person = PersonRepository.create(person)
        render json: created_person
      end
    end
  end

  def edit
    respond_to do |format|
      format.html do
        render :show
      end
    end
  end

  def show
    respond_to do |format|
      format.html do
        render :show
      end
      format.json do
        person = PersonRepository.find(params[:id])
        render json: person
      end
    end
  end

  def update
    respond_to do |format|
      format.json do
        person = Person.new(person_params.to_h)
        updated_person = PersonRepository.update(person)
        render json: updated_person
      end
    end
  end

  def search
    people_results = PersonRepository.search(params[:search_term])
    render json: people_results
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
        :race
      ]
    )
  end
end
