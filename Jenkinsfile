node {
    checkout scm

    try {
        stage('Test') {
            sh 'make test'    
        }
        
        stage('Build') {
            sh 'make build'    
        }
        
        stage('Release') {
            sh 'make release'    
        }
        
        stage('Publish') {
            sh "make tag latest \$(git rev-parse --short HEAD) \$(git tag --points-at HEAD)"
            sh "make buildtag master \$(git tag --points-at HEAD)"
            withEnv(["DOCKER_USER=${DOCKER_USER}",
                     "DOCKER_PASSWORD=${DOCKER_PASSWORD}",
                     "DOCKER_EMAIL=${DOCKER_EMAIL}"]) {    
                sh "make login"
                sh "make publish"
            }
        }
        
        stage('Deploy release') {
            sh "printf \$(git rev-parse --short HEAD) > tag.tmp"
            def imageTag = readFile 'tag.tmp'
            build job: DEPLOY_JOB, parameters: [[
                $class: 'StringParameterValue',
                name: 'IMAGE_TAG',
                value: 'jmenga/todobackend:' + imageTag
            ]]    
        }
    }
    finally {
        // stage ('Reports') {
        //     step([$class: 'JUnitResultArchiver', testResults: '**/reports/*.xml'])
        // }
        
        stage('Clean') {
            sh 'make clean'
            sh 'make logout'    
        }
    }
}