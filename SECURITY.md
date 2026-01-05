# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for receiving such patches depends on the CVSS v3.0 Rating:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

Please report (suspected) security vulnerabilities to **[INSERT SECURITY EMAIL]**. You will receive a response within 48 hours. If the issue is confirmed, we will release a patch as soon as possible depending on complexity but historically within a few days.

## Security Best Practices

When using SanitixPDF:

1. **File Upload Security**: Only upload PDFs from trusted sources
2. **Server Configuration**: Use HTTPS in production environments
3. **Access Control**: Restrict access to the web interface appropriately
4. **File Permissions**: Ensure proper file permissions on server directories
5. **Regular Updates**: Keep dependencies up to date
6. **Environment Variables**: Never commit sensitive information like SECRET_KEY

## Known Security Considerations

- The application processes user-uploaded PDF files. Ensure your server has proper antivirus/security scanning if processing untrusted files.
- File size limits are configurable. Set appropriate limits based on your server capacity.
- The application stores PDFs temporarily. Ensure proper cleanup and storage management.

## Disclosure Policy

When we receive a security bug report, we will assign it to a primary handler. This person will coordinate the fix and release process, involving the following steps:

1. Confirm the problem and determine the affected versions.
2. Audit code to find any similar problems.
3. Prepare fixes for all releases still under maintenance. These fixes will be released as fast as possible to the public.

