# frozen_string_literal: true

# People Controller handles all service request for
# the creation and modification of person objects.
class PeopleController < ApplicationController
  def new
  end

  def create
    @person = PersonCreator.create(params[:person])
    render :show
  end
end
