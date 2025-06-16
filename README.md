# POI Finder
Simple web application frontend of the onboarding project. It allows to find POIs in the area of Hamburg.

## Local development

If you don't want to use a real server, you can locally start the mock-server, which is an extended json-server application. It provides an RESTfull API to access all necessary POI information. 

### Prepare local environment

If neccessary you can setup you local environment for node.js development using the provided ansible playbook. Note: you have to install ansible into your environment before.

```
sudo apt install ansible-core (if not already installed)
ansible-playbook setup-angular.yml --ask-become-pass
```

### Starting the mock-server

```
cd mock-server
npm init
npm start
```

### Starting the application

```
cd frontend
npm init
npm start
```
