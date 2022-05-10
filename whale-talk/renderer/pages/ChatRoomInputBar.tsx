import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import ChatRoundedIcon from '@material-ui/icons/ChatRounded';
import PeopleAltRoundedIcon from '@material-ui/icons/PeopleAltRounded';
import MenuRoundedIcon from '@material-ui/icons/MenuRounded';
import { authService, dbService } from './fbase';
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

export default function ChatRoomInputBar() {
	const router = useRouter();
	const classes = useStyles();
	const [value, setValue] = React.useState('chats');

	const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
		setValue(newValue);
	};
	const onClick = () => {
		authService.signOut();
	};

	const [input, setInput] = useState('');
	const onChange = (e) => {
		setInput(e.target.value);
	};
	const onSubmit = (e) => {
		e.preverntDefault();
		dbService.collection('chats').doc();
	};

	return (
		<form className={classes.form}>
			<Grid container className={classes.root}>
				<Grid item xs className={classes.inputGrid}>
					<TextField
						id='textfield'
						margin='normal'
						fullWidth
						InputLabelProps={{
							shrink: true,
						}}
						variant='outlined'
						className={classes.input}
						onChange={onChange}
					/>
				</Grid>
				<Grid item className={classes.submitGrid}>
					<Button
						variant='contained'
						color='primary'
						className={classes.submit}>
						전송
					</Button>
				</Grid>
			</Grid>
		</form>
	);
}
