<#
Run this script in the project root after you have created a GitHub repo.
Usage:
  .\setup-github-remote.ps1 -RemoteUrl https://github.com/<username>/<repo>.git
#>
param(
  [Parameter(Mandatory=$true)]
  [string]$RemoteUrl
)

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Write-Error "Git is not installed or not available in PATH. Install Git, restart the terminal, then run this script again."
  exit 1
}

Push-Location $PSScriptRoot
try {
  if (-not (Test-Path .git)) {
    git init
  }

  git remote remove origin 2>$null | Out-Null
  git remote add origin $RemoteUrl

  git add -A
  if (-not (git diff --cached --quiet)) {
    git commit -m "chore: prepare publish (vite base, gh-actions, README)"
  }

  git branch -M main
  git push -u origin main
}
finally {
  Pop-Location
}
