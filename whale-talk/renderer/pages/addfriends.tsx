import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function FormDialog({ addFriendState, setAddFriendState }) {
	const handleClickOpen = () => {
		setAddFriendState(true);
	};

	const handleClose = () => {
		setAddFriendState(false);
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
						친구의 이메일을 입력해주세요 (미구현)
					</DialogContentText>
					<TextField
						autoFocus
						margin='dense'
						id='name'
						label='이메일'
						type='email'
						fullWidth
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color='primary'>
						취소
					</Button>
					<Button onClick={handleClose} color='primary'>
						친구 추가
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
