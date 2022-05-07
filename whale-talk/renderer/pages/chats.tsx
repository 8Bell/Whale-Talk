import React, { useState, useEffect } from 'react';

import { makeStyles, Theme } from '@material-ui/core/styles';

import { authService, dbService } from './fbase';
import router, { useRouter, withRouter } from 'next/router';
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
		marginTop: 75,
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

export default function Chats() {
	const classes = useStyles();
	const router = useRouter();

	withRouter;

	//로그아웃

	const [init, setInit] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
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

	// 채팅 목록 가져오기

	const [chats, setChats] = useState([]);
	const [chatsLength, setChatsLength] = useState(0);

	const getChats = async () => {
		const dbChats = await dbService.collection('chats').get();
		dbChats.forEach((document) => {
			// console.log(document.id);
			const chatsObject = {
				...document.data(),
				id: document.id,
			};
			setChatsLength(dbChats.docs.length);
			if (chats.length < dbChats.docs.length) {
				setChats((prev) => [chatsObject, ...prev]);
			}
		});
	};
	// console.log(chats);

	useEffect(() => {
		getChats();
	}, []);

	return (
		<React.Fragment>
			<ChatsNavTop />
			<Grid className={classes.paper}>
				<Grid className={classes.friends}>
					<Grid className={classes.friendsTitleBox}>
						<Typography className={classes.friendsTitle}>
							{' '}
							모든 채팅 {chats.length}
						</Typography>
					</Grid>
					<Grid>
						{/* {chats.map((chat, index) => {
							if (chat.memberUidArr.includes(myAccountUid)) {
								return (
									<Grid
										container
										key={index}
										className={classes.friend}>
										<Grid item></Grid>
										<Grid item xs color='secondery'>
											<Typography
												variant='h6'
												className={
													classes.friendName
												}>
												{chat.host + '님의 채팅방'}
											</Typography>
											<Typography
												className={
													classes.friendEmail
												}>
												{chat.memberNameArr.join()}
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
						})} */}
					</Grid>
				</Grid>
			</Grid>
			<ChatsNavBottom />
		</React.Fragment>
	);
}
