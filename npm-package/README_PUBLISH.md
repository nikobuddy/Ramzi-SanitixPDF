# 📦 Publishing to NPM - Quick Guide

## ⚠️ Important: 2FA Required

NPM now **requires 2FA (Two-Factor Authentication)** to publish packages. You must enable it before publishing.

---

## 🚀 Quick Start (3 Steps)

### Step 1: Enable 2FA (5 minutes)

1. **Visit**: https://www.npmjs.com/settings/YOUR_USERNAME/security
2. **Click**: "Enable 2FA"
3. **Choose**: Authenticator App (Google Authenticator, Authy, etc.)
4. **Scan QR code** with your phone
5. **Enter verification code**
6. **Save backup codes** (important!)

### Step 2: Login with 2FA

```bash
cd npm-package
npm login
```

When prompted:
- Username: your-npm-username
- Password: your-npm-password
- **One-Time Password**: Enter code from authenticator app
- Email: your-email

### Step 3: Publish

```bash
./QUICK_PUBLISH.sh
```

Or manually:
```bash
npm run build
npm publish --access public
```

You'll be asked for OTP again during publish - enter code from authenticator app.

---

## 📋 Complete Publishing Process

### Option A: Using the Script (Recommended)

```bash
cd npm-package
./QUICK_PUBLISH.sh
```

The script will:
1. ✅ Install dependencies
2. ✅ Build the package
3. ✅ Check login status
4. ✅ Run dry-run preview
5. ✅ Ask for confirmation
6. ✅ Publish to NPM

### Option B: Manual Publishing

```bash
# 1. Navigate to package
cd npm-package

# 2. Fix package.json (if needed)
npm pkg fix

# 3. Build
npm run build

# 4. Login (with 2FA)
npm login
# Enter OTP when prompted

# 5. Verify login
npm whoami

# 6. Dry run (preview)
npm publish --dry-run --access public

# 7. Publish
npm publish --access public
# Enter OTP when prompted
```

---

## 🔐 2FA Setup Details

### Why 2FA is Required

NPM requires 2FA for publishing to:
- ✅ Protect your account
- ✅ Prevent unauthorized package publishing
- ✅ Comply with security best practices

### Setting Up 2FA

1. **Go to NPM Security Settings**:
   - https://www.npmjs.com/settings/YOUR_USERNAME/security

2. **Enable 2FA**:
   - Click "Enable 2FA"
   - Choose "Authenticator App" (recommended)
   - Scan QR code with Google Authenticator, Authy, or similar
   - Enter verification code
   - Save backup codes

3. **Test Login**:
   ```bash
   npm login
   # Enter OTP when prompted
   ```

### Using 2FA

Every time you publish, you'll need to:
1. Run `npm login` (enter OTP)
2. Run `npm publish` (enter OTP again)

---

## 🔄 Alternative: Automation Token (No OTP Each Time)

If you don't want to enter OTP every time:

### Create Automation Token:

1. **Go to**: https://www.npmjs.com/settings/YOUR_USERNAME/tokens
2. **Click**: "Generate New Token"
3. **Select**: "Automation"
4. **Copy token** (save it - you won't see it again!)

### Use Token:

```bash
# Login with token
npm login --auth-type=legacy
# Username: your-username
# Password: paste-token-here (not your password!)
# Email: your-email
```

Then publish normally:
```bash
npm publish --access public
```

---

## ✅ Verification

After publishing, verify:

1. **Check on NPM**: 
   - https://www.npmjs.com/package/@nikobuddy/duplicate-detector

2. **Test installation**:
   ```bash
   npm install @nikobuddy/duplicate-detector
   ```

3. **Check package info**:
   ```bash
   npm view @nikobuddy/duplicate-detector
   ```

---

## 🐛 Troubleshooting

### Error: "403 Forbidden - Two-factor authentication required"

**Solution**: Enable 2FA on your NPM account
- Visit: https://www.npmjs.com/settings/YOUR_USERNAME/security
- Enable 2FA
- Login again with `npm login`

### Error: "Access token expired or revoked"

**Solution**: Login again
```bash
npm login
# Enter OTP when prompted
```

### Error: "Package already exists"

**Solution**: Update version in `package.json`
```bash
# Edit package.json and increment version
# Then publish again
npm publish --access public
```

### Error: "Invalid package name"

**Solution**: Check package name in `package.json`
- Must be: `@nikobuddy/duplicate-detector`
- Must match your NPM organization/username

---

## 📝 Pre-Publishing Checklist

Before publishing, make sure:

- [ ] ✅ 2FA is enabled on NPM account
- [ ] ✅ Logged in with `npm login`
- [ ] ✅ `package.json` is correct (run `npm pkg fix`)
- [ ] ✅ Package builds successfully (`npm run build`)
- [ ] ✅ Version number is correct
- [ ] ✅ All files are in `lib/` directory
- [ ] ✅ README.md is up to date
- [ ] ✅ LICENSE file exists

---

## 🎯 Next Steps After Publishing

1. **Update GitHub README** with installation instructions
2. **Create a release** on GitHub
3. **Share the package** with your community
4. **Monitor downloads** on NPM

---

## 📚 Additional Resources

- **NPM 2FA Docs**: https://docs.npmjs.com/configuring-two-factor-authentication
- **NPM Publishing Guide**: https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry
- **NPM Support**: https://www.npmjs.com/support

---

**Once 2FA is enabled, you're ready to publish!** 🚀
