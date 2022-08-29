# The (Un)official Waste of Space VSCode Plugin
## Overview

 - Supports instantly publishing to Pastebin, Hastebin and Github Gists.
 - Potential support for intellisense
 - Better modules
 Warning: This plugin is in beta. Many features are not added, unfinished or bugged. Use with caution.
 This plugin is best used with the Lua/Luau plugin aswell.
## Docs
**Publishing**
To publish your script to Paste/Hastebin or Github Gists (unsupported at the moment) press Ctrl + Shift + P to open the command palette. Then, type "WoS: Publish to Hastebin/Pastebin/Github Gists". Note that you may be prompted to enter API credentials. If you want to automate this, you can do so in the plugin settings.
**Better Modules**
Waste of Space doesn't support requiring scripts like this:

    local canvas = require("script link here")
    canvas.DoThing(Param1, Param2)

However, with the plugin you can add comments at the top of your file to require scripts like in C++.

        --COMPILE
        canvas = {}
        --IMPORT https://gist.githubusercontent.com/Weldify/f6df89c12c7edd89cf4f7943db053832/raw/d5d2aa3887fcda2275233576db5ba299c4c5eb3b/canvas.lua
        local screen = GetPartFromPort(1, "Screen")
    
    canvas.prepare(screen, 128, 128, 5)
    
    canvas.setColor(canvas.COL_ORANGE)
    canvas.setPivot(.5, .5)
    
    local angle = 0
    while true do
    	angle += Wait()
    	canvas.setAngle(angle)
    
    	canvas.clear()
    
    	canvas.polygon(64, 64, 0, 0, 64, 0, 32, 64)
    
    	canvas.present()
    end
   
   In this example, we import the raw "canvas.lua" file from [Weldify's canvas module.](https://gist.github.com/Weldify/f6df89c12c7edd89cf4f7943db053832)
   Note that --COMPILE **must** be at the top of the file, or no checks will be done.
   However, --IMPORT can be placed anywhere in the file.
   IMPORT works by replacing the import statement with the data from the posted URL.
   The "canvas = {}" part isn't required but is recommended to avoid VSCode from throwing an error. The reason it doesn't have the local keyword is so the variable can be replaced by the canvas module.
   However, putting this script in Waste of Space will throw an error. This is because you have to "compile" the program.
   To do this, type Ctrl + Shift + P and type "WoS: Compile". Select the compile command.
   Note: This currently doesn't do anything. 
