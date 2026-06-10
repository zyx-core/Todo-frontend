pipeline {
    agent any

    environment {
        IMAGE = "todo-frontend-web:${BUILD_NUMBER}"
        NETWORK = "todo-net"
        FRONTEND_CONT = "todo-frontend-web"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                bat "docker build -t %IMAGE% ."
            }
        }

        stage('Create Network') {
            steps {
                bat "docker network create %NETWORK% 2>nul || true"
            }
        }

        stage('Run Frontend Web') {
            steps {
                bat """
                docker rm -f %FRONTEND_CONT% 2>nul
                docker run -d --name %FRONTEND_CONT% --network %NETWORK% ^
                    -p 4200:80 ^
                    %IMAGE%
                """
            }
        }
    }
}
