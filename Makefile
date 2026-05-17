DEPLOY_TARGET ?= /Volumes/data/websites/blackpixelrecords.com

.PHONY: deploy build

build:
	./deploy.sh

deploy:
	./deploy.sh "$(DEPLOY_TARGET)/"
