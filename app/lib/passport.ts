import passport from "passport";
import SteamStrategy from "passport-steam";
import * as SteamID from '@node-steam/id';
import { logInDb } from "./logger";
import User from "models/User";

passport.serializeUser(function(user, done) {
	done(null, user);
});
  
passport.deserializeUser(function(obj, done) {
	done(null, obj);
});

const domain = process.env.NODE_ENV == "production" ? process.env.DOMAIN_PROD : process.env.DOMAIN_DEV 

passport.use(new SteamStrategy({
	returnURL: `${domain}/api/auth/return`,
	realm: `${domain}`,
	apiKey: `${process.env.STEAM_API_KEY}`
}, async(_, profile, done) => {
	const formattedUser: any = beautifyUser(profile)
	let userInDb
	userInDb = await User.findOne({
		where: {
			steamid: formattedUser.steamid
		}
	})
	if(!userInDb) {
		console.log(process.env.SUPERADMIN)
		userInDb = await User.create({
			data: {
				steamid: formattedUser.steamid,
				user_type: process.env.SUPERADMIN === formattedUser.steamid ? 2 : 0,
				name: formattedUser.personaname
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