# Analytics

**master**
[![Test](https://github.com/dhis2/analytics/actions/workflows/node-test.yml/badge.svg)](https://github.com/dhis2/analytics/actions/workflows/node-test.yml) [![DHIS2: Release](https://github.com/dhis2/analytics/actions/workflows/node-publish.yml/badge.svg)](https://github.com/dhis2/analytics/actions/workflows/node-publish.yml)

**21.x**
[![Test](https://github.com/dhis2/analytics/actions/workflows/node-test.yml/badge.svg?branch=21.x)](https://github.com/dhis2/analytics/actions/workflows/node-test.yml) [![DHIS2: Release](https://github.com/dhis2/analytics/actions/workflows/node-publish.yml/badge.svg?branch=21.x)](https://github.com/dhis2/analytics/actions/workflows/node-publish.yml)

**20.x**
[![Test](https://github.com/dhis2/analytics/actions/workflows/node-test.yml/badge.svg?branch=20.x)](https://github.com/dhis2/analytics/actions/workflows/node-test.yml) [![DHIS2: Release](https://github.com/dhis2/analytics/actions/workflows/node-publish.yml/badge.svg?branch=20.x)](https://github.com/dhis2/analytics/actions/workflows/node-publish.yml)

**16.x**
[![Test](https://github.com/dhis2/analytics/actions/workflows/node-test.yml/badge.svg?branch=16.x)](https://github.com/dhis2/analytics/actions/workflows/node-test.yml) [![DHIS2: Release](https://github.com/dhis2/analytics/actions/workflows/node-publish.yml/badge.svg?branch=16.x)](https://github.com/dhis2/analytics/actions/workflows/node-publish.yml)

**11.0.x**
[![Test](https://github.com/dhis2/analytics/actions/workflows/node-test.yml/badge.svg?branch=11.0.x)](https://github.com/dhis2/analytics/actions/workflows/node-test.yml) [![DHIS2: Release](https://github.com/dhis2/analytics/actions/workflows/node-publish.yml/badge.svg?branch=11.0.x)](https://github.com/dhis2/analytics/actions/workflows/node-publish.yml)

**4.x**
[![Test](https://github.com/dhis2/analytics/actions/workflows/node-test.yml/badge.svg?branch=4.x)](https://github.com/dhis2/analytics/actions/workflows/node-test.yml) [![DHIS2: Release](https://github.com/dhis2/analytics/actions/workflows/node-publish.yml/badge.svg?branch=4.x)](https://github.com/dhis2/analytics/actions/workflows/node-publish.yml)

**2.4.x**
[![Test](https://github.com/dhis2/analytics/actions/workflows/node-test.yml/badge.svg?branch=2.4.x)](https://github.com/dhis2/analytics/actions/workflows/node-test.yml) [![DHIS2: Release](https://github.com/dhis2/analytics/actions/workflows/node-publish.yml/badge.svg?branch=2.4.x)](https://github.com/dhis2/analytics/actions/workflows/node-publish.yml)

## Overview

The analytics library contains components and modules that are used in DHIS 2 analytics apps, including:

-   [dhis2/dashboards-app](https://github.com/dhis2/dashboards-app)
-   [dhis2/data-visualizer-app](https://github.com/dhis2/data-visualizer-app)
-   [dhis2/maps-app](https://github.com/dhis2/maps-app)

[Module layout documentation](./docs/module-layout.md)

## Publishing

The analytics package is published to npm as @dhis2/analytics.

To publish, simply mark the commit using [semantic release terminology](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines) (see notes below for branch-specific restrictions). Once committed, github actions will take care of publishing the new version to npm.

### master branch

The master branch follows semantic versioning according to spec.

### .x branches

Commits to .x branches (e.g. 16.x) cannot trigger a major version bump, even if it is technically a breaking change. This is because the next version has already been published. Additionally, branches that use .x for the patch version (e.g. 11.0.x, 2.4.x), cannot trigger a minor version bump. In the unlikely case that you need to commit a change that would trigger a version bump that's not possible, you will have to mark it to only trigger a patch or minor bump respectively, then make sure to update the apps that are locked to the .x version of analytics

## Report an issue

The issue tracker can be found in [DHIS2 JIRA](https://jira.dhis2.org)
under the [LIBS](https://jira.dhis2.org/projects/LIBS) project.

Deep links:

-   [Bug](https://jira.dhis2.org/secure/CreateIssueDetails!init.jspa?pid=10700&issuetype=10006&components=11023)
-   [Improvement](https://jira.dhis2.org/secure/CreateIssueDetails!init.jspa?pid=10700&issuetype=10002&components=11023)
-   [New Feature](https://jira.dhis2.org/secure/CreateIssueDetails!init.jspa?pid=10700&issuetype=10005&components=11023)
-   [Task](https://jira.dhis2.org/secure/CreateIssueDetails!init.jspa?pid=10700&issuetype=10003&components=11023)
