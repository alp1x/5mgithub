# 5MGitHub

<div align="center">
<img src="https://www.5mgithub.dev/logo.webp" height="64" width="64">
<br/>
FiveM-focused GitHub search — find scripts and resources that match your framework, with smart filtering and known devs highlighted.
</div>

## Installation

```bash
# Clone the repository
git clone https://github.com/alp1x/5mgithub
cd 5mgithub

# Install dependencies
bun i

# Copy environment file
cp .env.example .env
```

## Configuration

Edit `.env` file with your credentials:

```env
# GitHub OAuth App Credentials
# https://github.com/settings/developers -> New OAuth App
# Homepage URL: http://localhost:5173 (development)
# Callback URL: http://localhost:5173/api/auth/callback
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

# Upstash Redis (Cache)
# https://upstash.com/
UPSTASH_REDIS_REST_URL=""
UPSTASH_REDIS_REST_TOKEN=""
```

### Setting up GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: 5MGitHub (or anything)
   - **Homepage URL**: `http://localhost:3000`
   - **Callback URL**: `http://localhost:3000/api/auth/callback`
4. Copy `Client ID` and `Client Secret` to your `.env`

### Setting up Upstash Redis

1. Go to [Upstash Console](https://console.upstash.com/)
2. Create a new Redis database
3. Copy `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` to your `.env`

## Development

```bash
bun dev
```

## Contributors
* [VexRise](https://github.com/VexRise)
* [D4isDAVID](https://github.com/D4isDAVID)

### This project was inspired by awesomefivem from ILLeniumStudios
https://github.com/iLLeniumStudios/awesome-fivem

<samp>5mgithub.dev ASSUMES NO RESPONSIBILITY OR LIABILITY FOR ANY REPOSITORIES FOUND THROUGH THIS SERVICE. ALL REPOSITORIES SHOWN ARE PUBLICLY AVAILABLE AND OPEN-SOURCE. PLEASE CONDUCT YOUR OWN DUE DILIGENCE AND SECURITY REVIEWS PRIOR TO USING ANY FOUND REPOSITORY.</samp>
