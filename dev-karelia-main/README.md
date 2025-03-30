# dev-karelia
Dev Karelia is a web site for the ICT laboratory. At the moment the site address is  dev-karelia.azurewebsites.net, but may be changed later.

The CosmosDB is used as a database at the moment. Therefore note:

The COSMOS_CONNECTION_STRING environment variable has to be set in all running environments,
like developer workstation or Azure App Service or the like. The environment variable can be set
in PowerShell using the command:

$env:COSMOS_CONNECTION_STRING = "<copy here the string from Azure CosmosDB account, keys section>"
