# Step-by-Step Guide to Publish NPM Package

## 📋 Prerequisites Checklist

Before publishing, make sure you have:
- [ ] NPM account (create at https://www.npmjs.com/signup if you don't have one)
- [ ] NPM CLI installed (comes with Node.js)
- [ ] Git repository pushed to GitHub
- [ ] Package is built and tested

---

## 🚀 Step-by-Step Publishing Instructions

### Step 1: Navigate to NPM Package Directory

```bash
cd npm-package
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required dependencies including webpack, TypeScript, etc.

### Step 3: Build the Package

```bash
npm run build
```

This will:
- Build CommonJS version (`lib/index.js`)
- Build ESM version (`lib/index.esm.js`)
- Generate TypeScript definitions (`lib/index.d.ts`)

**Expected output**: You should see the `lib/` folder with compiled files.

### Step 4: Verify Build Output

```bash
ls -la lib/
```

You should see:
- `index.js` (CommonJS)
- `index.esm.js` (ESM)
- `index.d.ts` (TypeScript definitions)
- Other compiled files

### Step 5: Test the Package Locally (Optional but Recommended)

```bash
# Create a tarball to test
npm pack

# This creates: sanitixpdf-duplicate-detector-1.0.0.tgz
```

You can install this in a test React project:
```bash
# In a test React project
npm install /path/to/sanitixpdf-duplicate-detector-1.0.0.tgz
```

### Step 6: Login to NPM

```bash
npm login
```

You'll be prompted for:
- **Username**: Your NPM username (or email)
- **Password**: Your NPM password
- **Email**: Your NPM email address

**Note**: If you have 2FA enabled, you'll need to enter the OTP code.

### Step 7: Verify You're Logged In

```bash
npm whoami
```

This should display your NPM username.

### Step 8: Check Package Name Availability

```bash
npm view @nikobuddy/duplicate-detector
```

If the package doesn't exist, you'll see an error (which is good - means the name is available).

### Step 9: Dry Run (Test Without Publishing)

```bash
npm publish --dry-run --access public
```

This shows what would be published without actually publishing. Review the output to ensure:
- Only necessary files are included
- No sensitive files are included
- Package structure looks correct

### Step 10: Publish to NPM

```bash
npm publish --access public
```

**Important**: The `--access public` flag is required because your package uses a scoped name (`@nikobuddy/duplicate-detector`).

**Expected output**:
```
+ @nikobuddy/duplicate-detector@1.0.0
```

### Step 11: Verify Publication

1. **Visit NPM website**:
   ```
   https://www.npmjs.com/package/@nikobuddy/duplicate-detector
   ```

2. **Check via CLI**:
   ```bash
   npm view @nikobuddy/duplicate-detector
   ```

3. **Test installation**:
   ```bash
   # In a new directory
   npm install @nikobuddy/duplicate-detector
   ```

---

## 🎯 Quick Command Summary

```bash
# 1. Navigate to package directory
cd npm-package

# 2. Install dependencies
npm install

# 3. Build package
npm run build

# 4. Login to NPM
npm login

# 5. Publish (with dry-run first)
npm publish --dry-run --access public
npm publish --access public
```

---

## 📝 Important Notes

### Package Scope
Your package uses `@nikobuddy/duplicate-detector` which is a scoped package. This means:
- ✅ You must use `--access public` when publishing
- ✅ Users install it as: `npm install @nikobuddy/duplicate-detector`
- ✅ Scoped packages are free for public packages

### Version Management
After publishing, to update the package:

```bash
# Update version (patch, minor, or major)
npm version patch   # 1.0.0 -> 1.0.1
npm version minor   # 1.0.0 -> 1.1.0
npm version major   # 1.0.0 -> 2.0.0

# Publish new version
npm publish --access public
```

### What Gets Published
Only these files/folders are published (defined in `package.json`):
- `lib/` - Compiled JavaScript and TypeScript definitions
- `README.md` - Package documentation
- `LICENSE` - MIT License

Everything else is excluded via `.npmignore`.

---

## 🔧 Troubleshooting

### Error: "Package name already exists"
- The name `@nikobuddy/duplicate-detector` might be taken
- Solution: Change the name in `package.json` or use a different scope

### Error: "You do not have permission"
- Make sure you're logged in: `npm whoami`
- Check if you own the package/scope
- For scoped packages, you need to be logged in as the scope owner

### Error: "Invalid package name"
- Package names must be lowercase
- Scoped packages format: `@scope/package-name`
- Your current name is correct: `@nikobuddy/duplicate-detector`

### Error: Build fails
- Make sure all dependencies are installed: `npm install`
- Check TypeScript errors: `npx tsc --noEmit`
- Verify webpack config is correct

---

## ✅ Post-Publication Checklist

After successful publication:

- [ ] Verify package is live on npmjs.com
- [ ] Test installation in a fresh project
- [ ] Update main README.md with NPM installation instructions
- [ ] Create a GitHub release tag
- [ ] Share on social media/forums
- [ ] Monitor package downloads and issues

---

## 🎉 Success!

Once published, users can install your package with:

```bash
npm install @nikobuddy/duplicate-detector
```

And use it in their React projects:

```tsx
import { useDuplicatePDFDetector } from '@nikobuddy/duplicate-detector';
```

---

**Ready to publish? Follow the steps above!** 🚀

