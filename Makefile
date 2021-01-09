all: install clean test build

install:
	yarn install

test:
	yarn test

compile:
	yarn tsc --build packages/validator/tsconfig.build.json
	yarn tsc --build packages/rest-api-server/tsconfig.build.json
	yarn tsc --build packages/open-api-endpoint/tsconfig.build.json

build: compile

publish:
	echo "publish"

clean:
	yarn tsc --build --clean
	yarn tsc --build packages/validator/tsconfig.build.json --clean
	yarn tsc --build packages/rest-api-server/tsconfig.build.json --clean
	yarn tsc --build packages/open-api-endpoint/tsconfig.build.json --clean
	rm -rf packages/**/dist dist

.PHONY: build clean compile all test install
