all: install clean test build

install:
	yarn install

test:
	yarn test

compile:
	yarn tsc --build tsconfig.build.json

%.postcompile:
	cp packages/$*/package.json packages/$*/dist/

all.postcompile: $(shell ls -d packages/*/ | sed -e 's/packages\///' | sed -e 's/\//.postcompile/')

build: compile all.postcompile

publish:
	echo "publish"

clean:
	yarn tsc --build --clean
	yarn tsc --build tsconfig.build.json --clean
	rm -rf packages/**/dist dist

.PHONY: build clean compile all.postcompile all test install
