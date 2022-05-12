import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';
import ArrowForwardRoundedIcon from '@material-ui/icons/ArrowForwardRounded';
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded';
import OfflinePinRoundedIcon from '@material-ui/icons/OfflinePinRounded';
import AddCommentRoundedIcon from '@material-ui/icons/AddCommentRounded';
import ArrowForwardIosRoundedIcon from '@material-ui/icons/ArrowForwardIosRounded';
import ChevronRightRoundedIcon from '@material-ui/icons/ChevronRightRounded';
import { Zoom } from '@material-ui/core';
import { useRouter } from 'next/router';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			width: '100vw',
			height: 60,
			position: 'fixed',
			top: 0,
			left: '50%',
			transform: 'translate(-50%, 0)',
			backgroundColor: '#eeeeee',
			zIndex: 1,
		},
		menuButton: {
			marginRight: theme.spacing(2),
		},
		title: {
			flexGrow: 1,
			fontSize: 17,
			marginTop: 4,
			color: '#444',
		},
		plusIconBtn: {
			position: 'absolute',
			zIndex: 2,
			top: 3,
			right: 10,
		},
		nextIconBtn: {
			position: 'absolute',
			zIndex: 2,
			top: 2,
			right: 10,
		},
		nextIconText: {
			marginRight: 5,
			fontSize: 22,
			fontWeight: 500,
		},
	})
);

export default function ChatRoomNavTop({
	setIsInChatRoom,
	isInChatRoom,
	myChats,
	chatIndex,
	uidToName,
	myAccount,
}) {
	const classes = useStyles();
	const myChat = myChats[chatIndex];
	const [auth, setAuth] = useState(true);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleAddChat = () => {
		setAnchorEl(null);
	};
	const handleAddFriend = () => {
		setAnchorEl(null);
	};

	return (
		<div className={classes.root}>
			<FormGroup></FormGroup>
			<AppBar position='static' color='secondary'>
				<Toolbar>
					<Typography className={classes.title}>
						{myChat
							? myChat.memberUid.length > 3
								? uidToName(myChat.memberUid[0]) +
								  ', ' +
								  uidToName(myChat.memberUid[1]) +
								  ', ' +
								  uidToName(myChat.memberUid[2]) +
								  '외 ' +
								  (myChat.memberUid.length - 3) +
								  '명의 채팅방'
								: myChat.memberUid.length > 2
								? uidToName(myChat.memberUid[0]) +
								  ', ' +
								  uidToName(myChat.memberUid[1]) +
								  ', ' +
								  uidToName(myChat.memberUid[2]) +
								  '의 채팅방'
								: uidToName(
										myChat.memberUid.filter(
											(uid) => uid !== myAccount.uid
										)[0]
								  )
							: '채팅'}
					</Typography>
					{auth && (
						<div>
							<Zoom in={true}>
								<IconButton
									color='primary'
									onClick={() => setIsInChatRoom(!isInChatRoom)}
									className={classes.nextIconBtn}>
									<Typography className={classes.nextIconText}>
										채팅목록
									</Typography>
								</IconButton>
							</Zoom>

							<Menu
								id='menu-appbar'
								anchorEl={anchorEl}
								anchorOrigin={{
									vertical: 'top',
									horizontal: 'right',
								}}
								keepMounted
								transformOrigin={{
									vertical: 'top',
									horizontal: 'right',
								}}
								open={open}
								onClose={handleClose}>
								<MenuItem onClick={handleAddChat}>
									채팅 추가하기
								</MenuItem>
								<MenuItem onClick={handleAddFriend}>
									친구 추가하기
								</MenuItem>
							</Menu>
						</div>
					)}
				</Toolbar>
			</AppBar>
		</div>
	);
}
