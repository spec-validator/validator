all: install clean test build

install:
	yarn install

test:
	yarn test

compile:
	yarn tsc --build tsconfig.build.json

build: compile

publish:
	echo "publish"

clean:
	yarn tsc --build --clean
	yarn tsc --build tsconfig.build.json --clean
	rm -rf packages/**/dist dist

.PHONY: build clean compile all test install
