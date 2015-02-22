all: bundle.js

bundle.js: main.js
	../node_modules/browserify/bin/cmd.js main.js > bundle.js

clean:
	rm bundle.js
