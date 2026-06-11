# GitHub Repository Alphabetizer for Chrome

A lightweight Chrome extension that sorts the repository list on GitHub's home/dashboard page alphabetically.

## What it does

- Watches `github.com` pages for repository lists
- Sorts matching repository items from A to Z
- Re-applies sorting when GitHub updates the page dynamically

## Install locally

1. Open Chrome and go to `chrome://extensions`
2. Turn on `Developer mode`
3. Click `Load unpacked`
4. Select the [`chrome-repo-sorter`](./) folder

## Files

- [`manifest.json`](./manifest.json)
- [`content-script.js`](./content-script.js)

## Notes

- This version is built for Chrome Manifest V3
- It only targets `https://github.com/*`
