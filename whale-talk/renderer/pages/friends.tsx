/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';

import { makeStyles, Theme } from '@material-ui/core/styles';

import { authService, dbService } from '../fbase';
import router from 'next/router';
import { Avatar, Checkbox, Grid, Typography, Zoom } from '@material-ui/core';
import FormDialog from '../components/addfriends';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import FriendsNavTop from '../components/friendsNavTop';
import FriendsNavBottom from '../components/friendsNavBottom';

const useStyles = makeStyles((theme: Theme) => ({
	paper: {
		minWidth: 500,
		marginLeft: 10,
		marginRight: 10,
	},
	profile: {
		height: 100,
		backgroundColor: '#fbfbfb',
		marginTop: 75,
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
		marginBottom: 100,
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

export default function Friends() {
	const classes = useStyles();

	// ??? ????????? ????????????
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [init, setInit] = useState(false);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [myAccount, setMyAccount] = useState({
		displayName: null,
		email: null,
		photoURL: null,
		emailVerified: false,
		uid: null,
		user: null,
	});

	useEffect(() => {
		getMyAccount();
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

	const getMyAccount = async () => {
		authService.onAuthStateChanged((user) => {
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

	// ?????? ?????? ????????????
	const [users, setUsers] = useState([]);
	const [members, setMembers] = useState([]);

	useEffect(() => {
		dbService
			.collection('users')
			.orderBy('userName')
			.onSnapshot((snapshot) => {
				const dbUsers = snapshot.docs.map((doc) => ({
					...doc.data(),
					id: doc.id,
					checked: false,
				}));
				setUsers(dbUsers);
			});
	}, []);

	//?????? ????????? ?????? ?????? ?????????
	useEffect(() => {
		setMembers(users.filter((user) => user.id !== myAccount.uid));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [users]);

	// ?????? ???????????? - ????????? ??????
	const [addFriendState, setAddFriendState] = useState(false);

	// ?????? ???????????? ????????? ???????????? ????????????
	const [chatMakingState, setChatMakingState] = useState(false);

	//?????? ?????? ??????
	const [checkedState, setCheckedState] = useState(
		new Array(users.length).fill(false).slice(0, -1)
	);
	useEffect(() => {
		setCheckedState(new Array(users.length).fill(false).slice(0, -1));
	}, [users]);

	const handleChecked = (position) => {
		console.log(position);
		const updateCheckedState = checkedState.map((item, index) =>
			index === position ? !item : item
		);
		setCheckedState(updateCheckedState);
	};
	console.log('checkedState', checkedState);

	return (
		<React.Fragment>
			<FriendsNavTop
				chatMakingState={chatMakingState}
				setChatMakingState={setChatMakingState}
				setAddFriendState={setAddFriendState}
				checkedState={checkedState}
				setCheckedState={setCheckedState}
				myAccount={myAccount}
				users={users}
			/>
			<Grid className={classes.paper}>
				<Grid container className={classes.profile}>
					<Grid item>
						<Avatar
							src={myAccount.photoURL}
							className={classes.profileAvatar}>
							{/* {myAccount.photoURL == null &&
								myAccount.displayName.charAt(0)} */}
						</Avatar>
					</Grid>
					<Grid item xs>
						<Typography variant='h5' className={classes.profileName}>
							{myAccount.displayName}
						</Typography>
						<Typography className={classes.profileEmail}>
							{myAccount.email}
						</Typography>
					</Grid>
					<Grid item className={classes.groupAvatars}>
						<AvatarGroup max={4}>
							{members.map((member, index) => {
								if (checkedState[index] === true) {
									return (
										<Zoom
											in={checkedState[index]}
											key={index}>
											<Avatar
												style={{
													backgroundColor:
														member.personalColor,
													filter: 'saturate(40%) grayscale(20%) brightness(130%)',
												}}
												src={member.profileImg}
												className={
													classes.groupAvatar
												}>
												{member.profileImg ==
													null &&
													member.userName.charAt(
														0
													)}
											</Avatar>
										</Zoom>
									);
								}
							})}
						</AvatarGroup>
					</Grid>
				</Grid>
				<Grid className={classes.friends}>
					<Grid className={classes.friendsTitleBox}>
						<Typography className={classes.friendsTitle}>
							{' '}
							?????? ?????? {members.length}
						</Typography>
					</Grid>
					{members.map((member, index) => {
						return (
							<Grid container key={index} className={classes.friend}>
								<Grid item>
									<Avatar
										style={{
											backgroundColor:
												member.personalColor,
											filter: 'saturate(40%) grayscale(20%) brightness(130%) ',
										}}
										src={member.profileImg}
										className={classes.friendAvatar}>
										{member.profileImg == null &&
											member.userName.charAt(0)}
									</Avatar>
								</Grid>
								<Grid item xs color='secondery'>
									<Typography
										variant='h6'
										className={classes.friendName}>
										{member.userName}
									</Typography>
									<Typography className={classes.friendEmail}>
										{member.email}
									</Typography>
								</Grid>
								<Grid>
									<Zoom in={chatMakingState}>
										<Checkbox
											color='primary'
											checked={checkedState[index]}
											onClick={() =>
												handleChecked(index)
											}
											value={checkedState[index]}
											className={classes.friendCheckbox}
										/>
									</Zoom>
								</Grid>
							</Grid>
						);
					})}
				</Grid>
			</Grid>
			<FormDialog
				addFriendState={addFriendState}
				setAddFriendState={setAddFriendState}
			/>
			<FriendsNavBottom />
		</React.Fragment>
	);
}
