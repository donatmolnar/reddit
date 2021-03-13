pipeline {
    agent any
    stages {        
        stage('Building Docker image') {
            options {
              timeout(time: 3, unit: 'MINUTES')
            }
            steps {
                echo 'Building Docker image'
                sh 'docker build -t donatmolnar/redditjenkins:1.1.0 .'
            }
        }
        stage('Pushing image to dockerhub') {
            options {
              timeout(time: 3, unit: 'MINUTES')
            }
            environment {
                dockerhub = credentials('dockerhub')
            }
            steps {
                echo 'Pushing to dockerhub'
                sh 'docker login -u ${dockerhub_USR} -p ${dockerhub_PSW}'
                sh 'docker push donatmolnar/reddit:1.1.0'
            }
        }
    }
}