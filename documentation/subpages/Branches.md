[(Back to To TOC)](../TOC.md)
# Important branches
- Refactor Viewport Helpers [(view code)](https://github.com/jpiland16/hmv_test/tree/refactor-viewport-helpers)
  - Has some experimental UI improvements, including a [PlayBar](https://github.com/jpiland16/hmv_test/blob/refactor-viewport-helpers/src/components/PlayBarAlt.js) that
  pauses while you are clicking and holding on it. Generally is outdated.
- Modify Calibration Form [(view code)](https://github.com/jpiland16/hmv_test/tree/modify-calibration-form)
  - Adds a 'sample rate' input to the calibration form, which responds to issue [#14](https://github.com/jpiland16/hmv_test/issues/14). Doesn't yet implement the server-side code to
  properly implement the change.
- Split Screen [(view code)](https://github.com/jpiland16/hmv_test/tree/splitscreen)
  - The goal of this branch was two allow a split screen feature so two dataset trials could be viewed side by side
  - Has the CSS set up to do this but uses outdated components. If you want to incorportate this feature, I'd recommend pulling the styling from the Viewport file[(see code)](https://github.com/jpiland16/hmv_test/blob/splitscreen/src/components/Viewport.js) and using it with the updated shared visualizer object. 
  - To view the split screen layout, if you go to the menu and file tree in this branch, you will see a button to 'Enter Split Screen'. 
