# frozen_string_literal: true
require File.join(File.dirname(__FILE__), 'routes/inactive_release_one_constraint')

Rails.application.routes.draw do
  root 'home#index'
  resources :style_guide,
    only: [:index, :show],
    constraints: Routes::InactiveReleaseOneConstraint

  resources :screenings,
    only: [:show, :edit, :index],
    constraints: Routes::InactiveReleaseOneConstraint do
  end

  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      resources :screenings,
        only: [:show, :create, :update, :index],
        constraints: Routes::InactiveReleaseOneConstraint do
      end

      resources :participants, only: [:create, :destroy]

      resource :people, only: [:search] do
        collection do
          get 'search'
        end
      end

      resources :people,
        only: [:create, :update, :show],
        constraints: Routes::InactiveReleaseOneConstraint
    end
  end

  resources :people,
    only: [:new, :edit, :show],
    constraints: Routes::InactiveReleaseOneConstraint
end
