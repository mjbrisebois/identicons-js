
SHELL		= bash
DIST_NAME	= identicons.bundled.js

#
# Runtime Setup
#
build:			dist/$(DIST_NAME)
dist/$(DIST_NAME):	src/*.js webpack.config.js Makefile package.json
	OUTPUT=$(DIST_NAME) npx webpack
	touch $@


#
# Testing
#
test:			test-unit
test-debug:		test-unit-debug
build-watch:
	OUTPUT=$(DIST_NAME) npx webpack --watch

test-unit:
	npx mocha --recursive ./tests/unit
test-unit-debug:
	LOG_LEVEL=silly npx mocha --recursive ./tests/unit
test-integration:		build
	npx mocha --recursive ./tests/integration
test-integration-debug:		build
	LOG_LEVEL=silly npx mocha --recursive ./tests/integration
test-e2e:		build
	npx mocha --recursive ./tests/e2e
test-e2e-debug:		build
	LOG_LEVEL=silly npx mocha --recursive ./tests/e2e/test_basic.js


#
# Project
#
package-lock.json:	package.json
	npm install
	touch $@
node_modules:		package-lock.json
	npm install
	touch $@


#
# Repository
#
clean-remove-chaff:
	@find . -name '*~' -exec rm {} \;
clean-files:		clean-remove-chaff
	git clean -nd
clean-files-force:	clean-remove-chaff
	git clean -fd
clean-files-all:	clean-remove-chaff
	git clean -ndx
clean-files-all-force:	clean-remove-chaff
	git clean -fdx


#
# NPM
#
prepare-package:	build
	gzip -kf dist/*.js
preview-package:	clean-files test prepare-package
	npm pack --dry-run .
create-package:		clean-files test prepare-package
	npm pack .
publish-package:	clean-files test prepare-package
	npm publish --access public .
