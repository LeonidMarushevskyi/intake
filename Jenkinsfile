node('Slave') {
    checkout scm
    def branch = env.BRANCH_NAME ?: 'master'
    def curStage = 'Start'
    def emailList = EMAIL_NOTIFICATION_LIST ?: 'thomas.ramirez@osi.ca.gov'

    try {
        stage('Test') {
            curStage = 'Test'
            sh 'make test'
        }

        if (branch == 'master') {
          stage('Build') {
              curStage = 'Build'
              sh 'make build'
          }

          stage('Release') {
              curStage = 'Release'
              sh 'make release'
          }

          stage('Publish') {
              curStage = 'Publish'
              sh "make tag latest \$(git rev-parse --short HEAD)"
              withEnv(["DOCKER_USER=${DOCKER_USER}",
                       "DOCKER_PASSWORD=${DOCKER_PASSWORD}"]) {
                  sh "make login"
                  sh "make publish"
              }
          }

          stage('Deploy') {
              curStage = 'Deploy'
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
    catch (e) {
        emailext (
            to: emailList,
            subject: "FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' in stage ${curStage}",
            body: """<p>FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' in stage '${curStage}' for branch '${branch}':</p>
                <p>Check console output at &QUOT;<a href='${env.BUILD_URL}'>${env.JOB_NAME} [${env.BUILD_NUMBER}]</a>&QUOT;</p>"""
        )

        slackSend (color: '#FF0000', message: "FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' in stage '${curStage}' for branch '${branch}' (${env.BUILD_URL})")

        throw e
    }
    finally {
        stage ('Reports') {
            step([$class: 'JUnitResultArchiver', testResults: '**/reports/*.xml'])
        }

        stage('Clean') {
            retry(2) {
                sh 'make clean'
            }
            sh 'make logout'
        }
    }
}
