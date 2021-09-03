import { PrismaClient } from "@prisma/client";
import passport from "passport";
import SteamStrategy from "passport-steam";
import * as SteamID from '@node-steam/id';
import config from '../config.json'
import { logInDb } from "./logger";

passport.serializeUser(function(user, done) {
	done(null, user);
});
  
passport.deserializeUser(function(obj, done) {
	done(null, obj);
});

passport.use(new SteamStrategy({
	returnURL: `${process.env.DOMAIN}/api/auth/return`,
	realm: `${process.env.DOMAIN}`,
	apiKey: `${process.env.STEAM_API_KEY}`
}, async(_, profile, done) => {

	const formattedUser: any = beautifyUser(profile)
	const prisma = new PrismaClient()
	let userInDb
	userInDb = await prisma.user.findFirst({
		where: {
			steamid: formattedUser.steamid
		}
	})
	if(!userInDb) {
		userInDb = await prisma.user.create({
			data: {
				steamid: formattedUser.steamid,
				user_type: config.superAdminSteamId === formattedUser.steamid ? 2 : 0
			}
		})
		logInDb('Novo usuário registrado', formattedUser.personaname + ' - ' + formattedUser.steamid, 'Server')
	}
	return done(null, {
		...formattedUser,
		user_type: userInDb.user_type
	});
}));

const beautifyUser = (data) => {
	const id = new SteamID.ID(data.id)
	const newData = {
		...data._json,
		steamid64: data.id,
		steamid: id.getSteamID2()
	}
	newData.photos = data.photos
	return newData
}

export default passport;