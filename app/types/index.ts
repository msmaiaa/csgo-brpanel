import { NextApiRequest, NextApiResponse } from "next";

export interface ApiRequest extends NextApiRequest{
  user?: ISteamApiUser
}
export interface ApiResponse extends NextApiResponse{
  
}

export interface ISteamApiUser {
  avatar: string
  avatarfull: string
  avatarhash: string
  avatarmedium: string
  commentpermission?: number
  communityvisibilitystate?: number
  lastlogoff: number
  loccountrycode?: string
  personaname: string
  personastate: number
  personastateflags: number
  primaryclanid: string
  profilestate: number
  profileurl: string
  realname?: string
  user_type?: number
  steamid: string
  steamid64: string
  timecreated: number
}

///Settings
export interface INotificationSettings {
  id: number
  community_website: string
  community_name: string
  logo_url: string
  webhook_url: string
  send_disc_on_modification: boolean
  send_disc_on_sale: boolean
  send_discord_notifications: boolean
  send_email_sale: boolean
}
///

///Gamedig
export interface IServerQueryResponse {
  online?: boolean,
  data?: IGamedigQueryResponse
}

interface IRawData {
  protocol: number
  folder: string
  game: string
  appId: number
  numplayers: number
  numbots: number
  listentype: string
  environment: string
  secure: 1
  version: string
  steamid: string
  tags: Array<string>
}

interface IPlayerData {
  name: string
  raw: {
    score: number
    time: number
  }
}

interface IGamedigQueryResponse {
  name: string
  map: string
  password: boolean
  raw: IRawData
  maxplayers: number
  players: Array<IPlayerData>
  bots: Array<any>
  connect: string
  ping: number
}
///

export interface IUser_Cargo {
  id: number
  cargo_id: number
  flags: string
  cargo: ICargo
  server: IServer
  server_name: string
  steamid: string
}

export interface IServer {
  full_name: string
  name: string
  ip: string
  port: string
  rcon_pass?: string
  created_at?: string
  updated_at?: string
}

export interface IUser {
  name: string
  id: number
  steamid: string
  user_type: number
  created_at?: string
  updated_at?: string
  user_cargo?: Array<IUser_Cargo>
}

export interface IAddUser {
  cargo: ICargo
  days: number
  user: IUser
  server: IServer | string
}

export interface ICargo {
  stripe_id: string
  name: string
  price: string
  duration: string
  individual: boolean
  currency: string
  flags: string
  id?: string
  created_at?: string
  updated_at?: string
  serverName?: string
  cargo_server?: [any]
}

export interface ICargo_Server {
  cargo_id: number
  id: number
  server_id: number
  cargo: ICargo
}