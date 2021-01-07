build:
	yarn tsc --build
	cp packages/validator/package.json packages/validator/dist/
	cp packages/rest-api-server/package.json packages/rest-api-server/dist/
	cp packages/open-api-endpoint/package.json packages/open-api-endpoint/dist/

publish:
	echo "publish"

clean:
	yarn tsc --build --clean
	rm -rf packages/**/dist dist

.PHONY: build clean
