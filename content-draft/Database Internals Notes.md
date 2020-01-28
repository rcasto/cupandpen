#Database Internals Notes

These are notes I took while reading the book [Database Internals](https://www.databass.dev/). These notes are not exahustive and don't go over everything in the book of course, but these are some synthesized notes that I have put together.

## Chapter 1 - Introduction and Overview

There are 2 main types of databases:

- In memory
- On disk

Many, however, take a hybrid approach to both of these extremes. And no matter what in memory databases need to have an on disk presence to recover.

Many databases are represented as a table, consisting of rows and columns.

A row typically makes up a **record**.

The intersection of a row and column typically makes up a **field**.

When storing these tables on disk there a few options or ways to store them:

- Row oriented
- Column oriented

With the row oriented option, all fields associated with a record will be stored together contiguously.

With the column oriented option, all fields of a particular column will be stored together contiguously.

In both of these approaches a record is typically identied by a primary key or identifier.

With the column oriented approach the column field either explicitly also includes the primary key pointing to the record it corresponds to, or this is implicit based off the index offset of the column record.

The choice between row or column oriented, ultimately comes down to the data access pattern. If all fields associated with a record will typically be used, row oriented is most likely the best bet. If computations will typically only take place on a few fields within a record, column oriented may be the best bet.

3 common vectors/variables used by storage structures:

- Buffering
- Immutability
- Ordering

## Chapter 2 - B-Tree Basics

Data structures like Binary Search Trees typically live completely in memory and are not persisted to disk.

This model/method is not always feasible though, especially in memory constrained environments and situations where the amount of data is very large.

When persisting structures to disk you typically want to reduce the amount of disk seeks necessary, as the smallest unit that can be read from disk is a **block** or **page** and a disk seek takes times, especially if you are not dealing with an SSD.

The goal or target data structure for on disk scenarios typically then has a high fanout per node. **Fanout** refers to the number of child nodes a node can have. The higher the fanout, the lower the height of the search tree.

If a node stores N items or keys, then the fanout from that node is N + 1.

What is typically referred to as a B-Tree is actually a B+ Tree. A B-Tree allows for any node to store data, a B+ Tree typically only has data stored in the leaf nodes, which all exist on the same level. These trees are balanced.

Let's say a B-Tree has order M. This means that at most, each node can hold up to M keys. This means then that each node can have at most M + 1 children.

It should be noted that there are many variants of B-Trees, but all of them share similarly the goals of the structure and notion of storing multiple keys in nodes to increase fanout, thus decreasing tree height.

The size of an individual node is typically the size of a disk block or page.

When searching for a particular key or range, the search process works as follows:

- Within internal/root nodes utilize binary search to find the correct subtree to investigate next
- Traverse to next node, reading disk block, and repeating above
- This is done until the key is found, sibling nodes are also investigated if this is a range query

To better support range queries the leaf nodes of the B-Tree are typically connected together as a linked list, this could be done at all levels of the tree as well.

Insertion can incoportate the necessity to split nodes when they reach overflow.

Deletion can incportate the necessity to merge nodes when the reach undeflow.

##Chapter 3 - File Formats

The previous chapter was primarily an introduction to B-Trees and their operations. Describing them as great structures for on disk persistence, but not describing how they were to be laid out on disk. You could think of the previous chapter as describing them as in-memory structures, which B-Trees can certainly also be implemented as, but is not how they are typically used in the real world.

### General file formats

In order to lay these structures out on disk we must first understand a little bit about file format structure. Files are typically laid out in the following way:

`[file header,  ... file data ... , file footer]`

The file header and the file footer are typically of a fixed size and contain metadata describing the file format as well as the data the file contains.

When dealing with designing a file format for a mix of fixed size data as well as variable sized data, such as strings, it can be useful to group all the fixed size data together.

At the end of this grouping then you can add the variable sized data. This allows jumping directly to the start of the variable sized data section. For each variable sized data section you also need to store the size of this variable data explicitly. To then get to the next variable size data section you would skip the fixed size data portion then add the size of the variable size data section to skip.

### File formats applied to B-Trees

Disk space is typically abstracted into **pages**. Pages are then typically made up of a fixed number of **blocks**. Blocks are the smallest unit that can be read or written then to disk. Blocks have a fixed size that differs depending on the disk hardware.

When adding a new file to disk, a chunk of disk space must first be found that can fit the file. This space can span across multiple pages or be contained within one page. If it is contained within 1 page, that page is typically kept in memory until it is filled and then the in memory buffer is written to disk. If it spans multiple pages there are different techniques that can be applied. The multiple pages containing the file data can be contiguous as in they are right next to eachother or they can be disconnected. In the case that they are disconnected the pointers to the varying pages, must be kept in the file header or file footer as metadata.

Applying the notion of pages back to the B-Tree, each node is typically represented as page on disk, or a set of pages linked together. There are then 2 types of node/page structures with this notion:

- Non-leaf nodes storing keys and pointers to nodes
- Leaf nodes storing keys and values

The **slotted page technique** makes use of an abstraction called a **cell**. A page with this technique is comprised of cells. The cells then are comprised of blocks. These cells themselves are formatted similar to files in that they have a cell header that contains metadata about the cell itself. The cell is accessed via finding the page id the cell is associated with and then adding the offset from the page start to the beginning of the cell.

There are 2 types of cells:

- Key cells
- Key-Value cells

Cells do not have to be of the same size, but they are typically typified via an Enum or constant.

Pages now have the traditional page header, but it now also includes the number of cells present in the page. Then after the fixed page header portion, the pointers to the various cells are stored.

`[Page Header, Cell Pointers,... -> Available space <- ..., Cell 2, Cell 1]`

Although data may be inserted into cells in an order that is not sorted, the pointers to the cells themselves can be sorted to adjust the ordering and make it proper for a binary search to be able to be performed.

To reclaim space within a page, if a cell is removed. An availablility list of cells, which have been free'd is typically maintained in memory. If there is available space to fit newly added data, but no individual available cell can fit the data, then the page must be read and re-written, defragmenting the "live" cells, and allowing the available space to reclaimed such that the new data can fit.

## Chapter 4 - Implementing B-Trees

## References

- https://www.w3.org/TR/IndexedDB-2/
- https://en.wikipedia.org/wiki/B-tree
- https://www.databass.dev/
