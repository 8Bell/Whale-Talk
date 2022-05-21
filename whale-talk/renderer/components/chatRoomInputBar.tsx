/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { dbService, Timestamp } from '../fbase';
import { Button, Grid, InputBase } from '@material-ui/core';

const useStyles = makeStyles({
	form: {
		width: '100%',
		backgroundColor: 'rgba(220,220,220,0.3)',
		backdropFilter: 'blur(7px)',
		boxShadow: '0 0 20px 10px rgba(0,0,0,0.08)',
		position: 'fixed',
		bottom: 0,
		height: 95,
	},
	root: {
		height: 95,
		marginLeft: 20,
		marginRight: 20,
		//backgroundColor: 'rgba(200,200,200,50)',
		width: 'calc(100% - 40px)',
	},
	inputGrid: {},
	input: {
		backgroundColor: '#fbfbfb',
		boxShadow: '0 0 8px 5px rgba(0,0,0,0.13)',
		borderRadius: 30,
		boreder: 'none',
	},
	inputBase: {
		backgroundColor: 'rgba(240,240,240,0.9)',
		boxShadow: '0 0 16px 8px rgba(0,0,0,0.1)',
		borderRadius: 30,
		boreder: 'none',
		top: 21,
		height: 51,
		paddingLeft: 20,
		fontSize: 20,
		color: '#555',
		fontWeight: 400,
		zIndex: 1,
	},
	submitGrid: {},
	submit: {
		top: 20,
		left: 10,
		width: 100,
		height: 53,
		fontSize: 18,
		boxShadow: '0 0 8px 8px rgba(0,0,0,0.13)',
		borderRadius: 30,
		zIndex: 1,
	},
});

export default function ChatRoomInputBar({ thisRoom, myAccount, scrollToBottom }) {
	const classes = useStyles();

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
					{/* <TextField
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
					/> */}
					<InputBase
						className={classes.inputBase}
						inputProps={{ 'aria-label': 'naked' }}
						fullWidth
						type='text'
						id='textfield'
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
						전송{' '}
					</Button>
				</Grid>
			</Grid>
		</form>
	);
}
