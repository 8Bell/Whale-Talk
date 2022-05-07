import React, { useState, useEffect } from 'react';

import { makeStyles, Theme } from '@material-ui/core/styles';

import { authService, dbService } from './fbase';
import router from 'next/router';
import { Avatar, Checkbox, Grid, Typography, Zoom } from '@material-ui/core';
import ChatsNavTop from './chatsNavTop copy';
import ChatsNavBottom from './chatsNavBottom';

const useStyles = makeStyles((theme: Theme) => ({
	paper: {
		minWidth: 500,
		marginLeft: 10,
		marginRight: 10,
	},
	profile: {
		height: 100,
		backgroundColor: '#fbfbfb',
		marginTop: 60,
		borderBottom: 'solid 2px #ddd',
	},
	profileAvatar: {
		top: '20%',
		left: 10,
		width: 60,
		height: 60,
		color: theme.palette.getContrastText(theme.palette.primary.main),
		backgroundColor: theme.palette.primary.main,
		fontWeight: 400,
		fontSize: 30,
	},
	profileName: {
		marginTop: 23,
		marginLeft: 26,
	},
	profileEmail: {
		marginTop: -5,
		marginLeft: 27,
		fontSize: 17,
		fontWeight: 400,
		color: 'gray',
	},
	groupAvatars: {
		marginTop: 30,
		marginRight: 10,
		zIndex: 0,
	},
	groupAvatar: {
		width: theme.spacing(7),
		height: theme.spacing(7),

		fontWeight: 500,
	},
	friends: {
		marginBottom: 60,
	},
	friendsTitleBox: {
		borderBottom: 'solid 1px #f0f0f0',
	},
	friendsTitle: {
		marginTop: 7,
		marginLeft: 14,
		marginBottom: 6,
		color: 'gray',
	},
	friend: {
		height: 80,
		backgroundColor: '#fbfbfb',
		borderBottom: 'solid 1px #f0f0f0',
	},
	friendAvatar: {
		top: '20%',
		left: 10,
		width: 50,
		height: 50,
		color: theme.palette.getContrastText(theme.palette.primary.main),
		backgroundColor: theme.palette.primary.main,
		fontWeight: 500,
		zIndex: 0,
	},

	friendName: {
		marginTop: 15,
		marginLeft: 26,
	},
	friendEmail: {
		marginTop: -7,
		marginLeft: 27,
		color: 'gray',
	},
	friendCheckbox: {
		marginTop: 20,
		marginRight: 0,
	},
}));

export default function SignIn({ memberArr }) {
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
			<ChatsNavTop />
			<Grid className={classes.paper}>
				<Grid className={classes.friends}>
					<Grid className={classes.friendsTitleBox}>
						<Typography className={classes.friendsTitle}>
							{' '}
							모든 유저 {users.length - 1}
						</Typography>
					</Grid>
					{users.map((user, index) => {
						if (user.id !== myAccount.uid) {
							return (
								<Grid
									container
									key={index}
									className={classes.friend}>
									<Grid item>
										<Avatar
											style={{
												backgroundColor:
													user.personalColor,
												filter: 'saturate(40%) grayscale(20%) brightness(130%) ',
											}}
											src={user.profileImg}
											className={classes.friendAvatar}>
											{user.profileImg == null &&
												user.userName.charAt(0)}
										</Avatar>
									</Grid>
									<Grid item xs color='secondery'>
										<Typography
											variant='h6'
											className={classes.friendName}>
											{user.userName}
										</Typography>
										<Typography
											className={classes.friendEmail}>
											{user.email}
										</Typography>
									</Grid>
									<Grid>
										<Zoom in={true}>
											<Checkbox
												color='primary'
												checked={false}
												value={false}
												className={
													classes.friendCheckbox
												}
											/>
										</Zoom>
									</Grid>
								</Grid>
							);
						}
					})}
				</Grid>
			</Grid>
			<ChatsNavBottom />
		</React.Fragment>
	);
}
