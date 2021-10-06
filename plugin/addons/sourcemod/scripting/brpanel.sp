#pragma semicolon 1
#include <sourcemod>
//#include <multicolors>


public Plugin myinfo = {
  name = "BRPanel",
  author = "Pepe",
  description = "CSGO Plugin for BRPanel",
  version = "1.0.0",
  url = "https://github.com/msmaiaa/csgo-brpanel"
}

char gS_dbConfig[] = "brpanel";
ConVar gC_serverName;
Database gH_dbHandler = null;

public void OnPluginStart() {
  gC_serverName = CreateConVar("sm_serverName", "name", "This is the UNIQUE server name that will be needed to retrieve its cargos.");
  RegConsoleCmd("sm_refreshCargos", Command_RefreshCargos);
  AutoExecConfig(true, "BRPanel");
}

//-----------------------//
//Functions
//-----------------------//
public void OnConfigsExecuted() {
  if(!gH_dbHandler) {
    PrintToServer("[BRP] Database connection not found, trying to reconnect.");
    DB_Connect();
    return;
  }
  PrintToServer("[BRP] Database connection available, refeshing Cargos now.");
}

//Function to connect to the database
void DB_Connect() {
  PrintToServer("[BRP] Creating database connection");
  if(gH_dbHandler != null) {
    delete gH_dbHandler;
  }
  if(SQL_CheckConfig(gS_dbConfig)) {
    Database.Connect(SQLConnect_Callback, gS_dbConfig);
  }else {
    PrintToServer("[BRP] Error while trying to connect to the database, the plugin config is missing on databases.cfg");
  }
}

//Function to refresh the cargos at the server
void refreshCargos() {
  char ls_BRP_serverName[512];
  gC_serverName.GetString(ls_BRP_serverName, sizeof(ls_BRP_serverName));
  char cargoListQuery[4096];
  Format(cargoListQuery, sizeof(cargoListQuery), "SELECT steamid, flags FROM user_cargo WHERE server_name='%s'", ls_BRP_serverName);
  gH_dbHandler.Query(refreshCargosCallback, cargoListQuery, DBPrio_High);
}

//Function to add double quotes at the beginning and at the end of a string
char addQuotes (char data[100]) {
  char buffer[100];
  strcopy(buffer, sizeof(buffer), data);
  Format(buffer, sizeof(buffer), "%s%s%s", '\"', data, '\"');
  strcopy(data, sizeof(data), buffer);
}

//-----------------------//
//Callbacks
//-----------------------//
public void refreshCargosCallback(Database db, DBResultSet result, char[] error, any data) {

  if (result == null) {
    PrintToServer("[BRP] Query Fail: %s", error);
    return;
  }

  PrintToServer("[BRP] Query results done, opening admins_simple file for writing");

  new String: g_sFilePath[PLATFORM_MAX_PATH];
  BuildPath(Path_SM, g_sFilePath, sizeof(g_sFilePath), "/configs/admins_simple.ini");
  new Handle: FileHandle = OpenFile(g_sFilePath, "w");
  WriteFileLine(FileHandle, "//This file is maintained by BRPanel, do not add any entries in this file as they will be overwritten by plugin");

  while (result.FetchRow()) {
    char steamid[100];
    char flags[100];
    result.FetchString(0, steamid, sizeof(steamid));
    result.FetchString(1, flags, sizeof(flags));
    addQuotes(steamid);
    addQuotes(flags);
    PrintToServer("[BRP] fetched entries || ===> %s %s", steamid, flags);
    WriteFileLine(FileHandle, "%s  %s", steamid, flags);
  }

  CloseHandle(FileHandle);

  PrintToServer("***[BRP] Cargos updated, refreshing the admins on the server.");
  ServerCommand("sm_reloadadmins");
  //ServerCommand("sm_reloadtags"); //to update player tag for hextags plugin
}

public void SQLConnect_Callback(Database db, char[] error, any data) {

  PrintToServer("[BRP] SQL Connection created successfully");

  if (db == null) {
    PrintToServer("[BRP] Can't connect to SQL server. Error: %s", error);
    return;
  }
  gH_dbHandler = db;
  refreshCargos();
}

//-----------------------//
//Commands
//-----------------------//

//This function manually triggered via rcon or server console to refresh the cargos on the server
public Action Command_RefreshCargos (int client, int args) {
  PrintToServer("[BRP] Executing manual refresh triggered by command");

  if((client == 0) || (CheckCommandAccess(client, "", ADMFLAG_GENERIC))) {
    if(client > 0) {
      PrintToChat(client, "[BRP] Atualizando cargos no servidor");
    }
    PrintToServer("[BRP] Command author is authorized, proceeding execution");
    refreshCargos();
  }else {
    PrintToChat(client, "Você não possui permissão para fazer isso, bobinho.");
  }
  return Plugin_Handled;
}