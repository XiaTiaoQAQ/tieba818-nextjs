'use client'
import React, {useState} from 'react';
import {Grid, styled, TextField} from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {useToast} from "@/components/ToastContext";
import xtRequest from "@/utils/xt-request";
import {useRouter} from 'next/navigation';
import {XTContext} from "@/app/layout";


const StyledContainer = styled(Grid)(({theme}) => ({
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'start',
    paddingTop: '5rem',
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
    const context = React.useContext(XTContext);
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const showToast = useToast();
    const router = useRouter();
    const handleLogin = async (e) => {
        e.preventDefault();
        if (!phone || !password) {
            return;
        }
        const url = `/818-api/818/user/login?phone=${phone}&password=${password}`;
        const data = await xtRequest({
            url, method: 'POST', onSuccess: (data) => {
                showToast('登录成功');
                const dataObj = data.data
                const token = dataObj.token
                // 写入token到localStorage
                localStorage.setItem('token', token);
                // 跳转并刷新页面
                context.setToken(token);
                router.push('/');
            }, onFailure: () => {
                showToast('登录失败，请检查后重试');
            }
        });
    };
    // 判断是否已经登录
    if (context.token) {
        router.push('/');
        return <div>正在跳转...</div>
    }
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
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                        <StyledTextField
                            label="密码"
                            variant="outlined"
                            type="password"
                            fullWidth
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <ActionRow container>
                            <Button color="primary" onClick={handleLogin}>
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
