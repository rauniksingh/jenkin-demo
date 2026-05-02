pipeline {
    agent any

    environment {
        IMAGE_NAME = "yourdockerhubusername/myapp"
        EC2_HOST = "your-ec2-public-ip"
        EC2_USER = "ec2-user"
    }

    stages {

        stage('Clone Code') {
            steps {
                git branch: 'main',
                url: 'git@github.com:yourusername/yourrepo.git'
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
                sh """
                ssh -o StrictHostKeyChecking=no $EC2_USER@$EC2_HOST '
                    docker pull $IMAGE_NAME:latest &&
                    docker stop myapp || true &&
                    docker rm myapp || true &&
                    docker run -d --name myapp -p 80:3000 $IMAGE_NAME:latest
                '
                """
            }
        }
    }
}