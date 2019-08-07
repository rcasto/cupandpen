## Game Development (Collision Resolution)

Currently on the path of collision resolution learning…it's pretty complicated. And here I thought I was decent at the maths.

I'm trying to combine the learnings from this into what I have previously learned with collision detection. Seeing if I can extend on what I have already built.

Let's start with what I've got so far.  

In the game loop, we get a timestamp with each call. This comes from `requestAnimationFrame()`. We can use this to have a global ticker and know how much time has passed since the previous render. That way we can know how much time to advance each of the moving objects in the scene.

Advancing the internal state of the objects is quite simple. Let's say the velocity of an object was `v` and it was at position `(x,y)`. On the next tick you would update it such that the updated or next position was `(x + vx * timeAdvanced, y + vy * timeAdvanced)`. The velocity is a vector with both a x and y component. This is how far it advances in those directions on each tick.

After updating the internal state of the objects, you now need to make sure all of the updated objects are in a valid state. You don't want to have objects go off screen most times and when objects intersect or overlap with eachother you typically want them to have some collision effect.

