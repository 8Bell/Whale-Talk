import React, { useState, useEffect } from 'react';

import { makeStyles, Theme } from '@material-ui/core/styles';

import NavBottom from './friends/friendsNavBottom';
import NavTop from './friendsNavTop';
import { authService, dbService } from './fbase';
import router from 'next/router';
import { Avatar, Grid, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	profile: {
		height: 100,
		backgroundColor: '#ccc',
		marginTop: 60,
	},
	profileAvatar: {
		top: '20%',
		left: '3%',
		width: 60,
		height: 60,
	},
	friends: {
		height: 80,
		backgroundColor: '#888',
	},
	friendsAvatar: {
		top: '25%',
		left: '3%',
		width: 50,
		height: 50,
	},
}));

export default function SignIn() {
	const classes = useStyles();

	const [init, setInit] = React.useState(false);
	const [isLoggedIn, setIsLoggedIn] = React.useState(false);
	useEffect(() => {
		authService.onAuthStateChanged((user) => {
			if (user) {
				setIsLoggedIn(true);
			} else {
				setIsLoggedIn(false);
				router.push('/home');
			}
			setInit(true);
		});
	}, []);

	// 현재 로그인 계정 정보 가저오기
	const [myAccount, setMyAccount] = useState([]);
	const getMyAccount = async () => {
		const dbMyAccount = await authService.currentUser;
		if (dbMyAccount !== null) {
			setMyAccount({
				displayName: dbMyAccount.displayName,
				email: dbMyAccount.email,
				photoURL: dbMyAccount.photoURL,
				emailVerified: dbMyAccount.emailVerified,
				uid: dbMyAccount.uid,
			});
		}
	};
	console.log(myAccount);

	// 친구 목록 가져오기
	const [user, setUser] = useState('');
	const [users, setUsers] = useState([]);

	const getUsers = async () => {
		const dbUsers = await dbService.collection('users').get();
		dbUsers.forEach((document) => {
			console.log(document.id);
			const userObject = {
				...document.data(),
				id: document.id,
			};
			setUsers((prev) => [userObject, ...prev]);
		});
	};
	console.log(users);

	useEffect(() => {
		getMyAccount();
		getUsers();
	}, []);

	return (
		<React.Fragment>
			<NavTop />
			<Grid container className={classes.profile}>
				<Grid item xs>
					<Avatar className={classes.profileAvatar}></Avatar>
				</Grid>
				<Grid item xs>
					<Typography component='h1' variant='h5'>
						{/* {myAccount.displayName} */}
					</Typography>
				</Grid>
			</Grid>
			<Grid>
				{users.map((user) => (
					<Grid container key={user.id} xs className={classes.friends}>
						<Grid item xs>
							<Avatar className={classes.friendsAvatar} />
						</Grid>
						<Grid item xs>
							<Typography component='h1' variant='h5'>
								{user.userName}
							</Typography>
						</Grid>
					</Grid>
				))}
			</Grid>
			<NavBottom />
		</React.Fragment>
	);
}
