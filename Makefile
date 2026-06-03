DEPLOY_TARGET ?= /Volumes/data/websites/blackpixelrecords.com

.PHONY: deploy build favicons

build:
	./deploy.sh

favicons:
	python3 scripts/generate-favicons.py

deploy:
	./deploy.sh "$(DEPLOY_TARGET)/"
