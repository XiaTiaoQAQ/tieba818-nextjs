'use client'
import React, {useEffect, useState} from 'react';
import {Grid, styled, TextField} from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {useToast} from "@/components/ToastContext";
import xtRequest from "@/utils/xt-request";
import {useRouter} from 'next/navigation';
import {useLoadingDialog} from "@/components/LoadingDialogContext";
import Link from "next/link";
import {XTContext} from "@/app/client-root-layout";


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

export default function LoginOrRegister({searchParams: {mode = 'login'}}) {
    const context = React.useContext(XTContext);
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const showToast = useToast();
    const [isLoginMode, setIsLoginMode] = useState(mode === 'login');
    const router = useRouter();
    const loadingDialogContext = useLoadingDialog();
    useEffect(() => {
            setIsLoginMode(mode === 'login');
        }
        , [mode]);
    const handleSubmission = async (e) => {
        e.preventDefault();

        if (!phone || !password) {
            return;
        }

        const endpoint = isLoginMode
            ? `/818-api/818/user/login`
            : `/818-api/818/user/register`;

        const url = `${endpoint}?phone=${phone}&password=${password}`;
        loadingDialogContext.show("正在" + (isLoginMode ? '登录' : '注册') + "...");
        await xtRequest({
            url, method: 'POST',
            onSuccess: (data) => {
                loadingDialogContext.close()
                const successMessage = isLoginMode ? '登录成功' : '注册成功';
                showToast(successMessage);
                const dataObj = data.data;
                const token = dataObj.token;
                localStorage.setItem('token', token);
                context.setToken(token);
                context.setCurrentUserInfo(dataObj);
                router.push('/');
            },
            onFailure: () => {
                const failureMessage = isLoginMode
                    ? '登录失败，请检查后重试'
                    : '注册失败，请检查后重试，可能是手机号已经被注册或者当前IP注册过多';
                loadingDialogContext.close()
                showToast(failureMessage);
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
                            {isLoginMode ? '登录' : '注册'}
                        </StyledTitle>
                        <Typography variant="body2" color="textSecondary" align="left">
                            Tieba Inc.后续将开启邀请注册制，请您妥善保管您的账号，恶意注册、请求将会导致账号、IP永久封禁。
                        </Typography>
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
                        {/*在您登录或注册前，请确保您已阅读并同意《数据使用说明》和《免责条款》*/}
                        <Typography variant="body2" color="textSecondary" align="left" sx={{marginTop: '0.5rem'}}>
                            在您登录或注册前，请确保您已阅读并同意
                            <Link href="/disclaimer-clause" color="primary"  prefetch={true}
                                  replace={false}>
                                《数据使用说明》
                            </Link>
                        </Typography>
                        <ActionRow container>
                            <Button color="primary" onClick={handleSubmission}>
                                {isLoginMode ? '登录' : '注册'}
                            </Button>
                            <Button color="secondary" onClick={() => setIsLoginMode(!isLoginMode)}>
                                {isLoginMode ? '未有账号？去注册' : '已有账号？去登录'}
                            </Button>
                        </ActionRow>
                    </CardContent>
                </StyledCard>
            </StyledContainer>
        </>
    );
}
