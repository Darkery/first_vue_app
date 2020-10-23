# DI Diagnostic Center UI

## Introduction

This is the front-end service of [DI Diagnostic Center](https://github.wdf.sap.corp/devops-warriors/diagnostic-center). In order to help developers to display the DI system status and analyze the incidents, Diagnostic Center exhibites 3 aspects of the DI system: **Root Cause Analysis, Entities Relationship and Checkers Runtime**.

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
docker run -d -p 8080:80 diagnostic-center-frontend
```

## Description
 You could find all of the information you need by following the order( from LESS INFORMATION to MORE ) :

`Root Cause Analysis -> Entities Relationship -> Checkers Runtime`

### Root Cause Analysis
It lists all of the possible root causes, related entities and recommended actions from highest to lowest by the confidence. We plan to make it as the summary of all of check results. It shows you the easiest way to solve the incident. Generally, What you need to do to solve the incident is just click the relative recommended action and follow it.
However, you could only know the cause but not which part or which level of system is responsible for it. Entities Relationship contains this part of information.

### Entities Relationship
By defining basic entites in DI such as node, pod, tenant, this page shows the great association and aggregation relationships between entities. On this page, different color means different entities. Those with red border are suspected entities. Complete View shows all of the entities in this cluster, and Issue View only shows suspected entities and their relationships.

### Checkers Runtime
All of the check jobs status and their dependency are displayed in tab Checkers Runtime. It is the most detailed part in diagnostic center. This page could help you to know all of the existing jobs.

## Contact

Jing Li jing.li08@sap.com

Yuanyang Wang yuanyang.wang@sap.com
