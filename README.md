# Analytics

master: ![DHIS2: Test](https://github.com/dhis2/analytics/workflows/DHIS2:%20Test/badge.svg) ![DHIS2: Release](https://github.com/dhis2/analytics/workflows/DHIS2:%20Release/badge.svg)

4.x:
![DHIS2: Test](https://github.com/dhis2/analytics/workflows/DHIS2:%20Test/badge.svg?branch=4.x) ![DHIS2: Release](https://github.com/dhis2/analytics/workflows/DHIS2:%20Release/badge.svg?branch=4.x)

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

### 4.x branch

Commits to the 4.x branch cannot trigger a major version bump, even if it is technically a breaking change. This is because 5.0.0 has already been published. In the unlikely case that you need to commit a change that is considered breaking, you will have to mark it to only trigger a patch or minor bump, then make sure to update the apps that are locked to the 4.x version of analytics

### 2.4.x branch

Commits to the 2.4.x branch cannot trigger a major or minor version bump, even if it is technically a breaking or feature change. This is because 2.5.0 and 3.0.0 have already been published. In the unlikely case that you need to commit a change that is considered breaking or feature, you will have to mark it to only trigger a patch bump, then make sure to update the apps that are locked to the 2.4.x version of analytics
