# NPM Package Publishing Guide

## Prerequisites

1. NPM account (create at https://www.npmjs.com/signup)
2. NPM CLI installed (`npm install -g npm`)
3. Build the package first

## Publishing Steps

### 1. Build the Package

```bash
cd npm-package
npm install
npm run build
```

### 2. Test Locally (Optional)

```bash
# Create a test project
npm pack
# This creates a .tgz file you can install in another project
```

### 3. Login to NPM

```bash
npm login
# Enter your username, password, and email
```

### 4. Verify Package

```bash
# Check package.json
npm view @nikobuddy/duplicate-detector

# Test the package locally
npm link
# In another project: npm link @nikobuddy/duplicate-detector
```

### 5. Publish

```bash
# Dry run (test without publishing)
npm publish --dry-run

# Publish to NPM
npm publish --access public
```

### 6. Verify Publication

Visit: https://www.npmjs.com/package/@nikobuddy/duplicate-detector

## Version Management

### Update Version

```bash
# Patch version (1.0.0 -> 1.0.1)
npm version patch

# Minor version (1.0.0 -> 1.1.0)
npm version minor

# Major version (1.0.0 -> 2.0.0)
npm version major
```

### Publish New Version

```bash
npm version patch
npm publish --access public
```

## Package Scope

The package uses the scope `@sanitixpdf` which requires:
- Publishing with `--access public` flag
- Or configuring in `.npmrc`:
  ```
  @sanitixpdf:registry=https://registry.npmjs.org/
  access=public
  ```

## Troubleshooting

### "Package name already exists"
- Choose a different name in package.json
- Or use a scoped package (already using @sanitixpdf)

### "You do not have permission"
- Make sure you're logged in: `npm whoami`
- Check package name availability
- Verify you own the package

### "Invalid package name"
- Package name must be lowercase
- Can contain hyphens and underscores
- Scoped packages: @scope/package-name

## Best Practices

1. **Always test before publishing**
   ```bash
   npm run build
   npm test
   ```

2. **Update CHANGELOG.md** before new versions

3. **Tag releases on GitHub**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

4. **Write release notes** on GitHub

5. **Monitor package downloads** on npmjs.com

## Post-Publication

1. Update main README.md with NPM installation instructions
2. Create GitHub release
3. Share on social media/forums
4. Monitor issues and feedback

## Unpublishing (Emergency Only)

```bash
# Unpublish within 72 hours
npm unpublish @nikobuddy/duplicate-detector@1.0.0

# Deprecate instead (recommended)
npm deprecate @nikobuddy/duplicate-detector@1.0.0 "Use version 1.0.1 instead"
```

**Note**: Unpublishing should be avoided. Use deprecation instead.

