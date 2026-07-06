$ErrorActionPreference = "Stop"

Write-Host "=========================================="
Write-Host "   CityPulse Google Cloud Deploy Script   "
Write-Host "=========================================="
Write-Host ""

$gcloudPath = "$env:USERPROFILE\google-cloud-sdk\bin\gcloud.cmd"
$projectID = "citypulse-501614"

# 1. Install Google Cloud CLI if not present
if (!(Test-Path $gcloudPath)) {
    Write-Host "Installing Google Cloud CLI... (this will take a few minutes)"
    $zipPath = "$env:TEMP\google-cloud-cli.zip"
    $installDir = "$env:USERPROFILE"
    
    Write-Host "Downloading..."
    Invoke-WebRequest -Uri "https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-cli-windows-x86_64.zip" -OutFile $zipPath
    
    Write-Host "Extracting to $installDir..."
    Expand-Archive -Path $zipPath -DestinationPath $installDir -Force
    
    Write-Host "Running local installer..."
    & "$env:USERPROFILE\google-cloud-sdk\install.bat" --quiet --path-update=true
} else {
    Write-Host "Google Cloud CLI is already installed at $gcloudPath"
}

# 2. Authenticate
Write-Host ""
Write-Host "=========================================="
Write-Host "Authentication Required!"
Write-Host "A browser window will open. Please log in to your Google Account that owns project: $projectID"
Write-Host "=========================================="
& $gcloudPath auth login

# 3. Configure Project
Write-Host "Configuring Project..."
& $gcloudPath config set project $projectID

# 4. Enable APIs
Write-Host "Enabling required APIs (Cloud Run, Cloud Build, AI Platform)..."
& $gcloudPath services enable run.googleapis.com cloudbuild.googleapis.com aiplatform.googleapis.com

# 5. Deploy Backend
Write-Host "Deploying Backend to Cloud Run..."
Set-Location -Path "$PSScriptRoot\backend"
& $gcloudPath run deploy citypulse-backend `
    --source . `
    --region us-central1 `
    --allow-unauthenticated `
    --set-env-vars="NODE_ENV=production,GCP_PROJECT_ID=$projectID"

Write-Host ""
Write-Host "=========================================="
Write-Host "Deployment Complete!"
Write-Host "Check the output above for your Cloud Run Service URL."
Write-Host "=========================================="
Write-Host "Press any key to exit..."
$Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") | Out-Null
