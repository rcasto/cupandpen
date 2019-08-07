## Animation Performance

Currently I'm working on drawing images with quad trees. That in and of itself deserves further explanation, but we will table that for now. In looking into this though, I needed to investigate better animation performance.

I'm currently trying to incorporate a web worker into my animation loop flow. My current thinking at least is that the animation loop will query the web worker on each animation tick. If there is nothing ready then no update occurs and the web worker responds or ignores as such. If there is an update ready, then the web worker provides the updated state to draw for that frame.

