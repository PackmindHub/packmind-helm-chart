# SonarCloud Setup for Packmind Monorepo

This document explains the SonarCloud configuration that has been added to ensure quality gates are blocking in the CI pipeline.

## Overview

SonarCloud analysis has been integrated into the CI pipeline to ensure code quality standards are maintained. The analysis now runs on:
- Pull requests to the `main` branch
- Pushes to the `main` branch

## Configuration

### SonarCloud Project Settings

The SonarCloud project is configured with the following settings in `sonar-project.properties`:

- **Project Key**: `packmindhub_packmind-monorepo`
- **Organization**: `packmindhub`
- **Quality Gate Wait**: Enabled (blocking)
- **Timeout**: 300 seconds

### Files Analyzed

The analysis includes:
- Helm charts (`.yaml`, `.yml` files)
- Shell scripts (`.sh` files)
- Configuration files
- Documentation files

### Files Excluded

The following files/directories are excluded from analysis:
- `node_modules/`
- `.git/`
- `charts/**/charts/**` (dependency charts)
- `dev-charts/`

## Required Secrets

To enable SonarCloud analysis, the following GitHub secrets must be configured:

### `SONAR_TOKEN`
1. Go to [SonarCloud](https://sonarcloud.io)
2. Navigate to your organization (packmindhub)
3. Go to **Security** > **Security Tokens**
4. Generate a new token with the necessary permissions
5. Add this token as a repository secret named `SONAR_TOKEN`

### `GITHUB_TOKEN`
This is automatically provided by GitHub Actions and doesn't need manual configuration.

## Quality Gate Enforcement

The CI pipeline is configured to:
1. Run SonarCloud analysis on every PR and push to main
2. Wait for the quality gate result (`sonar.qualitygate.wait=true`)
3. **Fail the CI pipeline** if the quality gate fails
4. Block the helm chart testing job until SonarCloud passes

## How It Works

1. **SonarCloud Job**: Runs first and performs the analysis
2. **Quality Gate Check**: Automatically enforced by the SonarCloud GitHub Action
3. **Dependent Jobs**: The `release` job (helm chart testing) only runs if SonarCloud passes
4. **Blocking Behavior**: If quality gate fails, the entire CI pipeline fails

## Troubleshooting

### Common Issues

1. **Missing SONAR_TOKEN**: Ensure the secret is properly configured in GitHub repository settings
2. **Quality Gate Timeout**: If analysis takes longer than 5 minutes, check SonarCloud dashboard for issues
3. **Fork PRs**: SonarCloud analysis only runs on PRs from the same repository (not forks) for security reasons

### Manual Quality Gate Check

If you need to manually check the quality gate status:
1. Check the SonarCloud dashboard for your project
2. Look for the specific analysis run
3. Review the quality gate status and any failing conditions

## Best Practices

1. **Fix Quality Issues Early**: Address SonarCloud findings in your PR before requesting review
2. **Monitor Quality Gate**: Keep an eye on the quality gate conditions and trends
3. **Regular Review**: Periodically review and update quality gate conditions as needed

## Configuration Updates

To modify the SonarCloud configuration:
1. Update `sonar-project.properties` for analysis settings
2. Modify `.github/workflows/ci.yaml` for workflow behavior
3. Test changes in a feature branch before merging to main