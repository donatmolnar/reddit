pipeline {
    agent any
    stages {        
        stage('Building Docker image') {
            options {
              timeout(time: 3, unit: 'MINUTES')
            }
            steps {
                echo 'Building Docker image'
                sh 'docker build -t donatmolnar/redditjenkins:1.0.0 .'
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
                sh 'sudo docker login'
                sh '${dockerhub_USR}'
                sh '${dockerhub_PSW}'
                sh 'sudo docker push donatmolnar/redditjenkins:1.0.0'
            }
        }
    }
}