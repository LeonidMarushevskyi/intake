# frozen_string_literal: true

Rails.application.routes.draw do
  root 'welcome#index'
  resources :style_guide, only: [:index, :show]
  resources :referrals, only: [:create, :edit, :show, :update]
  resources :people, only: [:new, :create, :show]
end
