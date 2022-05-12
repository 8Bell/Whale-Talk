import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { dbService } from '../fbase';

export default function FormDialog({ addFriendState, setAddFriendState, myAccount }) {
	const handleClickOpen = () => {
		setAddFriendState(true);
	};

	const handleClose = () => {
		setAddFriendState(false);
	};

	const [friendEmail, setFriendEmail] = useState('');

	const handleAddFriend = (e) => {
		// dbService.collection('users').doc(myAccount.uid).update({
		// 	friend
		// });
	};

	return (
		<div>
			<Dialog
				open={addFriendState}
				onClose={handleClose}
				fullWidth
				aria-labelledby='form-dialog-title'>
				<DialogTitle id='form-dialog-title'>친구추가</DialogTitle>
				<DialogContent>
					<DialogContentText>
						친구의 이메일을 입력해주세요.(업데이트 준비 중)
					</DialogContentText>
					<TextField
						autoFocus
						margin='dense'
						id='name'
						label='이메일'
						type='email'
						value={friendEmail}
						fullWidth
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color='primary'>
						취소
					</Button>
					<Button onClick={handleAddFriend} color='primary'>
						친구 추가
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
