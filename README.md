# Analytics

## Overview

The analytics library contains components and modules that are used in DHIS 2 analytics apps, including:

-   dashboards-app
-   data-visualizer-app
-   maps-app

[Module layout documentation](./docs/module-layout.md)

## Publishing

The analytics package is published to npm as @dhis2/analytics.

To publish, simply mark the commit as a patch or minor change using semantic versioning (see note below). Once committed, github actions will take care of publishing the new version to npm.

**Note**: All changes to the 4.x branch must marked as minor or patch (using e.g. "fix:" or "feat:"), even if it is technically a breaking change. Attempting to publish a breaking change on this branch will fail since 5.0.0 has already been published.
