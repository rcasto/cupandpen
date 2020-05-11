##Readability

In working on [readability-component](https://github.com/rcasto/readability-component), it was necessary to develop a function that given a word was able to return the number of syllables in that word.

This problem is surprisingly difficult to solve across the wide amount of odd cases within [our language](https://en.wikipedia.org/wiki/English_language), so a [heuristic](https://en.wikipedia.org/wiki/Heuristic_(computer_science)) is generally the best approach.

In the readability-component scenario, the main use case for this syllable counting functionality is due to the number of syllables in a piece of text contributing towards the [Flesch reading-ease score](https://en.wikipedia.org/wiki/Flesch%E2%80%93Kincaid_readability_tests#Flesch_reading_ease). It essentially contributes towards the average number of syllables per word in a piece of text. The higher this is equating to a more difficult piece of text and vice versa.
$$
ReadingEase = {\displaystyle 206.835-1.015\left({\frac {\text{total words}}{\text{total sentences}}}\right)-84.6\left({\frac {\text{total syllables}}{\text{total words}}}\right)}
$$
The heuristic within readability-component for computing the number of syllables uses the following rules:

- Vowels consists of `a`, `e`, `i`, `o`, `u`, `y`
- Isolated single vowels contribute 1 syllable for the word
- Consecutive vowels contribute overall 1 syllable for the word
- If a word end in an "e" and has at least 2 syllables, remove the "e"
  - For silent "e" handling for words like "plane"
- If a word end in an "ed" and has at least 2 syllables, remove the "ed"
  - For cases where "ed" does not contribute a syllable, for words like "jumped"

Now, let's step back and think about it.

In one extreme case we could store a dictionary that holds all words and there associated number of syllables. At this point, figuring out the number of syllables for a word would only be a matter of looking that word up in the stored dictionary.

The opposite end of the spectrum is using a completely rules based approach. Given a word, a series of rules, such as the above, is ran against the word, then a number representing the amount of syllables for that word is output.

Typically the best approach though, seems to be a hybrid. Storing some of the most common words mapping to there syllable counts for lookup, then using rules based syllable count approaches on words not contained in this "offline" dictionary.







I'll be honest the performance is not the greatest right now for the readability-component. Especially on short text, the flaws shine in this environment. However, it is rather apparent, even for long text, that the rules mentioned above are not enough to cover the vast complexity of the English language.

But this is not an easy problem. I have references listed below, and these are literally thesis papers on the subject of syllabication and hyphenation. The problem of hyphenation is interesting, as a natural breaking point for words in word processing applications seem to naturally align to syllables.

## Alternative readability tests

There are more readability formulas than what is mentioned here. Although the Flesch-Kincaid readability ease is one of the most popular. Another popular one comes from Dale-Chall.

- Dale-Chall Readability Formula](https://en.wikipedia.org/wiki/Dale%E2%80%93Chall_readability_formula)

In this case, a corpus of words is used, that is primarily driven by familiarity or understanding of 4th graders. If a word is not in the corpus, it is considered difficult.

## References

- https://www.tug.org/docs/liang/liang-thesis.pdf
- https://dl.acm.org/doi/10.1145/364995.365002
- https://eprints.soton.ac.uk/264285/1/MarchandAdsettDamper_ISCA07.pdf
- https://dspace.mit.edu/bitstream/handle/1721.1/16397/03491095-MIT.pdf
- https://sites.cs.ucsb.edu/~pconrad/cs8/10F/labs/lab10/
- https://web.stanford.edu/class/archive/cs/cs106a/cs106a.1144/handouts/210%20Assignment%204.pdf
- https://www.howmanysyllables.com/howtocountsyllables

