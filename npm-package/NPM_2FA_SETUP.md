# NPM 2FA Setup - Required for Publishing

## ⚠️ Error You're Seeing

```
403 Forbidden - Two-factor authentication or granular access token with bypass 2fa enabled is required to publish packages.
```

## ✅ Solution: Enable 2FA on NPM

NPM now requires 2FA (Two-Factor Authentication) to publish packages. Here's how to set it up:

### Step 1: Enable 2FA on NPM Website

1. **Go to NPM website**: https://www.npmjs.com
2. **Login** to your account
3. **Click on your profile** (top right) → **Account Settings**
4. **Go to "Two-Factor Authentication"** section
5. **Click "Enable 2FA"**
6. **Choose authentication method**:
   - **Option A**: Authenticator App (Recommended)
     - Use Google Authenticator, Authy, or similar
     - Scan QR code with your app
     - Enter verification code
   - **Option B**: SMS (Less secure)
     - Enter your phone number
     - Enter verification code sent via SMS

### Step 2: After Enabling 2FA

Once 2FA is enabled, you have two options:

#### Option A: Use Authenticator App (Recommended)

1. **Login again**:
   ```bash
   npm login
   ```
2. When prompted, enter:
   - Username
   - Password
   - **One-Time Password (OTP)** from your authenticator app
   - Email

3. **Publish**:
   ```bash
   npm publish --access public
   ```
   - You'll be prompted for OTP again during publish

#### Option B: Create Granular Access Token (For CI/CD)

1. **Go to NPM**: https://www.npmjs.com/settings/YOUR_USERNAME/tokens
2. **Click "Generate New Token"**
3. **Select "Granular Access Token"**
4. **Configure**:
   - Token name: "Publish Token"
   - Expiration: 90 days (or custom)
   - **Permissions**: 
     - ✅ Read and write packages
     - ✅ Bypass 2FA (if available)
5. **Generate token** and **copy it immediately** (you won't see it again!)

6. **Use token to login**:
   ```bash
   npm login --auth-type=legacy
   # When prompted for password, paste your token
   ```

### Step 3: Alternative - Use Legacy Auth Token

If you prefer not to use 2FA every time:

1. **Create Automation Token**:
   - Go to: https://www.npmjs.com/settings/YOUR_USERNAME/tokens
   - Click "Generate New Token" → "Automation"
   - Copy the token

2. **Create `.npmrc` file** in your home directory:
   ```bash
   echo "//registry.npmjs.org/:_authToken=YOUR_TOKEN_HERE" > ~/.npmrc
   chmod 600 ~/.npmrc
   ```

3. **Or use in project** (npm-package/.npmrc):
   ```
   //registry.npmjs.org/:_authToken=YOUR_TOKEN_HERE
   ```

---

## 🚀 Quick Fix: Enable 2FA and Publish

### Fastest Method:

1. **Enable 2FA on NPM website** (5 minutes)
   - https://www.npmjs.com → Account Settings → Two-Factor Authentication

2. **Login with 2FA**:
   ```bash
   cd npm-package
   npm login
   # Enter OTP from authenticator app when prompted
   ```

3. **Publish**:
   ```bash
   npm publish --access public
   # Enter OTP again when prompted
   ```

---

## 📝 Step-by-Step: Complete Publishing Process

### 1. Enable 2FA on NPM

Visit: https://www.npmjs.com/settings/YOUR_USERNAME/security
- Click "Enable 2FA"
- Follow the setup wizard
- Save backup codes in a safe place

### 2. Fix Package.json

The repository URL has been fixed. Run:
```bash
cd npm-package
npm pkg fix
```

### 3. Login with 2FA

```bash
npm login
```

You'll be prompted for:
- Username
- Password  
- **One-Time Password (OTP)** ← Enter code from authenticator app
- Email

### 4. Verify Login

```bash
npm whoami
```

### 5. Build Package

```bash
npm run build
```

### 6. Publish

```bash
npm publish --access public
```

You'll be prompted for OTP again during publish.

---

## 🔐 Using Access Token (Alternative)

If you want to avoid entering OTP every time:

### Create Automation Token:

1. Go to: https://www.npmjs.com/settings/YOUR_USERNAME/tokens
2. Generate "Automation" token
3. Copy the token

### Use Token:

```bash
# Method 1: Login with token
npm login --auth-type=legacy
# Username: your-username
# Password: paste-your-token-here
# Email: your-email

# Method 2: Add to .npmrc
echo "//registry.npmjs.org/:_authToken=YOUR_TOKEN" >> npm-package/.npmrc
```

---

## ✅ After 2FA is Enabled

Once 2FA is set up, you can publish:

```bash
cd npm-package
npm login          # Enter OTP when prompted
npm publish --access public  # Enter OTP again
```

---

## 🎯 Recommended Approach

**For Development**: Use 2FA with Authenticator App
- More secure
- Works seamlessly after initial setup
- Just enter OTP when prompted

**For CI/CD**: Use Automation Token
- No manual intervention
- Store token securely
- Use in GitHub Actions secrets

---

## 📞 Need Help?

- NPM 2FA Docs: https://docs.npmjs.com/configuring-two-factor-authentication
- NPM Support: https://www.npmjs.com/support

---

**Once 2FA is enabled, you'll be able to publish successfully!** 🔐✅

