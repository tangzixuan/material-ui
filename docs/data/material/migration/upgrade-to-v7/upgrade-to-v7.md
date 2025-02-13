# Upgrade to v7

<p class="description">This guide explains how to upgrade from Material UI v6 to v7.</p>

## Start using the alpha release

In the `package.json` file, change the package version from `latest` to `next`.

```diff title="package.json"
-"@mui/material": "latest",
+"@mui/material": "next",
```

Using `next` ensures your project always uses the latest v7 pre-releases.
Alternatively, you can also target and fix it to a specific version, for example, `7.0.0-alpha.0`.

## Breaking changes

Since v7 is a new major release, it contains some changes that affect the public API.
The steps you need to take to migrate from Material UI v6 to v7 are described below.

:::info
This list is a work in progress.
Expect updates as new breaking changes are introduced.
:::

### Hidden and PigmentHidden components removed

The deprecated `Hidden` and `PigmentHidden` components have been removed.

Use the `sx` prop to replace `implementation="css"`:

```diff
-<Hidden implementation="css" xlUp><Paper /></Hidden>
+<Paper sx={{ display: { xl: 'none', xs: 'block' } }} />
```

```diff
-<Hidden implementation="css" mdDown><Paper /></Hidden>
+<Paper sx={{ display: { xs: 'none', md: 'block' } }} />
```

Use the `useMediaQuery` hook to replace `implementation="js"`:

```diff
-<Hidden implementation="js" xlUp><Paper /></Hidden>
+const hidden = useMediaQuery(theme => theme.breakpoints.up('xl'));
+return hidden ? null : <Paper />;
```

:::warning
There's no codemod available for this change, as each project's setup will heavily influence the migration.
:::

### Lab components moved to the main package

The following `@mui/lab` components and hook have been moved to `@mui/material`:

- Alert
- AlertTitle
- Autocomplete
- AvatarGroup
- Pagination
- PaginationItem
- Rating
- Skeleton
- SpeedDial
- SpeedDialAction
- SpeedDialIcon
- ToggleButton
- ToggleButtonGroup
- usePagination

To keep using these components and hook, import them from `@mui/material` instead of `@mui/lab`.

```diff
-import Alert from '@mui/lab/Alert';
+import Alert from '@mui/material/Alert';

-import { Alert } from '@mui/lab';
+import { Alert } from '@mui/material';
```

Use this codemod to automatically update the imports:

<!-- #npm-tag-reference -->

```bash
npx @mui/codemod@next v7.0.0/lab-removed-components <path/to/folder>
```

:::warning
The codemod doesn't cover type imports associated with the components.
:::

### InputLabel

The `size` prop for `InputLabel` now follows the standard naming convention used across other components like `Button` and `TextField`. `'normal'` has been replaced with `'medium'` for consistency.

If you were using `size="normal"`, update it to `size="medium"`:

```diff
-<InputLabel size="normal">Label</InputLabel>
+<InputLabel size="medium">Label</InputLabel>
```

The default behavior remains unchanged, so no updates are needed unless you explicitly set `size="normal"`.

Use this codemod to automatically update the `size` value:

<!-- #npm-tag-reference -->

```bash
npx @mui/codemod@next v7.0.0/input-label-size-normal-medium <path/to/folder>
```
