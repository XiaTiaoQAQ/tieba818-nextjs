'use client'
import React from 'react';
import {Grid, styled, TextField} from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const StyledContainer = styled(Grid)(({theme}) => ({
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // Make the background a bit darker
}));

const StyledCard = styled(Card)(({theme}) => ({
    width: '100%',
    maxWidth: 500,
}));

const StyledTitle = styled(Typography)(({theme}) => ({
    marginBottom: theme.spacing(2),
}));

const StyledTextField = styled(TextField)(({theme}) => ({
    marginTop: theme.spacing(2),
}));

const ActionRow = styled(Grid)(({theme}) => ({
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
}));

export default function Login() {
    return (
        <>
            <StyledContainer container>
                <StyledCard>
                    <CardContent>
                        <StyledTitle variant="h5">
                            登录
                        </StyledTitle>
                        <StyledTextField
                            label="账号"
                            variant="outlined"
                            fullWidth
                        />
                        <StyledTextField
                            label="密码"
                            variant="outlined"
                            type="password"
                            fullWidth
                        />
                        <ActionRow container>
                            <Button color="primary">
                                登录
                            </Button>
                            <Button color="primary">
                                注册
                            </Button>
                        </ActionRow>
                    </CardContent>
                </StyledCard>
            </StyledContainer>
        </>
    );
}
