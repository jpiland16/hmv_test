[(Back to To TOC)](https://github.com/jpiland16/hmv_test/blob/master/documentation/TOC.md)
# Menu [(view code)](https://github.com/jpiland16/hmv_test/blob/master/src/components/visualizer-screen/menu/Menu.js)

The menu component controls what is displayed on the Visualizer Screen and is made up of several nested components. The structure is as follows:

- Menu Component
  - Menu Button [(view code)](https://github.com/jpiland16/hmv_test/blob/master/src/components/visualizer-screen/menu/MenuButton.js) - allows the user to open and shut the menu
  - Menu Panel [(view code)](https://github.com/jpiland16/hmv_test/blob/master/src/components/visualizer-screen/menu/MenuPanel.js)
    - Side Action Bar [(view code)](https://github.com/jpiland16/hmv_test/blob/master/src/components/visualizer-screen/menu/components/SideActionBar.js) - displays the icon buttons to switch between subpanels
    - Main Panel [(view code)](https://github.com/jpiland16/hmv_test/blob/master/src/components/visualizer-screen/menu/MenuPanel.js)
      - Seach Bar [(view code)](https://github.com/jpiland16/hmv_test/blob/master/src/components/visualizer-screen/menu/components/main-panel/SearchBar.js) - allows user to search for files
      - Bottom Action Bar [(view code)](https://github.com/jpiland16/hmv_test/blob/master/src/components/visualizer-screen/menu/components/main-panel/BottomActionBar.js) - allows user to pin the menu
      - Interaction Panel [(view code)](https://github.com/jpiland16/hmv_test/blob/master/src/components/visualizer-screen/menu/components/main-panel/InteractionPanel.js) - contains the subpanels

## Production Mode Subpanels
The menu displays differnt subpanels depending on whether the user is in production mode or dev mode. In production mode the menu displays the following subpanels:

### Choose Files [(view code)](https://github.com/jpiland16/hmv_test/blob/master/src/components/visualizer-screen/menu/components/main-panel/subpanels/ChooseFiles/ChooseFiles.js)
Here the user can download files to their computer or select files to view. The files uploaded currently are the [luo-et-al-gait-dataset](https://www.nature.com/articles/s41597-020-0563-y#Sec6), the [OPPORTUNITY dataset](https://archive.ics.uci.edu/ml/datasets/opportunity+activity+recognition), and any user uploads. 

### Settings [(view code)](https://github.com/jpiland16/hmv_test/blob/master/src/components/visualizer-screen/menu/components/main-panel/subpanels/Settings/Settings.js)
Here the user can edit the time or card display. 

### About [(view code)](https://github.com/jpiland16/hmv_test/blob/master/src/components/visualizer-screen/menu/components/main-panel/subpanels/About/About.js)
This tab provides information about the site, gives credits, and (at the very bottom) has a button to enter development mode. 


## Dev Mode Subpanels
Development mode has the same panels as production mode but with a few additions:

### Test Model [(view code)](https://github.com/jpiland16/hmv_test/blob/master/src/components/visualizer-screen/menu/components/main-panel/TestModel/TestModel.js)
The test model allows users to test how adjusting quaternions for different bones effects the model. This tool can be useful for determining which transformation quaternions are appropriate for a particular dataset.

### Account [(view code)](https://github.com/jpiland16/hmv_test/blob/master/src/components/visualizer-screen/menu/components/main-panel/MyAccount/MyAccount.js)
This panel is currently empty but in the future it could be used for signing into a user account so that user uploads are private and a user can only view the files that they have uploaded or we have made accessible to everyone.

### Labs [(view code)](https://github.com/jpiland16/hmv_test/blob/master/src/components/visualizer-screen/menu/components/main-panel/Labs/Labs.js)
The labs section allows developers to experiment with new datasets and get them working properly before pushing them to the main visualizer. A guide to creating your own labs can be found [here](https://github.com/jpiland16/hmv_test/blob/master/documentation/subpages/Labs.md).



