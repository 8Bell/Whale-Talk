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
		getUsers();
		getMyAccount();
		getChats();

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

	// 채팅 목록 가져오기

	const [chats, setChats] = useState([]);
	const [myChats, setMyChats] = useState(chats);
	const [myChatsUid, setMyChatsUid] = useState([]);

	const [chatsLength, setChatsLength] = useState(0);

	const getChats = async () => {
		const dbChats = await dbService.collection('chats').get();
		dbChats.forEach((document) => {
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

	// 친구 목록 가져오기

	const [users, setUsers] = useState([]);
	const [usersLength, setUsersLength] = useState(1);

	const getUsers = async () => {
		const dbUsers = await dbService.collection('users').get();
		await dbUsers.forEach((document) => {
			const userObject = {
				...document.data(),
				id: document.id,
				checked: false,
			};
			setUsersLength(dbUsers.docs.length);
			// console.log(usersLength);
			if (users.length < dbUsers.docs.length) {
				setUsers((prev) => [...prev, userObject]);
			}
		});
	};

	// 채팅방 참가인원의 이름 가져오기
	// 이름 변경의 경우를 고려해 고유값인 계정 uid로 작업
	const chatMemberNamesArr = []; // 모든 채팅들의 멤버 배열을 담은 배열

	const [chatTitles, setChatTitles] = useState([]);
	const chatTitleArr = [];

	const userUidArr = []; //전체 유저의 uid 배열
	const userNameArr = []; //전체 유저의 이름 배열
	const chatUidsArr = []; // 모든 채팅의 멤버 uid 배열을 담은 배열

	useEffect(() => {
		getChatMemberNamesArr();
		setMyChats(chats.filter((chat) => chat.memberUid.includes(myAccount.uid)));
		setMyChatsUid(
			chats
				.filter((chat) => chat.memberUid.includes(myAccount.uid))
				.map((myChat) => myChat.chatId)
		);
	}, [chats]);

	const getChatMemberNamesArr = () => {
		users.map((user) => userUidArr.push(user.uid));
		users.map((user) => userNameArr.push(user.userName));
		chats.map((chat) => chatUidsArr.push(chat.memberUid));
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
	const dialogueArr = [];

	// useEffect(() => {
	// 	getDialogues();
	// }, [handleInRoom]);

	const getDialogues = async () => {
		myChatsUid.map(async (uid) => {
			const dialogue = [];
			const dbDialogues = dbService
				.collection('chats')
				.doc(uid)
				.collection('dialogues')
				.get();
			(await dbDialogues).forEach(async (document) => {
				const dialogueObject = {
					...document.data(),
					id: document.id,
				};
				if (dialogues.length < (await dbDialogues).docs.length) {
					// setDialogues((prev) => [...prev, dialogueObject]);
					dialogue.push(dialogueObject);
				}
			});
			dialogueArr.push(dialogue);
		});
		setDialogues(dialogueArr);
	};

	console.log(dialogues);

	const [indexx, setIndexx] = useState(0);

	const handleInRoom = async (index) => {
		console.log(index);
		setIndexx(index);
		const roomId = await myChatsUid[index];
		setThisRoom(roomId);
		console.log(roomId);
		setIsInChatRoom(!isInChatRoom);
		setThisRoomName(chatTitles[index]);
		getDialogues();
	};
	console.log(myChatsUid);
	console.log('thisRoom', thisRoom);

	return (
		<React.Fragment>
			<Collapse in={!isInChatRoom}>
				<Grid>
					<ChatsNavTop handleInRoom={undefined} />
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
										// <Link href={'/chatRoom'}>
										<Grid
											container
											key={myChat.chatId}
											className={classes.friend}
											onClick={() =>
												handleInRoom(index)
											}>
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
													최근 대화
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
										// </Link>
									);
								})}
							</Grid>
						</Grid>
					</Grid>
					<ChatsNavBottom />
				</Grid>
			</Collapse>

			<Collapse in={isInChatRoom}>
				<ChatRoom
					thisRoom={thisRoom}
					setIsInChatRoom={setIsInChatRoom}
					isInChatRoom={isInChatRoom}
					thisRoomName={thisRoomName}
					dialogues={dialogues}
					getDialogues={getDialogues}
					indexx={indexx}
				/>
			</Collapse>
		</React.Fragment>
	);
}
