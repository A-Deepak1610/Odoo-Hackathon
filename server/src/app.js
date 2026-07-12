const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const fs = require('fs');

const { requestLogger } = require('./core/middlewares/requestLogger');
const { errorHandler } = require('./core/middlewares/errorHandler');
const { ApiError } = require('./core/errors/ApiError');
const { logger } = require('./core/logger/winston');

const app = express();

// Global Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

// Request Logging
app.use(requestLogger);

// Dynamic Route Loader Architecture
const loadModules = () => {
  const modulesPath = path.join(__dirname, 'modules');
  
  if (!fs.existsSync(modulesPath)) return;

  const modules = fs.readdirSync(modulesPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  modules.forEach(moduleName => {
    try {
      const moduleIndex = path.join(modulesPath, moduleName, 'index.js');
      if (fs.existsSync(moduleIndex)) {
        const exportedModule = require(moduleIndex);
        if (exportedModule.router) {
          app.use(`/api/v1/${moduleName}`, exportedModule.router);
          logger.info(`Loaded module: ${moduleName} at /api/v1/${moduleName}`);
        }
      }
    } catch (err) {
      logger.error(`Failed to load module: ${moduleName}`, err);
    }
  });
};

loadModules();

// 404 Handler
app.use((req, res, next) => {
  next(new ApiError(404, 'Not found'));
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
