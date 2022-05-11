import React, { useState, useEffect } from 'react';

import { makeStyles, Theme } from '@material-ui/core/styles';

import { authService, dbService } from './fbase';
import { useRouter } from 'next/router';
import {
	Avatar,
	Box,
	Checkbox,
	Collapse,
	Fade,
	Grid,
	Grow,
	NoSsr,
	Slide,
	Typography,
	Zoom,
} from '@material-ui/core';
import ChatsNavTop from './chatsNavTop';
import ChatsNavBottom from './chatsNavBottom';
import ChatRoom from './chatRoom';
import Link from '../components/Link';
import console from 'console';
import { AvatarGroup } from '@material-ui/lab';

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

	// 내 아이디 가져오기
	const [init, setInit] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [myAccount, setMyAccount] = useState({});

	useEffect(() => {
		getMyAccount();

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

	// 친구 목록 가져오기
	const [users, setUsers] = useState([]);

	useEffect(() => {
		dbService.collection('users').onSnapshot((snapshot) => {
			const dbUsers = snapshot.docs.map((doc) => ({
				...doc.data(),
				id: doc.id,
				checked: false,
			}));
			setUsers(dbUsers);
		});
	}, []);

	// 채팅 목록 가져오기

	const [chats, setChats] = useState([]);
	const [myChats, setMyChats] = useState(chats);
	const [myChatsUid, setMyChatsUid] = useState([]);

	useEffect(() => {
		dbService.collection('chats').onSnapshot((snapshot) => {
			const dbChats = snapshot.docs.map((doc) => ({
				...doc.data(),
				id: doc.id,
			}));
			setChats(dbChats);
		});
	}, []);

	// 채팅방 참가인원의 이름 가져오기
	// 이름 변경의 경우를 고려해 고유값인 계정 uid로 작업
	const chatMemberNamesArr = []; // 모든 채팅들의 멤버 배열을 담은 배열

	const [chatTitles, setChatTitles] = useState([]);
	const chatTitleArr = [];

	const userUidArr = users.map((user) => user.uid); //전체 유저의 uid 배열
	const userNameArr = users.map((user) => user.userName); //전체 유저의 이름 배열
	const chatUidsArr = chats.map((chat) => chat.memberUid); // 모든 채팅의 멤버 uid 배열을 담은 배열

	useEffect(() => {
		getChatMemberNamesArr();

		setMyChats(chats.filter((chat) => chat.memberUid.includes(myAccount.uid))); //내가 속한 채팅만 반환
		setMyChatsUid(
			chats
				.filter((chat) => chat.memberUid.includes(myAccount.uid))
				.map((myChat) => myChat.chatId)
		); //내가 속한 채팅의 멤버 uid 배열
	}, [chats]);

	const getChatMemberNamesArr = () => {
		chatUidsArr.map((chatUids) => {
			const chatMemberNames = [];

			chatUids.map((chatUid) => {
				chatMemberNames.push(userNameArr[userUidArr.indexOf(chatUid)]);
			});
			chatMemberNamesArr.push(chatMemberNames);

			let chatTitle = '';

			if (chatUids.length > 3) {
				chatTitle =
					chatMemberNames.slice(0, 3).join(', ') +
					'외' +
					' ' +
					(chatUids.length - 3) +
					'명의 채팅방';
			} else {
				chatTitle = chatMemberNames.join(', ') + '의 채팅방';
			}

			chatTitleArr.push(chatTitle);
		});

		setChatTitles(chatTitleArr);
	};

	const [isInChatRoom, setIsInChatRoom] = useState(false);
	const [thisRoom, setThisRoom] = useState('');
	const [thisRoomName, setThisRoomName] = useState('채팅방');

	//대화 가져오기

	const [dialogues, setDialogues] = useState([]);

	useEffect(() => {
		dbService
			.collectionGroup('dialogues')
			.orderBy('createdAt')
			.onSnapshot((snapshot) => {
				const dbDialogues = snapshot.docs.map((doc) => ({
					...doc.data(),
					id: doc.id,
				}));
				setDialogues(dbDialogues);
			});
	}, []);

	//마지막 대화 가져오기

	const getLastDialogue = (idx) => {
		const arr = dialogues
			.filter((dialogue) => dialogue.chatId === myChatsUid[idx])
			.slice(-1)[0];

		console.log('알', arr);
	};
	console.log(
		'올',
		dialogues.filter((dialogue) => dialogue.chatId === myChatsUid[0]).slice(-1)[0]
	);

	// 분류된 대화 가져오기
	const [sortedDialogues, setSortedDialogues] = useState([]);

	useEffect(() => {
		thisRoom !== '' &&
			dbService
				.collection('chats')
				.doc(thisRoom)
				.collection('dialogues')
				.orderBy('createdAt')
				.onSnapshot((snapshot) => {
					const dbSortedDialogues = snapshot.docs.map((doc) => ({
						...doc.data(),
					}));
					setSortedDialogues(dbSortedDialogues);
				});
	}, [thisRoom]);

	// uid를 넣으면 이름을 반환하는 함수
	const uidToName = (inputUid: string) => {
		return userNameArr[userUidArr.indexOf(inputUid)];
	};
	// uid를 넣으면 유저 객체를 반환하는 함수
	const uidToUser = (inputUid: string) => {
		return users[userUidArr.indexOf(inputUid)];
	};

	// 채팅방 선택하기
	const [indexx, setIndexx] = useState(0);

	const handleInRoom = async (index) => {
		console.log(index);
		setIndexx(index);
		const roomId = await myChatsUid[index];
		setThisRoom(roomId);
		console.log(roomId);
		setIsInChatRoom(!isInChatRoom);
		setThisRoomName(chatTitles[index]);
	};

	return (
		<React.Fragment>
			<Collapse in={!isInChatRoom}>
				<ChatsNavTop />
				<Grid className={classes.paper}>
					<Grid className={classes.friends}>
						<Grid className={classes.friendsTitleBox}>
							<Typography className={classes.friendsTitle}>
								{' '}
								모든 채팅 {myChats.length}
							</Typography>
						</Grid>
						<Grid>
							{myChats.map((myChat, index) => {
								return (
									<Grid
										container
										key={myChat.chatId}
										className={classes.friend}
										onClick={() => handleInRoom(index)}>
										<Grid item></Grid>
										<Grid item xs color='secondery'>
											<Typography
												variant='h6'
												className={
													classes.friendName
												}>
												{chatTitles[index]}
											</Typography>
											<Typography
												className={
													classes.friendEmail
												}>
												{myChat.lastDialogue}
											</Typography>
										</Grid>

										<Grid
											item
											className={classes.groupAvatars}>
											<AvatarGroup max={3}>
												{myChat.memberUid.map(
													(uid, index) => {
														return (
															<Avatar
																key={
																	index
																}
																style={{
																	backgroundColor:
																		uidToUser(
																			uid
																		)
																			.personalColor,
																	filter: 'saturate(40%) grayscale(20%) brightness(130%)',
																}}
																src={
																	uidToUser(
																		uid
																	)
																		.profileImg
																}
																className={
																	classes.groupAvatar
																}>
																{uidToUser(
																	uid
																)
																	.profileImg ==
																	null &&
																	uidToUser(
																		uid
																	).userName.charAt(
																		0
																	)}
															</Avatar>
														);
													}
												)}
											</AvatarGroup>
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
				<ChatsNavBottom />
			</Collapse>

			<Collapse in={isInChatRoom}>
				<ChatRoom
					thisRoom={thisRoom}
					setIsInChatRoom={setIsInChatRoom}
					isInChatRoom={isInChatRoom}
					thisRoomName={thisRoomName}
					dialogues={dialogues}
					indexx={indexx}
					sortedDialogues={sortedDialogues}
					uidToName={uidToName}
					uidToUser={uidToUser}
				/>
			</Collapse>
		</React.Fragment>
	);
}
