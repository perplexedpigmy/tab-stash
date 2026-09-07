# Tab Stash

[![ci](https://github.com/josh-berry/tab-stash/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/josh-berry/tab-stash/actions?query=branch%3Amaster+)
[![codecov](https://codecov.io/gh/josh-berry/tab-stash/branch/master/graph/badge.svg)](https://codecov.io/gh/josh-berry/tab-stash)

This is a Chrome port of Josh Berry's great work, ported to Chrome/Brave/Edge. I was missing it in my Brave browser, as I found all the Chrome alternatives lacking.

```text

Imitation is the sincerest form of flattery that mediocrity can pay to greatness.
```

Oscar Wilde

Can't keep all your tabs straight? Need to clear your plate, but want to come
back to your tabs later?

Tab Stash is a no-fuss way to save and organize batches of tabs as bookmarks.
Sweep your browser clean with one click of the Tab Stash icon (if configured).
Your open tabs will be stashed away in your bookmarks, conveniently organized
into groups. When it's time to pick up where you left off, open Tab Stash and
restore just the tabs or groups you want.

<img src="docs/screenshot.png" alt="Screenshot" width="100%"/>

## Want to give it a try?

Install Tab Stash from the [Chrome Web Store]!

[Chrome Web Store]: https://chromewebstore.google.com/

## Build and Packaging Instructions

You'll need a UNIX-like system (e.g. Mac or Linux) to build Tab Stash.
Unfortunately, building on Windows is not supported due to the multiple build
steps involved (although patches to make the build more cross-platform are
welcome). Here's what you need to do:

1. Install dependencies. You can use the handy `scripts/build.mjs` script to do it
   automatically on supported OSes/distros (latest macOS and Ubuntu 22.04 are
   known to work). Or if you prefer to do it manually, install the following:
   - Node.js and `npm` (the latest "Current" or "LTS" release)

   - Inkscape version 1.0 or newer--the CLI must be available as `inkscape` in
     your PATH. (Note that Inkscape is known _not_ to work when installed via
     `snap`; if you're on Ubuntu, please install it with `apt-get` instead.)

2. **To build a debug/development version:** Run `npm run build:dev`. (You can use `-j<...>`
   if you want for a parallel build.)

3. **To build a release version (for packaging or review):**
   1. Make sure your source tree has no uncommitted changes (`git status` should
      say, `nothing to commit, working tree clean`).

   2. `git checkout` the tag for the version you want to build.

   3. Run `npm run build`. (You can use `-j<...>` if you want for a parallel build.)

4. You'll get the following artifacts:
   - `dist`: The unpacked Chrome extension

   - (release builds only) `releases/tab-stash-X.XX-hhhhhhh.zip`: The packed
     Chrome extension (this is what gets uploaded to the Chrome Web Store)

   - (release builds only) `releases/tab-stash-src-X.XX-hhhhhhh.tar.gz`: A clean
     git checkout of the source tree for the release (also for uploading to the Chrome Web Store)

## Want to help out?

If you're interested in contributing to Tab Stash, be sure to read [the
contributing guidelines][contrib] to get oriented and learn how to submit your
changes for inclusion in future releases.

[contrib]: docs/contributing.md

## Want to re-distribute Tab Stash?

You're more than welcome to do so according to the terms of the
[license](LICENSE), and I'm happy to work with you to make sure Tab Stash users
have a great experience on your platform. I do have a couple requests, though:

- Please _only_ ship release packages that are built using `npm run build` per the
  instructions above. Debug builds may cause performance problems or include
  other changes that make for a poor user experience.

- If you find it necessary to apply patches to Tab Stash, please work with me
  _ahead of time_ to get your proposed changes merged into a release. I
  unfortunately cannot provide support to users running patched builds. (If your
  patch introduces a bug, it's going to cause a lot of headache for the user
  only for me to have to tell them to install the official version.)

[Chrome Web Store]: https://chromewebstore.google.com/
