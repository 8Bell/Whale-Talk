import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

import { makeStyles, Theme } from '@material-ui/core/styles';

import { authService, dbService } from '../fbase';
import router, { useRouter, withRouter } from 'next/router';
import { Avatar, Checkbox, Grid, Typography, Zoom } from '@material-ui/core';
import ChatNavTop from '../components/chatRoomNavTop';
import ChatNavBottom from '../components/chatRoomInputBar';
import ChatRoomInputBar from '../components/chatRoomInputBar';
import ChatRoomNavTop from '../components/chatRoomNavTop';
import { relative } from 'path';
import { yellow } from '@material-ui/core/colors';

const useStyles = makeStyles((theme: Theme) => ({
	paper: {
		minWidth: 500,
		marginLeft: 10,
		marginRight: 10,
		'&::-webkit-scrollbar': {
			display: 'none',
		},
	},

	dialogues: {
		marginTop: 90,
		marginBottom: 95,
	},

	dialogue: {
		backgroundColor: '#fbfbfb',
		//backgroundColor: 'green',
		paddingBottom: 0,
		paddingTop: 0,
		display: 'flex',
	},
	dialogueAvatarGrid: { width: 85 },
	dialogueAvatar: {
		//top: '20%',
		left: 10,
		width: 50,
		height: 50,
		color: theme.palette.getContrastText(theme.palette.primary.main),
		backgroundColor: theme.palette.primary.main,
		fontWeight: 500,
		zIndex: 0,
		marginTop: 20,
		boxShadow: '0 0 10px 5px rgba(0,0,0,0.1)',
	},
	dialogueWriter: {
		position: 'relative',
		height: 30,
		marginLeft: 10,
		marginTop: 20,
		//backgroundColor: 'yellow',
	},
	dialogueWriterD: {
		display: 'none',
	},

	dialogueBox: {
		position: 'relative',
		maxWidth: '60%',
		marginLeft: '-10px',
		//marginTop: 10,
		paddingBottom: 10,
		//paddingTop: 10,
		//backgroundColor: 'green',
		//height: 50,
	},

	dialogueText: {
		maxWidth: '84%',
		marginLeft: 5,
		marginRight: 10,
		paddingTop: 5,
		paddingBottom: 4,
		paddingLeft: 21,
		paddingRight: 21,
		position: 'relative',
		display: 'inline-block',
		border: 'solid 2px #dddddd',
		backgroundColor: '#fbfbfb',
		color: '#333333',
		fontWeight: 400,
		borderRadius: 30,
		marginBottom: 0,
		marginTop: 0,
		boxShadow: '0 0 16px 8px rgba(0,0,0,0.05)',
	},
	createdTime: {
		marginTop: 0,
		marginLeft: 0,
		color: 'gray',
		display: 'inline-block',
		transform: 'translateY(35%)',
	},
	dialogueAvatarR: { display: 'none' },

	dialogueBoxR: {
		position: 'relative',
		maxWidth: '60%',
		right: 10,
		// marginTop: 10,
		paddingBottom: 10,
		// paddingTop: 10,
		overflow: 'hidden',
		//	backgroundColor: 'yellow',
		marginLeft: 'auto',
	},

	dialogueTextR: {
		maxWidth: '100%',
		marginLeft: 50,
		paddingTop: 5,
		paddingBottom: 4,
		paddingLeft: 20,
		paddingRight: 20,
		position: 'relative',
		display: 'inline-block',
		border: 'solid 1px #44546A',
		borderRadius: 30,
		backgroundColor: '#44546A',
		color: '#fbfbfb',
		float: 'right',
		fontWeight: 400,
		boxShadow: '0 0 20px 8px rgba(0,0,0,0.05)',
	},

	createdTimeR: {
		display: 'none',
	},
	createdTimeD: {
		marginTop: 0,
		marginLeft: 0,
		color: 'gray',
		display: 'inline-block',
		transform: 'translateY(35%)',
		opacity: '0%',
	},

	createdTimeL: {
		marginTop: 0,
		left: 0,
		bottom: 10,
		color: 'gray',
		position: 'absolute',
		display: 'inline-block',
	},
	dialogueCheckbox: {
		marginTop: 20,
		marginRight: 0,
	},
}));

export default function ChatRoom({}) {
	const classes = useStyles();
	const router = useRouter();

	const chatIndex = Number(router.query.chatIndex);
	const roomId: string = router.query.roomId;

	const [chats, setChats] = useState([]);
	const [myChatsUid, setMyChatsUid] = useState([]);

	// 내 아이디 가져오기
	const [init, setInit] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [myAccount, setMyAccount] = useState({
		displayName: null,
		email: null,
		photoURL: null,
		emailVerified: false,
		uid: null,
		user: null,
	});

	const getMyAccount = async () => {
		const dbMyAccount = authService.onAuthStateChanged((user) => {
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

	const thisRoom = myChatsUid[chatIndex];

	// 분류된 대화 가져오기
	const [sortedDialogues, setSortedDialogues] = useState([]);
	useEffect(
		() =>
			dbService
				.collection('chats')
				.doc(roomId)
				.collection('dialogues')
				.orderBy('createdAt')
				.onSnapshot((snapshot) => {
					const dbSortedDialogues = snapshot.docs.map((doc) => ({
						...doc.data(),
					}));
					setSortedDialogues(dbSortedDialogues);
				}),
		[]
	);

	//console.log('myAccount', myAccount.uid);

	// 선택된 대화방의 유저 목록 가져오기
	const [chatMembers, setChatMembers] = useState([]);
	useEffect(() => {
		dbService
			.collection('chats')
			.doc(roomId)
			.get()
			.then((doc) => {
				if (chatMembers.length < doc.data().memberUid.length) {
					doc.data().memberUid.map((uid) => {
						dbService
							.collection('users')
							.doc(uid)
							.get()
							.then((doc) =>
								setChatMembers((prev) => [...prev, doc.data()])
							);
					});
				}
			});
		//setChatMembers(chatMembers.filter((member) => member.uid !== myAccount.uid));
	}, []);

	//console.log('chatMembers', chatMembers);

	// uid to color
	const uidToColor = (inputUid: string) => {
		const thisMember = chatMembers.filter((member) => member.uid === inputUid);
		try {
			return thisMember[0].personalColor;
		} catch (err) {
			//console.log(err);
		}
	};
	// uid to first letter
	const uidToFL = (inputUid: string) => {
		const thisMember = chatMembers.filter((member) => member.uid === inputUid);
		try {
			return thisMember[0].userName.charAt(0);
		} catch (err) {
			//console.log(err);
		}
	};

	// uid to Fullname
	const uidToFN = (inputUid: string) => {
		const thisMember = chatMembers.filter((member) => member.uid === inputUid);
		try {
			return thisMember[0].userName;
		} catch (err) {
			//console.log(err);
		}
	};

	// uid to profileImage
	const uidToPI = (inputUid: string) => {
		const thisMember = chatMembers.filter((member) => member.uid === inputUid);
		try {
			return thisMember[0].profileImg;
		} catch (err) {
			//console.log(err);
		}
	};

	//createdAt To createdTime
	const cToT = (inputTime) => {
		try {
			const time =
				('0' + new Date(inputTime).getHours()).slice(-2) +
				':' +
				('0' + new Date(inputTime).getMinutes()).slice(-2);

			return time.toString();
		} catch (err) {
			//console.log(err);
		}
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

	const chatMemberNamesArr = []; // 모든 채팅들의 멤버 배열을 담은 배열

	const [chatTitles, setChatTitles] = useState([]);
	const chatTitleArr = [];

	const userUidArr = users.map((user) => user.uid); //전체 유저의 uid 배열
	const userNameArr = users.map((user) => user.userName); //전체 유저의 이름 배열
	const chatUidsArr = chats.map((chat) => chat.memberUid); // 모든 채팅의 멤버 uid 배열을 담은 배열

	// uid를 넣으면 이름을 반환하는 함수
	const uidToName = (inputUid: string) => {
		return userNameArr[userUidArr.indexOf(inputUid)];
	};
	//uid를 넣으면 유저 객체를 반환하는 함수
	const uidToUser = (inputUid: string) => {
		return users[userUidArr.indexOf(inputUid)];
	};

	useEffect(() => {
		dbService
			.collection('chats')
			.orderBy('lastDialogueAt', 'desc')
			.onSnapshot((snapshot) => {
				const dbChats = snapshot.docs.map((doc) => ({
					...doc.data(),
					id: doc.id,
				}));
				setChats(dbChats);
			});
	}, []);

	useEffect(() => {
		getChatMemberNamesArr();
		setMyChats(chats.filter((chat) => chat.memberUid.includes(myAccount.uid))); //내가 속한 채팅만 반환
		setMyChatsUid(
			chats
				.filter((chat) => chat.memberUid.includes(myAccount.uid))
				.map((myChat) => myChat.chatId)
		);
	}, [chats]);

	const [myChats, setMyChats] = useState(chats);

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

	useEffect(() => {
		scrollToBottom();
		//	window.scrollTo(0, document.body.scrollHeight);
	}, []);

	//스크롤 하단으로
	const scrollRef = useRef(null);
	const scrollToBottom = () => {
		scrollRef.current.scrollIntoView({
			behavior: 'smooth',
			block: 'end',
			inline: 'nearest',
		});
	};

	return (
		<React.Fragment>
			<div>
				<ChatRoomNavTop
					chatIndex={chatIndex}
					myChats={myChats}
					uidToName={uidToName}
					myAccount={myAccount}
				/>
				<Grid className={classes.paper}>
					<Grid className={classes.dialogues}>
						<Grid>
							{sortedDialogues.map((dialogue, index, arr) => {
								return (
									<Grid
										container
										key={index}
										className={classes.dialogue}>
										<Grid
											item
											className={
												classes.dialogueAvatarGrid
											}>
											<Avatar
												style={{
													backgroundColor:
														uidToColor(
															dialogue.writer
														),
													filter: 'saturate(40%) grayscale(20%) brightness(130%) ',
												}}
												src={uidToPI(
													dialogue.writer
												)}
												className={
													dialogue.writer ==
													myAccount.uid
														? classes.dialogueAvatarR
														: index > 0
														? dialogue.writer !==
														  arr[
																Number(
																	index -
																		1
																)
														  ].writer
															? classes.dialogueAvatar
															: cToT(
																	dialogue.createdAt
															  ) !=
															  cToT(
																	arr[
																		Number(
																			index -
																				1
																		)
																	]
																		.createdAt
															  )
															? classes.dialogueAvatar
															: classes.dialogueAvatarR
														: classes.dialogueAvatar
												}>
												{uidToFL(dialogue.writer)}
											</Avatar>
										</Grid>

										<Grid
											item
											color='secondery'
											className={
												dialogue.writer ==
												myAccount.uid
													? classes.dialogueBoxR
													: classes.dialogueBox
											}>
											<Grid
												item
												xs
												className={
													dialogue.writer ==
													myAccount.uid
														? classes.dialogueWriterD
														: index > 0
														? dialogue.writer !==
														  arr[
																Number(
																	index -
																		1
																)
														  ].writer
															? classes.dialogueWriter
															: cToT(
																	dialogue.createdAt
															  ) !==
															  cToT(
																	arr[
																		Number(
																			index -
																				1
																		)
																	]
																		.createdAt
															  )
															? classes.dialogueWriter
															: classes.dialogueWriterD
														: classes.dialogueWriter
												}>
												<Typography>
													{uidToFN(
														dialogue.writer
													)}
												</Typography>
											</Grid>

											{index < arr.length - 1 ? (
												cToT(dialogue.createdAt) !=
													cToT(
														arr[
															Number(
																index +
																	1
															)
														].createdAt
													) && (
													<Typography
														className={
															dialogue.writer ==
															myAccount.uid
																? classes.createdTimeL
																: classes.createdTimeR
														}>
														{cToT(
															dialogue.createdAt
														)}
													</Typography>
												)
											) : (
												<Typography
													className={
														dialogue.writer ==
														myAccount.uid
															? classes.createdTimeL
															: classes.createdTimeR
													}>
													{cToT(
														dialogue.createdAt
													)}
												</Typography>
											)}

											<Typography
												variant='h6'
												className={
													dialogue.writer ==
													myAccount.uid
														? classes.dialogueTextR
														: classes.dialogueText
												}>
												{dialogue.text}
											</Typography>

											<Typography
												className={
													dialogue.writer ==
													myAccount.uid
														? classes.createdTimeR
														: index <
														  arr.length - 1
														? cToT(
																dialogue.createdAt
														  ) !==
														  cToT(
																arr[
																	Number(
																		index +
																			1
																	)
																]
																	.createdAt
														  )
															? classes.createdTime
															: classes.createdTimeD
														: classes.createdTime
												}>
												{cToT(dialogue.createdAt)}
											</Typography>
										</Grid>
									</Grid>
								);
							})}
						</Grid>
					</Grid>
				</Grid>
				<ChatRoomInputBar
					thisRoom={thisRoom}
					myAccount={myAccount}
					scrollToBottom={scrollToBottom}
				/>
			</div>
			<div ref={scrollRef} />
		</React.Fragment>
	);
}
