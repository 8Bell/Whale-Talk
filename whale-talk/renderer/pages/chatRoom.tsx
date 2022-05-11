import React, { useState, useEffect } from 'react';

import { makeStyles, Theme } from '@material-ui/core/styles';

import { authService, dbService } from './fbase';
import router, { useRouter, withRouter } from 'next/router';
import { Avatar, Checkbox, Grid, Typography, Zoom } from '@material-ui/core';
import ChatNavTop from './chatRoomNavTop';
import ChatNavBottom from './ChatRoomInputBar';
import ChatRoomInputBar from './ChatRoomInputBar';
import ChatRoomNavTop from './chatRoomNavTop';

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

export default function ChatRoom({
	thisRoom,
	setIsInChatRoom,
	isInChatRoom,
	chatIndex,
	dialogues,
	sortedDialogues,
	uidToName,
	uidToUser,
	myChats,
}) {
	console.log(dialogues);

	console.log(chatIndex);

	const classes = useStyles();
	const router = useRouter();

	// 내 아이디 가져오기
	const [init, setInit] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [myAccount, setMyAccount] = useState({});

	useEffect(() => {
		const dbMyAccount = authService.onAuthStateChanged((user) => {
			if (user) {
				setIsLoggedIn(true);
			} else {
				setIsLoggedIn(false);
				router.push('/home');
			}
			setInit(true);
		});
	}, []);

	useEffect(() => {
		getMyAccount();
	}, []);

	const getMyAccount = async () => {
		const dbMyAccount = await authService.onAuthStateChanged((user) => {
			if (user) {
				setMyAccount({
					displayName: user.displayName,
					email: user.email,
					photoURL: user.photoURL,
					emailVerified: user.emailVerified,
					uid: user.uid,
					user: user,
				});
			}
		});
	};

	console.log('thisRoom2', thisRoom);
	console.log(sortedDialogues);

	return (
		<React.Fragment>
			<ChatRoomNavTop
				setIsInChatRoom={setIsInChatRoom}
				isInChatRoom={isInChatRoom}
				chatIndex={chatIndex}
				myChats={myChats}
				uidToName={uidToName}
				myAccount={myAccount}
			/>
			<Grid className={classes.paper}>
				<Grid className={classes.friends}>
					<Grid>
						{sortedDialogues.map((dialogue, index) => {
							return (
								<Grid
									container
									key={index}
									className={classes.friend}>
									<Grid item>
										<Avatar
											style={{
												backgroundColor: uidToUser(
													dialogue.writer
												).personalColor,
												filter: 'saturate(40%) grayscale(20%) brightness(130%) ',
											}}
											src={
												uidToUser(dialogue.writer)
													.profileImg
											}
											className={classes.friendAvatar}>
											{uidToUser(dialogue.writer)
												.profileImg == null &&
												uidToUser(
													dialogue.writer
												).userName.charAt(0)}
										</Avatar>
									</Grid>
									<Grid item></Grid>
									<Grid item xs color='secondery'>
										<Typography
											variant='h6'
											className={classes.friendName}>
											{dialogue.text}
										</Typography>
										<Typography
											className={classes.friendEmail}>
											{(
												'0' +
												new Date(
													dialogue.createdAt
												).getHours()
											).slice(-2) +
												':' +
												(
													'0' +
													new Date(
														dialogue.createdAt
													).getMinutes()
												).slice(-2)}
										</Typography>
									</Grid>
									<Grid>
										<Zoom in={false}>
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
						})}
					</Grid>
				</Grid>
			</Grid>
			<ChatRoomInputBar thisRoom={thisRoom} myAccount={myAccount} />
		</React.Fragment>
	);
}
