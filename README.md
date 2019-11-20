## 1. Setup
```bash
npm install
```
- install all npm and bower dependencies

**Note:** If `npm install` fails during dependency installation it will be likely caused by `gulp-imagemin`. In that case remove `gulp-imagemin` dependency from `package.json`, run `npm install` again and then install `gulp-imagemin` separately with following command: `npm install gulp-imagemin --save-dev`

## 2. Watch files
```bash
npm start
```
or
```bash
gulp
```

- all CSS/HTML will be watched for changes and injected into browser thanks to BrowserSync

## 3. Build production version
```bash
npm run build
```
or
```bash
gulp build
```

## 4. Start webserver without watch task
```bash
npm run server
```
or
```bash
gulp server
```

## 5. Start webserver from build folder
```bash
npm run serverbuild
```
or
```bash
gulp server-build
```

## 6. File & Folder Structure
app/app.js - Application Main File
app/config.js - Application Configuration
app/controller.js - In this case I've only 1 controller but if it increases then it should be folder and all controller should comes inside it
components - For services, directives, filters and common functions
js - Javascript libraries
styles - Stylesheet
views - HTML templates