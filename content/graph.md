## Graph

I currently work on a team that implements a conversational authoring canvas. This canvas allows authors to create dialogs, which power conversational AI.

I wanted to step back and try and implement a bare bones model of the backing graph.

### Graph properties

- Edges can have direction or none at all
  - Undirected vs. directed
- Edges can have weights
  - This typically only applies for directed graphs
- Cycles can exist in the graph
  - Nodes could even self loop themselves

### Common implementations

Edge based vs. Node based