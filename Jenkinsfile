pipeline {
    agent any

    environment {
        IMAGE_NAME = "rauniksingh/jenkin-demo"
        EC2_HOST = "34.227.72.164"
        EC2_USER = "ec2-user"
    }

    stages {

        stage('Clone Code') {
            steps {
                git branch: 'main',
                credentialsId: 'github-token',
                url: 'https://github.com/rauniksingh/jenkin-demo.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME:latest .'
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                    echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                    docker push $IMAGE_NAME:latest
                    '''
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                 sshagent(['ec2-prod-key']) {
                      sh """
                          ssh -o StrictHostKeyChecking=no ec2-user@34.227.72.164 '
                              docker pull rauniksingh/jenkin-demo:latest &&
                              docker stop myapp || true &&
                              docker rm myapp || true &&
                           docker run -d --name myapp -p 80:3000 rauniksingh/jenkin-demo:latest
                          '
                      """
                  }
            }
        }
    }
}