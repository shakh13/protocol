import React from 'react';
import {Box, Button, Container, Typography} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {useNavigate} from 'react-router-dom';

export default function NotFoundPage() {
    const navigate = useNavigate();
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '80vh',
            }}
        >
            <Container>
                <Grid container spacing={2}>
                    <Grid xs={6}>
                        <Typography variant="h1">
                            404
                        </Typography>
                        <Typography variant="h6">
                            Страница, которую вы ищете, не существует.
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => navigate(-1)}
                            sx={{marginY: 2}}
                        >
                            ← Назад
                        </Button>
                    </Grid>
                    <Grid xs={6}>
                        <img src="/assets/notfound.png" alt="Not Found" width={350}/>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}