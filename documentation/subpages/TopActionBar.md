# Top Action Bar [(view code)](https://github.com/jpiland16/hmv_test/blob/master/src/components/visualizer-screen/TopActionBar.js)
The top action bar handles displaying any information and actions that should be available at all times without having to
open the Menu. As of [this commit](https://github.com/jpiland16/hmv_test/commit/6782b2c8e27f35666bdaa3e23742f20b41a96cfe), it has
the following jobs:
- Display the name of the currently selected file, or "No file selected" if there is none.
- Display a button that allows the user to open the menu of data file choices.
- Display a button for closing the currently selected file.

The other options seen at the top of the Visualizer, including "Reset Model" and
some camera adjustments, are contained by the Visualizer itself, and they should always
show up at the top after Top Action Bar items.

All button functionality for the Top Action Bar is passed in as React props, and 
the component should not need to handle the execution of button callbacks. Its sole
responsibility is controlling the layout of the items and making sure they display in
the correct conditions.