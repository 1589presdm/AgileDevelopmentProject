const config = {
    // DATABASE CONFIGURATION:
    // connection string from Azure CosmosDB account, 'Keys' section
    // the environment variable has to be set in all running environments, like developer workstation
    // and the production environment, e.g. Azure Web App service environment
    connectionString: process.env.COSMOS_CONNECTION_STRING,
  
    // database name:
    databaseId: "portal",
  
    // containers info:
    userContainerId: "user"
    
  };
    
  module.exports = config;