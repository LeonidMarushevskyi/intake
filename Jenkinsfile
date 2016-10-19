node {
    checkout scm
    def branch = env.BRANCH_NAME ?: 'master'

    try {
        stage('Test') {
            sh 'make test'
        }

        if (branch == 'master') {
          stage('Build') {
              sh 'make build'
          }

          stage('Release') {
              sh 'make release'
          }

          stage('Publish') {
              sh "make tag latest \$(git rev-parse --short HEAD)"
              withEnv(["DOCKER_USER=${DOCKER_USER}",
                       "DOCKER_PASSWORD=${DOCKER_PASSWORD}"]) {
                  sh "make login"
                  sh "make publish"
              }
          }

          stage('Deploy') {
              sh "printf \$(git rev-parse --short HEAD) > tag.tmp"
              def imageTag = readFile 'tag.tmp'
              build job: DEPLOY_JOB, parameters: [[
                  $class: 'StringParameterValue',
                  name: 'IMAGE_TAG',
                  value: 'cwds/intake:' + imageTag
              ]]
          }
        }
    }
    finally {
        stage ('Reports') {
            step([$class: 'JUnitResultArchiver', testResults: '**/reports/*.xml'])
        }

        stage('Clean') {
            sh 'make clean'
            sh 'make logout'
        }
    }
}
