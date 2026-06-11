# GitHub Repository Alphabetizer

A small  extension that sorts the repository list on GitHub's home/dashboard page alphabetically.

## What it does

- Watches `github.com` pages for repository lists
- Reorders matching repo cards/items by name
- Leaves the rest of the page alone

## Notes

- This extension is scoped to `github.com`
- It is intentionally lightweight and does not require a popup or options page


# Chrome

## Install for local testing

1. Open Chrome and go to `chrome://extensions`
2. Turn on `Developer mode`
3. Click `Load unpacked`
4. Select the [`chrome-repo-sorter`](./) folder

# Firefox

## Install for local testing

1. Open Firefox and go to `about:debugging#/runtime/this-firefox`
2. Click `Load Temporary Add-on...`
3. Select [`manifest.json`](./manifest.json)
