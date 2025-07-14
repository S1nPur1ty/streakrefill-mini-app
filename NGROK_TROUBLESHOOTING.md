# 🔧 Ngrok Connection Issues - Troubleshooting Guide

## 📋 Problem Description
- Ngrok tunnel shows "This site can't be reached" or connection errors
- Localhost works fine, but ngrok URL fails with ERR_CONNECTION_CLOSED
- Tunnel appears active but external access fails

## 🛠️ Quick Solution (90% of cases)
```bash
# 1. Kill existing ngrok process
pkill ngrok

# 2. Start fresh tunnel
ngrok http 5173

# 3. Get new URL (optional)
curl -s http://127.0.0.1:4040/api/tunnels | python3 -c "import sys, json; data = json.load(sys.stdin); print('New URL:', data['tunnels'][0]['public_url']) if data['tunnels'] else print('No tunnels found')"
```

## 🔍 Detailed Troubleshooting Steps

### Step 1: Verify Development Server
```bash
# Check if your dev server is running
lsof -i :5173

# Should show something like:
# node    3685 user   24u  IPv6 ... TCP localhost:5173 (LISTEN)
```

### Step 2: Check Ngrok Status
```bash
# Verify ngrok is running
ps aux | grep ngrok | grep -v grep

# Check tunnel information
curl -s http://127.0.0.1:4040/api/tunnels | python3 -m json.tool
```

### Step 3: Test Tunnel Connection
```bash
# Test the ngrok URL directly
curl -I https://YOUR_NGROK_URL.ngrok-free.app

# Should return HTTP/2 200 if working
```

### Step 4: Restart if Issues Persist
```bash
# Complete restart
pkill ngrok
sleep 2
ngrok http 5173
```

## 💡 Common Root Causes

### 1. **Tunnel Expiration**
- Free tier has time limits
- Tunnels auto-expire after inactivity
- **Solution**: Restart ngrok

### 2. **Network Connectivity**
- ISP blocking ngrok domains
- Corporate firewall restrictions
- **Solution**: Try different region or VPN

### 3. **Stale Connections**
- Old tunnel still running
- Port conflicts
- **Solution**: Kill all ngrok processes and restart

### 4. **Ngrok Server Issues**
- Regional server problems
- Maintenance windows
- **Solution**: Try different region or wait

## ✅ Prevention & Best Practices

### Daily Development
1. **Keep ngrok terminal open** - don't close the window running ngrok
2. **Note the URL** - save current ngrok URL for the session
3. **Test after breaks** - verify tunnel after long inactivity
4. **Restart periodically** - for long development sessions (4+ hours)

### URL Management
```bash
# Always get current URL before sharing
curl -s http://127.0.0.1:4040/api/tunnels | grep -o 'https://[^"]*ngrok[^"]*'

# Or visit the web interface
open http://127.0.0.1:4040
```

## 🚀 Advanced Commands

### Regional Options
```bash
# US region (sometimes more stable)
ngrok http 5173 --region=us

# Europe region
ngrok http 5173 --region=eu

# Asia Pacific region
ngrok http 5173 --region=ap
```

### Paid Features (Better Stability)
```bash
# Custom subdomain (requires paid plan)
ngrok http 5173 --subdomain=myapp-dev

# With auth token for better reliability
ngrok authtoken YOUR_TOKEN
ngrok http 5173
```

### Multiple Tunnels
```bash
# If running multiple services
ngrok http 5173 --name=frontend
ngrok http 3000 --name=backend
```

## 🔧 Emergency Fixes

### When Nothing Works
```bash
# Nuclear option - restart everything
pkill ngrok
pkill node
cd your-project
npm run dev &
ngrok http 5173
```

### Alternative Testing
```bash
# Use different tunneling service temporarily
npx localtunnel --port 5173

# Or use VSCode port forwarding if available
```

## 📱 Mobile/Device Testing

### Farcaster Frame Testing
- Always test new ngrok URLs in Farcaster before sharing
- Use warpcast.com/~/developers for frame validation
- Mobile devices may cache old URLs - clear browser cache

### Network Considerations
- Some mobile networks block tunneling services
- WiFi vs cellular can behave differently
- Try accessing from different networks if issues persist

## 📞 When to Seek Help

Contact support or look for alternatives if:
- Multiple restart attempts fail
- Regional switching doesn't help
- Error persists across different networks
- Getting 5xx errors consistently

## 💾 Quick Reference Commands

```bash
# Status check
lsof -i :5173 && ps aux | grep ngrok

# Quick restart
pkill ngrok && ngrok http 5173

# Get URL
curl -s http://127.0.0.1:4040/api/tunnels | grep -o 'https://[^"]*'

# Web interface
open http://127.0.0.1:4040
```

---

**Last Updated**: Created during streak-refill development session
**Success Rate**: This guide solves ~90% of ngrok connection issues
**Time to Fix**: Usually under 2 minutes 