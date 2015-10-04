import wikipedia
import sys

sentences = sys.argv.pop()
topic = sys.argv.pop()

try:
	print wikipedia.summary(topic, sentences=int(sentences))
except:
	print "Error"
