import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';

function ForgotPassword({open, handleClose}) {
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth={false}
            slotProps={{
                paper: {
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        handleClose();
                    },
                    sx: {
                        backgroundImage: 'none',
                        width: '100%',          // Use full dialog width
                        maxWidth: '400px',      // Cap width (or 90vw if responsive)
                        boxSizing: 'border-box',
                        overflowX: 'hidden',
                    },
                },
            }}
        >
            <DialogTitle>Сбрось пароля</DialogTitle>
            <DialogContent
                sx={{p: 3}}
            >
                <DialogContentText>
                    Введите Email, и мы отправим вам ссылку для сброса пароля.
                </DialogContentText>
                <OutlinedInput
                    autoFocus
                    required
                    margin="dense"
                    id="email"
                    name="email"
                    placeholder="Email адрес"
                    type="email"
                    fullWidth
                />
            </DialogContent>
            <DialogActions sx={{px: 3, pb: 3}}>
                <Button onClick={handleClose}>Отмена</Button>
                <Button variant="contained" type="submit">
                    Продолжить
                </Button>
            </DialogActions>
        </Dialog>
    );
}

ForgotPassword.propTypes = {
    handleClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};

export default ForgotPassword;