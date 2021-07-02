# Analytics

master: ![DHIS2: Test](https://github.com/dhis2/analytics/workflows/DHIS2:%20Test/badge.svg) ![DHIS2: Release](https://github.com/dhis2/analytics/workflows/DHIS2:%20Release/badge.svg)

4.x:
![DHIS2: Test](https://github.com/dhis2/analytics/workflows/DHIS2:%20Test/badge.svg?branch=4.x) ![DHIS2: Release](https://github.com/dhis2/analytics/workflows/DHIS2:%20Release/badge.svg?branch=4.x)

## Overview

The analytics library contains components and modules that are used in DHIS2 analytics apps, including:

-   [dhis2/dashboards-app](https://github.com/dhis2/dashboards-app)
-   [dhis2/data-visualizer-app](https://github.com/dhis2/data-visualizer-app)
-   [dhis2/maps-app](https://github.com/dhis2/maps-app)

[Module layout documentation](./docs/module-layout.md)

## Publishing

The analytics package is published to npm as @dhis2/analytics.

To publish, simply mark the commit using [semantic release terminology](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines) (see notes below for branch-specific restrictions). Once committed, github actions will take care of publishing the new version to npm.

### master branch

The master branch follows semantic versioning according to spec.

### 16.x branch

Commits to the 16.x branch cannot trigger a major version bump, even if it is technically a breaking change. This is because 17.0.0 has already been published. In the unlikely case that you need to commit a change that is considered breaking, you will have to mark it to only trigger a patch or minor bump, then make sure to update the apps that are locked to the 16.x version of analytics

### 11.0.x branch

Commits to the 11.0.x branch cannot trigger a major or minor version bump, even if it is technically a breaking or feature change. This is because 11.1.0 and 12.0.0 have already been published. In the unlikely case that you need to commit a change that is considered breaking or feature, you will have to mark it to only trigger a patch bump, then make sure to update the apps that are locked to the 11.0.x version of analytics

### 4.x branch

Commits to the 4.x branch cannot trigger a major version bump, even if it is technically a breaking change. This is because 5.0.0 has already been published. In the unlikely case that you need to commit a change that is considered breaking, you will have to mark it to only trigger a patch or minor bump, then make sure to update the apps that are locked to the 4.x version of analytics

### 2.4.x branch

Commits to the 2.4.x branch cannot trigger a major or minor version bump, even if it is technically a breaking or feature change. This is because 2.5.0 and 3.0.0 have already been published. In the unlikely case that you need to commit a change that is considered breaking or feature, you will have to mark it to only trigger a patch bump, then make sure to update the apps that are locked to the 2.4.x version of analytics

## Report an issue

The issue tracker can be found in [DHIS2 JIRA](https://jira.dhis2.org)
under the [LIBS](https://jira.dhis2.org/projects/LIBS) project.

Deep links:

-   [Bug](https://jira.dhis2.org/secure/CreateIssueDetails!init.jspa?pid=10700&issuetype=10006&components=11023)
-   [Improvement](https://jira.dhis2.org/secure/CreateIssueDetails!init.jspa?pid=10700&issuetype=10002&components=11023)
-   [New Feature](https://jira.dhis2.org/secure/CreateIssueDetails!init.jspa?pid=10700&issuetype=10005&components=11023)
-   [Task](https://jira.dhis2.org/secure/CreateIssueDetails!init.jspa?pid=10700&issuetype=10003&components=11023)
