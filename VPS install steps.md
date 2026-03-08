Below is a reproducible “runbook” for everything that **worked** up to this point, written as:

- **Step**
- **Brief explanation**
- **Commands used**

I’m keeping it generic where needed (replace placeholders like `72.62.127.47`, `app.circleindependent.com`, usernames, paths).

---

# VPS MERN + Nginx + PM2 + Mongo (Docker) Runbook

## 0) Baseline server verification

**Explanation:** Confirm OS/kernel, time, user, networking, and what ports/services are currently exposed.

**Commands used:**

```bash
whoami
id
cat /etc/os-release
uname -a
uptime
date
timedatectl 2>/dev/null || true

ss -tulpn

ip -br a
ip route
cat /etc/resolv.conf
hostnamectl 2>/dev/null || hostname
```

---

## 1) Create / fix a non-root deploy user with sudo

**Explanation:** Run day-to-day admin tasks from a non-root account; keep root disabled for SSH later.

**Commands used (as root):**

```bash id="5imtv6"
getent group sudo
usermod -aG sudo deploy
getent group sudo

sudo -u deploy -H bash -lc 'id; sudo -n true && echo "sudo ok" || echo "sudo prompts (expected first time)"'
```

**Note:** After adding to sudo, you typically need to **log out and back in** for group membership to apply.

---

## 2) SSH key access + hardening (keys-only)

### 2.1 Verify current SSH status

**Explanation:** Confirm SSH is running and what it’s listening on.

**Commands used:**

```bash id="pgvhec"
ss -tulpn | grep ':22'
sudo systemctl status ssh --no-pager
```

### 2.2 Ensure deploy can use sudo (interactive)

**Explanation:** First interactive sudo will prompt for password; that’s normal.

**Commands used (as deploy):**

```bash id="kr225p"
sudo -v
```

### 2.3 Create SSH hardening drop-in

**Explanation:** Use `/etc/ssh/sshd_config.d/` to keep changes clean and upgrade-safe.

**Commands used:**

```bash id="0tmuau"
sudo mkdir -p /etc/ssh/sshd_config.d
sudo nano /etc/ssh/sshd_config.d/99-hardening.conf
```

**File contents used (final intent):**

```text id="nfvoza"
PermitRootLogin no
AllowUsers deploy

PubkeyAuthentication yes
AuthenticationMethods publickey

PasswordAuthentication no
KbdInteractiveAuthentication no
ChallengeResponseAuthentication no
UsePAM yes
```

### 2.4 Validate and apply SSH changes

**Explanation:** `sshd -t` prevents locking yourself out; restart applies config.

**Commands used:**

```bash id="jfoh9v"
sudo sshd -t && echo "sshd config OK"
sudo systemctl restart ssh
```

### 2.5 Confirm effective SSH config

**Explanation:** `sshd -T` shows the final merged configuration.

**Commands used:**

```bash id="pc0dj0"
sudo sshd -T | egrep '^(permitrootlogin|passwordauthentication|kbdinteractiveauthentication|challengeresponseauthentication|authenticationmethods|pubkeyauthentication|allowusers|usepam)'
```

### 2.6 Confirm passwords are refused (functional test)

**Explanation:** Even if `sshd -T` looks confusing on some systems, this test proves keys-only.

**Command used (from a shell on the VPS):**

```bash id="vbn169"
ssh -o PreferredAuthentications=password -o PubkeyAuthentication=no deploy@72.62.127.47
```

Expected: `Permission denied (publickey).`

---

## 3) Firewall with UFW

**Explanation:** Lock inbound ports down early. Allow only SSH (22) and web (80/443).

**Commands used:**

```bash id="u50a3u"
sudo apt-get update
sudo apt-get install -y ufw

sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

sudo ufw enable
sudo ufw status verbose
ss -tulpn
```

---

## 4) Install Nginx and verify it’s serving

**Explanation:** Nginx will serve the React build and reverse-proxy `/graphql` to Node.

**Commands used:**

```bash id="1nm0zc"
sudo apt-get install -y nginx
sudo systemctl enable --now nginx
sudo systemctl status nginx --no-pager

curl -I http://127.0.0.1
```

**Inspect active config:**

```bash id="poyxd5"
sudo nginx -T | sed -n '1,200p'
cat /etc/nginx/sites-enabled/default | sed -n '1,220p'
```

---

## 5) Configure Nginx server block for your domain

**Explanation:** Create a dedicated docroot, configure host-based routing for `app.circleindependent.com`, serve SPA, and proxy `/graphql` to backend on `127.0.0.1:5000`.

### 5.1 Create web root

```bash id="19l6rq"
sudo mkdir -p /var/www/app.circleindependent.com
sudo chown -R www-data:www-data /var/www/app.circleindependent.com
```

### 5.2 Create the site config

```bash id="wkn6xn"
sudo nano /etc/nginx/sites-available/app.circleindependent.com
```

**Config used:**

```nginx id="llevh8"
server {
    listen 80;
    listen [::]:80;

    server_name app.circleindependent.com;

    root /var/www/app.circleindependent.com;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /graphql {
        proxy_pass http://127.0.0.1:5000/graphql;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 5.3 Enable site + disable default

```bash id="dqikna"
sudo ln -s /etc/nginx/sites-available/app.circleindependent.com /etc/nginx/sites-enabled/app.circleindependent.com
sudo rm /etc/nginx/sites-enabled/default
```

### 5.4 Validate and reload Nginx

```bash id="h5ijzd"
sudo nginx -t && sudo systemctl reload nginx
```

### 5.5 Test routing before DNS exists (Host header trick)

```bash id="eky998"
curl -I -H "Host: app.circleindependent.com" http://127.0.0.1
```

### 5.6 If web root empty, add placeholder index.html

```bash id="p1udah"
sudo ls -la /var/www/app.circleindependent.com

echo '<!doctype html><html><head><meta charset="utf-8"><title>app.circleindependent.com</title></head><body><h1>Nginx is serving app.circleindependent.com ✅</h1></body></html>' \
| sudo tee /var/www/app.circleindependent.com/index.html > /dev/null

curl -I -H "Host: app.circleindependent.com" http://127.0.0.1
curl -H "Host: app.circleindependent.com" http://127.0.0.1 | head
```

### 5.7 Confirm GraphQL proxy currently fails until backend runs

```bash id="zlgbry"
curl -i -H "Host: app.circleindependent.com" http://127.0.0.1/graphql | head -n 20
ss -tulpn | grep ':5000' || echo "Nothing listening on 5000"
```

---

## 6) Install PM2 and configure boot startup

**Explanation:** PM2 runs your Node server as a managed service (restart on crash; restore on reboot).

### 6.1 Install PM2 globally

```bash id="tvwgxu"
sudo npm install -g pm2
pm2 -v
```

### 6.2 NPM version alignment (important)

**Explanation:** You discovered `npm ci` can fail across major npm versions if lockfiles were created with a different major.  
You upgraded to npm 11, then later had to downgrade back to npm 10.8.2 to match the lockfile.

**Commands used:**

```bash id="gq1a1s"
sudo npm install -g npm@11
# later: to match your lockfile
sudo npm install -g npm@10.8.2
```

### 6.3 Enable PM2 systemd integration

```bash id="ffwsk2"
pm2 startup systemd -u deploy --hp /home/deploy
# then run the command it prints, like:
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u deploy --hp /home/deploy
```

**Note:** True persistence needs `pm2 save` **after** your app is running under PM2.

---

## 7) Create deployment notes on the VPS

**Explanation:** Maintain local documentation for reproducibility.

**Command used:**

```bash id="ozi9q9"
cat > ~/vps-deploy-notes.md <<'EOF'
# (content omitted here for brevity)
EOF
```

**Verify:**

```bash id="dhzn6o"
sed -n '1,160p' ~/vps-deploy-notes.md
```

---

## 8) Clone your repo onto the VPS (GitHub SSH auth)

**Explanation:** The VPS initially couldn’t clone because GitHub didn’t trust any key on the VPS. You fixed this by creating a dedicated key and forcing Git to use it.

### 8.1 Prepare project directory

```bash id="5jki3e"
mkdir -p ~/circle
ls -la ~/circle
```

### 8.2 Attempt clone (failed initially)

```bash id="ukqtjo"
git clone git@github.com:cawooda/circle.git ~/circle
# error: Permission denied (publickey)
```

### 8.3 Generate a dedicated GitHub key on the VPS

```bash id="0ues2f"
ssh-keygen -t ed25519 -C "deploy@srv1448942 github" -f ~/.ssh/github_ed25519
cat ~/.ssh/github_ed25519.pub
```

Then add that public key to GitHub as:

- Repo **Deploy Key** (recommended), or
- Account SSH key

### 8.4 Force SSH to use that key for github.com

```bash id="sq9gfo"
cat > ~/.ssh/config <<'EOF'
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/github_ed25519
  IdentitiesOnly yes
EOF
chmod 600 ~/.ssh/config
```

### 8.5 Confirm SSH auth and clone

```bash id="1zad7l"
ssh -T git@github.com
rm -rf ~/circle/* && git clone git@github.com:cawooda/circle.git ~/circle
ls -la ~/circle
```

---

## 9) Install Node dependencies (using `npm ci`)

**Explanation:** Deployment best practice is `npm ci` for repeatability; it requires lockfiles in sync.

### 9.1 Initial attempt failed due to lock mismatch (fsevents)

Your root script is:

```json id="q5kbly"
"install": "cd server && npm ci && cd ../client && npm ci"
```

### 9.2 Fix approach that worked

- Run `npm install` locally to refresh lockfile(s)
- Commit and push
- Pull on VPS
- Ensure npm major matches lockfile (you ended up on npm 10.8.2)
- Run install again on VPS

**Commands used:**
_On Mac (local):_

```bash id="t2oh82"
npm install
git add -A
git commit -m "Update lockfiles"
git push
```

_On VPS:_

```bash id="gb36gr"
cd ~/circle
git pull
cd ~/circle && npm run install
```

**Verify node_modules:**

```bash id="it9c2p"
cd ~/circle && ls -ld server/node_modules client/node_modules
```

---

## 10) Server environment file on VPS

**Explanation:** Production environment config lives on the server, not in git. Use the variable names your code expects.

**Command used:**

```bash id="wesite"
nano ~/circle/server/.env
```

**Your current VPS `.env` (as shared):**

```env id="2ur2qt"
PORT=5000
HOST=http://localhost
NODE_ENV=development
MONGO_CONNECTION_STRING=mongodb://127.0.0.1:27017/circle_db
SECRET_KEY=...
SALT_WORK_FACTOR=10
TOKEN_EXPIRES_IN=1d
CLICKTOKEN=...
CLICK_SEND_URL_SEND_ENDPOINT=https://rest.clicksend.com/v3/sms/send
TESTING_PHONE=...
EMAIL_HOST=smtp.hostinger.com
EMAIL_USER=hello@circleindependent.com
EMAIL_PASSWORD=...
DEVELOPMENT=true
SEED_OK=true
SEED_PASSWORD=...
SEED_PHONE_1=...
SEED_PHONE_2=...
```

**Principle:** for production, you’ll later flip:

- `NODE_ENV=production`
- `DEVELOPMENT=false`
- `SEED_OK=false` (or remove)
- and update DB string to authenticated user once Mongo is running

---

## 11) MongoDB install attempt (Debian repo issue) → switch to Docker

**Explanation:** `mongodb-org` is not in Debian default repos and Debian 13 can be ahead of MongoDB’s official distro targeting. Docker avoids repo compatibility issues.

### 11.1 Failed apt install (expected on trixie)

```bash id="a8nm58"
sudo apt-get install -y mongodb-org
# E: Unable to locate package mongodb-org
sudo systemctl status mongod --no-pager
# Unit mongod.service could not be found.
```

### 11.2 Use MongoDB Docker image (started)

First, docker access for deploy:

```bash id="hp227u"
docker pull mongo:8.0
# permission denied to docker socket
sudo usermod -aG docker deploy
newgrp docker
docker ps
```

Then pull works:

```bash id="tdymgm"
docker pull mongo:8.0
```

_(At this point, you were about to proceed to running the container.)_

---

# Where you are now (checkpoint)

- Server hardened + firewall ✅
- Nginx serving domain config + `/graphql` proxy ready ✅ (backend not yet running)
- Repo cloned ✅
- Dependencies installed (`npm run install`) ✅
- PM2 installed + systemd startup configured ✅
- Docker permissions fixed for deploy ✅
- MongoDB image pulled ✅

---

# Next stages to complete deployment (summary)

1. **Run MongoDB container** with:

   - persistent volume
   - bind to `127.0.0.1:27017`
   - auth enabled
   - create DB user for `circle_db`

2. **Update `MONGO_CONNECTION_STRING`** to include user/pass + `authSource`.

3. **Start Node server under PM2** on `127.0.0.1:5000`.

4. **Confirm `/graphql` works** locally and via Nginx (no more 502).

5. **Build React client** and deploy build output into `/var/www/app.circleindependent.com`.

6. **Finalize PM2 persistence**: `pm2 save`.

7. **DNS + HTTPS**: point `app.circleindependent.com` to your VPS IP and run Certbot.

---
