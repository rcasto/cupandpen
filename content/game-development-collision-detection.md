## Game Development (Collision Detection)
I've been playing the game [Baba Is You](https://hempuli.com/baba/) recently on my Nintendo Switch.  
This game has surprisingly simple art, looking like it could have been made in the 80's.  
The core of the game though, the rules, is something I find super interesting.  

Playing this game has made me want to make a game. I think it's the simplicity of the art and the demonstration that the core mechanics of the game are what really matter.  

So I've went about learning how to make a game.  
I want to make it for the web first, so I started re-learning how to use the [Canvas Web API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API).  
Then trying to think through the basics of the game animation loop.  MDN also has a good article on the [anatomy of a web game](https://developer.mozilla.org/en-US/docs/Games/Anatomy).

Here is the model I've come up with to start:
1. Get all objects in the world
2. Filter to objects in the particular scene that can move/animate
3. Update each objects internal state, producing their next render state
4. Check internal state of objects to check for collisions, or out of bounds objects and resolve them
5. Render objects to screen (next frame)
6. Repeat (schedule next animation tick)

Trying my hand at a 2D game.  
To check for collisions I've decided to use a [QuadTree](https://en.wikipedia.org/wiki/Quadtree), which can break down the 2D space and reduce the # of collision comparisons needed to be made between objects.  

In incorporating a QuadTree, I went ahead and built my own little javascript library called [simplequad](https://github.com/rcasto/simplequad).  

It is meant to aid in doing one thing well and that is collision detection. You pass in objects implementing a `Bound` interface. This allows simplequad to then bucket your objects appropriately. Then you can query the QuadTree produced with a boundary to see what objects are in said boundary window. If 2 objects are within the bounds of 1 objects bounding container, you have a collision.

On to the next topic to learn more on…collision resolution. I can detect collisions pretty well, but not so great at resolving them at the moment.