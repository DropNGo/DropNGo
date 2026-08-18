# Cloudflare deployment fix

The repository contains a legacy gitlink named `falsche`. Cloudflare Workers Builds attempts to update repository submodules during checkout, so the gitlink must be removed for a clean deployment. This file records why the deployment branch was repaired.
