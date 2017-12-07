[![Maintainability](https://api.codeclimate.com/v1/badges/7bf605e7ecb5f268441e/maintainability)](https://codeclimate.com/github/ca-cwds/intake/maintainability)
[![Build Status](https://ci.mycasebook.org/buildStatus/icon?job=intake(CI))](https://ci.mycasebook.org/job/intake(CI)/)

# README

Web application frontend for California CWDS Hotline - Intake 

## Forked from the Casebook Intake Accelerator

## Section 1. Introduction to the Casebook Intake Accelerator

The Casebook Accelerator Toolkit is a collection of Accelerators that are designed to assist agile teams in iteratively developing child welfare products across the country.  Each Accelerator has a publicly accessible repo in GitHub providing tools, components and/or assets to jumpstart an agile development process for child welfare.  

The Intake Accelerator GitHub repository will enable agile development teams to pull the source code, deploy it and build upon it for child welfare purposes.  

The Intake Accelerator is designed to enable the iterative, agile development of a Child Welfare Intake application.

## Section 2. Instructions (v.01)

This README will document necessary steps to get the Intake application up and running.

Intake accelerator repo is the repository that contains all the necessary coding infrastructure and tooling for developers to hit the ground running by deploying a working base application that can be extended through building upon the Intake Accelerator source code.   

### How to Use / Relevant files:
System dependencies: 
* Ruby version: 2.3.1, bundler
* Node version: > 6.3.1, npm
* The accelerator app is built on Rails 5.0.0
* Database creation: This app is a frontend app for intake accelerator and does not host it’s own database. Instead, in “real” environments it integrates with an api. 

### Tools included with the accelerator
* All the features of the latest Rails release(currently at 5.0.0)
* Debugging with pry and other pry-related libraries
* Rspec, Capybara and Selenium for unit and feature testing along with FactoryGirl
* Jasmine and Karma for javascript testing
* Haml set up as the default templating language
* Asset precompilation and packaging use webpack(instead of sprocket)
* Linting tools for ruby, javascript, haml and scss
* Execute the the test suite using: bundle exec rspec spec/
* Run all the lints using: bin/lint

## Section 3. License

The Casebook Intake Accelerator is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

The Casebook Intake Accelerator is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.

See https://www.gnu.org/licenses/agpl.html

## Section 4. Copyright

Copyright (c) 2016 Case Commons, Inc.
