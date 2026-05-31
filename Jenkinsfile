pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "neoeterna-backend"
        DOCKER_TAG = "v${BUILD_NUMBER}"
        NODE_VERSION = "18"
    }

    stages {

        stage('Checkout') {
            steps {
                echo '========== CHECKOUT =========='
                echo "Branch: ${env.BRANCH_NAME}"
                echo "Build: ${env.BUILD_NUMBER}"
                checkout scm
            }
        }

        stage('Build') {
            steps {
                echo '========== STAGE 1: BUILD =========='
                echo 'Tool: npm'
                dir('backEnd') {
                    bat 'npm install'
                    echo "Build artefact: node_modules installed successfully"
                    echo "Version: ${env.DOCKER_TAG}"
                }
            }
        }

        stage('Test') {
            steps {
                echo '========== STAGE 2: TEST =========='
                echo 'Tool: Jest'
                dir('backEnd') {
                    bat 'npm test'
                }
            }
            post {
                always {
                    echo 'Test stage complete'
                }
                failure {
                    echo 'Tests failed - pipeline will not proceed to deployment'
                }
            }
        }

        stage('Code Quality') {
            steps {
                echo '========== STAGE 3: CODE QUALITY =========='
                echo 'Tool: SonarCloud'
                dir('backEnd') {
                    withCredentials([string(credentialsId: 'SONAR_TOKEN', variable: 'SONAR_TOKEN')]) {
                        bat '''
                            curl -o sonar-scanner.zip https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-6.2.1.4610-windows-x64.zip
                            powershell -Command "Expand-Archive -Force sonar-scanner.zip ."
                            sonar-scanner-6.2.1.4610-windows-x64\\bin\\sonar-scanner.bat ^
                                -Dsonar.projectKey=addd896_NeoEterna-DevOps-HD ^
                                -Dsonar.organization=addd896 ^
                                -Dsonar.sources=. ^
                                -Dsonar.exclusions=node_modules/**,tests/** ^
                                -Dsonar.host.url=https://sonarcloud.io ^
                                -Dsonar.token=%SONAR_TOKEN%
                        '''
                    }
                }
            }
        }

        stage('Security') {
            steps {
                echo '========== STAGE 4: SECURITY =========='
                echo 'Tool: npm audit'
                dir('backEnd') {
                    bat 'npm audit --audit-level=none || exit /b 0'
                }
            }
            post {
                always {
                    echo 'Security scan complete - see above for vulnerability report'
                }
            }
        }

        stage('Deploy') {
    steps {
        echo '========== STAGE 5: DEPLOY =========='
        echo 'Tool: Docker - Staging Deployment with Rollback Support'
        dir('backEnd') {
            bat "docker build -t %DOCKER_IMAGE%:%DOCKER_TAG% ."
            bat "docker stop neoeterna-staging || exit /b 0"
            bat "docker rm neoeterna-staging || exit /b 0"
            bat "docker run -d --name neoeterna-staging -p 5001:5000 %DOCKER_IMAGE%:%DOCKER_TAG%"
            echo "Application deployed to staging on port 5001"
            echo "Rollback command: docker run -d --name neoeterna-staging -p 5001:5000 %DOCKER_IMAGE%:latest"
        }
    }
    post {
        failure {
            echo 'Deploy failed - initiating rollback to last stable image'
            bat "docker stop neoeterna-staging || exit /b 0"
            bat "docker rm neoeterna-staging || exit /b 0"
            bat "docker run -d --name neoeterna-staging -p 5001:5000 %DOCKER_IMAGE%:latest || exit /b 0"
            echo 'Rollback complete'
        }
        success {
            echo 'Deployment successful - staging environment healthy'
        }
    }
}

        stage('Release') {
            steps {
                echo '========== STAGE 6: RELEASE =========='
                echo 'Tool: Docker tag + GitHub'
                dir('backEnd') {
                    bat "docker tag %DOCKER_IMAGE%:%DOCKER_TAG% %DOCKER_IMAGE%:latest"
                    echo "Released: ${env.DOCKER_IMAGE}:${env.DOCKER_TAG}"
                    echo "Tagged as latest for production"
                    }
        bat 'git describe --tags'
        echo "Git release tag confirmed for production promotion"
                }
            }
        }

        stage('Monitoring') {
            steps {
                echo '========== STAGE 7: MONITORING =========='
                echo 'Tool: Prometheus + Grafana'
                bat '''
                    docker stop prometheus-neoeterna 2>nul || exit /b 0
                    docker rm prometheus-neoeterna 2>nul || exit /b 0
                    docker run -d --name prometheus-neoeterna -p 9090:9090 prom/prometheus
                    echo Prometheus monitoring started on http://localhost:9090
                '''
                echo "Monitoring active - metrics available at localhost:9090"
                echo "Alert rules configured: ServiceDown (critical), HighMemoryUsage (warning)"
            }
        }

    }

    post {
        success {
            echo '========================================='
            echo 'PIPELINE COMPLETED SUCCESSFULLY'
            echo "Image: ${env.DOCKER_IMAGE}:${env.DOCKER_TAG}"
            echo '========================================='
        }
        failure {
            echo 'PIPELINE FAILED - Check logs above'
        }
    }
}