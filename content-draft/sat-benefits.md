## Switching to SAT

First off, what's SAT? It's the [separating axis theorem](https://en.wikipedia.org/wiki/Hyperplane_separation_theorem).

I've been thinking of switching to use it with the quadtree library I've been working on. Currently I check collisions against each other by doing type on type collision finders. Basically circle vs. bounding box, bounding box vs. bounding box,...

If I were to switch to SAT though what would I get though? One thing I'm finding is that I would automatically gain support for rotated bounding boxes. Of course I myself would have to integrate this support, but the algorithm can handle rotation.

I also believe I would no longer need any special type on type resolvers. There may be a special case for circles though within the global resolver.

The ability to also add or apply the minimum translation vector (MTV) is also something I would gain, or could integrate with.

I'm still trying to understand exactly how to utilize the MTV for collision resolution. Meaning how to use it to resolve the collision between 2 objects. It represents the magnitude of movement along the normal to separate the 2 objects.

At least that is the rough idea I have right now. I'm still learning...