import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import MuiCard from '@mui/material/Card';
import {styled} from '@mui/material/styles';
import ForgotPassword from "./forgot_password.jsx";
import AxiosInstance from "../../components/axios_instance.jsx";
import {useEffect} from "react";

const Card = styled(MuiCard)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    [theme.breakpoints.up('sm')]: {
        maxWidth: '450px',
    },
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    ...theme.applyStyles('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));

export default function LoginPage() {
    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const [showMessage, setShowMessage] = React.useState(false);

    const checkLogin = () => {
        const token = localStorage.getItem('token');
        if (token) {
            AxiosInstance.get('me').then((response) => {
                localStorage.setItem('fullname', response.data.fullname);
                if (response.data.isAdmin) {
                    localStorage.setItem('isAdmin', true);
                }
                window.location.href = response.data.isAdmin ? '/admin' : '/protocols';
            }).catch((error) => {
                localStorage.clear();
            });
        }
    }

    useEffect(() => {
        checkLogin();
    }, []);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const validateInputs = () => {
        setShowMessage(false);
        const email = document.getElementById('email');
        const password = document.getElementById('password');

        let isValid = true;

        if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
            setEmailError(true);
            setEmailErrorMessage('Пожалуйста, введите действительный Email');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        if (!password.value || password.value.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage('Пароль должен быть длиной не менее 6 символов.');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        if (isValid) {
            AxiosInstance.post("login/", {
                email: email.value,
                password: password.value,
            }).then((response) => {
                console.log(response);
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("email", response.data.user.email);
                localStorage.setItem("fullname", response.data.fullname);
                if (response.data.isAdmin) {
                    localStorage.setItem("isAdmin", response.data.isAdmin);
                }
                window.location.href = response.data.isAdmin ? "/admin" : "/protocols";
            }).catch((error) => {
                console.log(error);
                setShowMessage(true);
                localStorage.clear();
            });
        }
    };

    return (
        <Box sx={{
            height: 'calc(100vh)',
            boxSizing: 'border-box',
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
        }}>
            <Card variant="outlined">
                <Typography
                    component="h1"
                    variant="h4"
                    sx={{width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)'}}
                >
                    Авторизация
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        gap: 2,
                    }}
                >
                    <FormControl>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <TextField
                            error={emailError}
                            helperText={emailErrorMessage}
                            id="email"
                            type="email"
                            name="email"
                            placeholder="your@email.com"
                            autoComplete="email"
                            autoFocus
                            required
                            fullWidth
                            variant="outlined"
                            color={emailError ? 'error' : 'primary'}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="password">Пароль</FormLabel>
                        <TextField
                            error={passwordError}
                            helperText={passwordErrorMessage}
                            name="password"
                            placeholder="••••••"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            autoFocus
                            required
                            fullWidth
                            variant="outlined"
                            color={passwordError ? 'error' : 'primary'}
                        />
                    </FormControl>
                    {showMessage &&
                        <Box sx={{color: "red", width: "100%", textAlign: "center", fontSize: 14}}>
                            Email или пароль неверно
                        </Box>}
                    <Button
                        // type="submit"
                        fullWidth
                        variant="contained"
                        onClick={validateInputs}
                    >
                        Войти
                    </Button>
                    <Link
                        component="button"
                        type="button"
                        onClick={handleClickOpen}
                        variant="body2"
                        underline="none"
                        sx={{alignSelf: 'center'}}
                    >
                        Забыли пароль?
                    </Link>
                    <ForgotPassword open={open} handleClose={handleClose}/>
                </Box>
            </Card>
        </Box>
    );
}