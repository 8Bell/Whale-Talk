import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import ChatRoundedIcon from '@material-ui/icons/ChatRounded';
import PeopleAltRoundedIcon from '@material-ui/icons/PeopleAltRounded';
import MenuRoundedIcon from '@material-ui/icons/MenuRounded';

import { authService, dbService, Timestamp } from './fbase';
import Link from '../components/Link';
import { useRouter } from 'next/router';
import { Button, Grid, TextField } from '@material-ui/core';

const useStyles = makeStyles({
	form: {
		width: '100%',
		backgroundColor: '#eeeeee',
		position: 'fixed',
		bottom: 0,
		height: 90,
	},
	root: {
		height: 90,
		marginLeft: 20,
		marginRight: 20,
		backgroundColor: '#eeeeee',
		width: 'calc(100% - 40px)',
	},
	inputGrid: {},
	input: { backgroundColor: '#fbfbfb' },
	submitGrid: {},
	submit: { top: 16, left: 10, width: 100, height: 55, fontSize: 18 },
});

export default function ChatRoomInputBar({ thisRoom, myAccount, scrollToBottom }) {
	const router = useRouter();
	const classes = useStyles();
	const [value, setValue] = React.useState('chats');

	const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
		setValue(newValue);
	};
	const onClick = () => {
		authService.signOut();
	};
	console.log(thisRoom);
	console.log(myAccount.uid);

	const [input, setInput] = useState('');
	const onChange = (e) => {
		setInput(e.target.value);
	};
	const onSubmit = async (e) => {
		e.preventDefault();
		if (input !== '') {
			await dbService.collection('chats').doc(thisRoom).collection('dialogues').add({
				createdAt: Date.now(),
				createdDate: Timestamp,
				writer: myAccount.uid,
				text: input,
				chatId: thisRoom,
			});
			await dbService
				.collection('chats')
				.doc(thisRoom)
				.update({
					lastDialogue:
						input.substr(0, 20) + `${input.length > 20 ? '...' : ''}`,
					lastDialogueAt: Date.now(),
				});
			setInput('');
			scrollToBottom();
		}
	};

	return (
		<form className={classes.form} onSubmit={onSubmit}>
			<Grid container className={classes.root}>
				<Grid item xs className={classes.inputGrid}>
					<TextField
						type='text'
						id='textfield'
						margin='normal'
						fullWidth
						InputLabelProps={{
							shrink: true,
						}}
						variant='outlined'
						className={classes.input}
						onChange={onChange}
						value={input}
					/>
				</Grid>
				<Grid item className={classes.submitGrid}>
					<Button
						type='submit'
						variant='contained'
						color='primary'
						className={classes.submit}
						onClick={onSubmit}>
						전송
					</Button>
				</Grid>
			</Grid>
		</form>
	);
}
