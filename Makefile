.PHONY: deploy build favicons

build:
	./deploy.sh

favicons:
	python3 scripts/generate-favicons.py

deploy:
	./deploy.sh
