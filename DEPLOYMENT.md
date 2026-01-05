# Deployment Guide

## Production Deployment Instructions

### Prerequisites

- Python 3.6 or higher
- pip package manager
- Web server (nginx, Apache) for reverse proxy (optional but recommended)

### Step 1: Server Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd duplicate-pdf-detactore
   ```

2. **Create virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   pip install gunicorn  # For production server
   ```

### Step 2: Configuration

1. **Set environment variables:**
   ```bash
   export FLASK_ENV=production
   export SECRET_KEY=$(python3 -c 'import secrets; print(secrets.token_hex(32))')
   export HOST=0.0.0.0
   export PORT=5000
   ```

2. **Create necessary directories:**
   ```bash
   mkdir -p source_pdfs final_pdfs logs
   chmod 755 source_pdfs final_pdfs logs
   ```

### Step 3: Run with Gunicorn

```bash
gunicorn -w 4 -b 0.0.0.0:5000 --timeout 120 app:app
```

Options:
- `-w 4`: Number of worker processes
- `-b 0.0.0.0:5000`: Bind address and port
- `--timeout 120`: Request timeout (important for large PDF processing)

### Step 4: Nginx Reverse Proxy (Recommended)

Create `/etc/nginx/sites-available/duplicate-pdf-detector`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    client_max_body_size 500M;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 300s;
        proxy_connect_timeout 300s;
    }
}
```

Enable and restart:
```bash
sudo ln -s /etc/nginx/sites-available/duplicate-pdf-detector /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 5: Systemd Service (Optional)

Create `/etc/systemd/system/duplicate-pdf-detector.service`:

```ini
[Unit]
Description=Duplicate PDF Detector Web Application
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/path/to/duplicate-pdf-detactore
Environment="PATH=/path/to/duplicate-pdf-detactore/venv/bin"
Environment="FLASK_ENV=production"
Environment="SECRET_KEY=your-secret-key-here"
ExecStart=/path/to/duplicate-pdf-detactore/venv/bin/gunicorn -w 4 -b 127.0.0.1:5000 --timeout 120 app:app

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl daemon-reload
sudo systemctl enable duplicate-pdf-detector
sudo systemctl start duplicate-pdf-detector
sudo systemctl status duplicate-pdf-detector
```

### Step 6: SSL/HTTPS (Recommended)

Use Let's Encrypt with Certbot:

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Security Checklist

- [ ] Change SECRET_KEY in production
- [ ] Use HTTPS
- [ ] Set proper file permissions
- [ ] Configure firewall rules
- [ ] Set up log rotation
- [ ] Configure backup for important folders
- [ ] Set up monitoring and alerts

### Monitoring

Monitor the application logs:
```bash
# Application logs
tail -f logs/duplicate_detection_*.log

# Systemd service logs
sudo journalctl -u duplicate-pdf-detector -f

# Gunicorn logs (if not using systemd)
tail -f /var/log/gunicorn/access.log
tail -f /var/log/gunicorn/error.log
```

### Backup

Regularly backup:
- `final_pdfs/` folder (contains unique PDFs)
- `logs/` folder (contains processing logs)
- Database/configuration files if any

### Performance Tuning

- Adjust Gunicorn workers based on CPU cores: `workers = (2 × CPU cores) + 1`
- Increase timeout for large PDF processing
- Configure nginx caching for static files
- Use CDN for static assets in production

### Troubleshooting

- **502 Bad Gateway**: Check if Gunicorn is running
- **504 Gateway Timeout**: Increase timeout values
- **413 Request Entity Too Large**: Increase `client_max_body_size` in nginx
- **Permission Denied**: Check file permissions and user/group settings

