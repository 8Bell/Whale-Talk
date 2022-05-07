import React, { useState, useEffect, useMemo } from 'react';

import { makeStyles, Theme } from '@material-ui/core/styles';

import NavBottom from './navBottom';
import NavTop from './navTop';
import { authService, dbService } from './fbase';
import router from 'next/router';
import { Avatar, Checkbox, Grid, Radio, Typography, Zoom } from '@material-ui/core';
import { deepOrange, green } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/styles';
import FormDialog from './addfriends';
import AvatarGroup from '@material-ui/lab/AvatarGroup';

const useStyles = makeStyles((theme: Theme) => ({
	paper: {
		minWidth: 330,
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

export default function SignIn() {
	const classes = useStyles();

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

	// 친구 목록 가져오기

	const [user, setUser] = useState('');
	const [users, setUsers] = useState([]);

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

	const getUsers = async () => {
		const dbUsers = await dbService.collection('users').get();
		console.log(2, dbUsers.docs);
		dbUsers.forEach((document) => {
			const userObject = {
				...document.data(),
				id: document.id,
				checked: false,
			};
			if (users.length < dbUsers.docs.length) {
				setUsers((prev) => [...prev, userObject]);
			}
		});
	};

	console.log(myAccount);
	console.log(users);

	useMemo(() => {
		getUsers();
		getMyAccount();
	}, []);

	//체크 박스

	const [checkedState, setCheckedState] = useState(new Array(users.length).fill(false));

	const handleChecked = (position) => {
		const updateCheckedState = checkedState.map((item, index) =>
			index === position ? !item : item
		);
		setCheckedState(updateCheckedState);
	};

	// 채팅 추가하기 - 체크박스 숨김 여부
	const [chatMakingState, setChatMakingState] = useState(false);

	// 친구 추가하기 - 모달창 열기
	const [addFriendState, setAddFriendState] = useState(false);

	//채팅 시작 시 체크박스 초기화
	// useEffect(() => {
	// 	setCheckedState(new Array(users.length).fill(false));
	// }, [addFriendState]);

	return (
		<React.Fragment>
			<NavTop
				chatMakingState={chatMakingState}
				setChatMakingState={setChatMakingState}
				setAddFriendState={setAddFriendState}
				setCheckedState={setCheckedState}
				checkedState={checkedState}
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
					<Grid>
						<AvatarGroup></AvatarGroup>
					</Grid>
				</Grid>
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
										<Zoom in={chatMakingState}>
											<Checkbox
												color='primary'
												checked={
													checkedState[index]
												}
												onClick={handleChecked}
												value={checkedState[index]}
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
			<FormDialog
				addFriendState={addFriendState}
				setAddFriendState={setAddFriendState}
			/>
			<NavBottom />
		</React.Fragment>
	);
}
