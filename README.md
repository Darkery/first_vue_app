# DI Diagnostic Center UI

## Introduction

This the front-end service of [DI Diagnostic Center](https://github.wdf.sap.corp/devops-warriors/diagnostic-center).

## Required

Vue 2.0

## Dependency

| Name | Version |
| ---- | ------- |
| axios | ^0.19.2 |
| core-js | ^3.6.4 |
| echarts | ^4.8.0 |
| element-ui | ^2.13.2 |
| vis-data | ^7.0.0 |
| vis-network | ^8.2.0 |
| vis-util | ^4.3.4 |
| vue | ^2.6.11 |
| vue-router | ^3.4.3 |
| vue-vis-network | ^1.0.2 |

## Project Setup

### Local Run

**Compiles and hot-reloads for development**
```
npm install
npm run serve
```

**Compiles and minifies for production**
```
npm run build
```

### Run in Docker

```
docker build -t diagnostic-center-frontend .
docker run -d diagnostic-center-frontend
```

## Contact

Jing Li jing.li08@sap.com

Yuanyang Wang yuanyang.wang@sap.com