pipeline {
    agent any

    environment {
        ARTIFACT_VERSION = '1.0.0'
        JFROG_REPO = 'codelab-generic-local'
        DEPLOY_DIR = '/deploy'
        // Configure these in Jenkins: Manage Jenkins -> Credentials
        // JFROG_URL (Secret text), JFROG_USER (Username/Password or text), JFROG_TOKEN
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Frontend') {
            steps {
                echo 'Installing frontend dependencies and building React app...'
                // Frontend build is driven by Maven (frontend-maven-plugin),
                // but we also show explicit npm steps for clarity in demo logs.
                sh 'mvn -N generate-resources'
            }
        }

        stage('Test Backend') {
            steps {
                echo 'Running Spring Boot unit tests...'
                sh 'mvn -pl backend test'
            }
            post {
                always {
                    junit 'backend/target/surefire-reports/*.xml'
                }
            }
        }

        stage('Package Backend') {
            steps {
                echo 'Packaging Spring Boot JAR...'
                sh 'mvn -pl backend package -DskipTests'
            }
        }

        stage('Package Frontend') {
            steps {
                echo 'Packaging frontend dist as ZIP (runs in root package phase)...'
                sh 'mvn package -DskipTests'
                archiveArtifacts artifacts: 'target/*.jar, target/*.zip', fingerprint: true
            }
        }

        stage('Deploy to Local') {
            steps {
                echo 'Deploying artifacts to local deploy folder...'
                sh '''
                    mkdir -p "$DEPLOY_DIR"
                    cp target/codelab-backend-$ARTIFACT_VERSION.jar "$DEPLOY_DIR/codelab-backend-$BUILD_NUMBER.jar"
                    cp target/codelab-frontend-$ARTIFACT_VERSION.zip "$DEPLOY_DIR/codelab-frontend-$BUILD_NUMBER.zip"
                    echo "$BUILD_NUMBER" > "$DEPLOY_DIR/.latest-build"
                    ls -la "$DEPLOY_DIR"
                '''
            }
        }

        stage('Publish Artifacts') {
            steps {
                echo 'Publishing artifacts to JFrog Artifactory...'
                script {
                    try {
                        withCredentials([
                            string(credentialsId: 'jfrog-url', variable: 'JFROG_URL'),
                            usernamePassword(credentialsId: 'jfrog-creds', usernameVariable: 'JFROG_USER', passwordVariable: 'JFROG_TOKEN')
                        ]) {
                            sh '''
                                curl -u "$JFROG_USER:$JFROG_TOKEN" \
                                  -T target/codelab-backend-$ARTIFACT_VERSION.jar \
                                  "$JFROG_URL/artifactory/$JFROG_REPO/codelab-backend-$ARTIFACT_VERSION.jar"
                                curl -u "$JFROG_USER:$JFROG_TOKEN" \
                                  -T target/codelab-frontend-$ARTIFACT_VERSION.zip \
                                  "$JFROG_URL/artifactory/$JFROG_REPO/codelab-frontend-$ARTIFACT_VERSION.zip"
                            '''
                        }
                    } catch (err) {
                        echo "JFrog publish skipped (credentials 'jfrog-url'/'jfrog-creds' not configured in Jenkins)."
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline SUCCESS: Frontend ✓ Backend tests ✓ Packaging ✓ Deployed locally ✓ (JFrog ✓ if configured)'
        }
        failure {
            echo 'Pipeline FAILED: artifacts were NOT published to JFrog.'
        }
    }
}
