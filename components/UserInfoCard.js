import React from 'react';
import {Card, CardContent, Avatar, Typography, Divider, Grid} from '@mui/material';

const UserInfoCard = ({data, onCardClick}) => {
    // const sortedGrades = Object.values(data.honor.grade).sort((a, b) => b.count - a.count); 加上判断
    var sortedGradesArray = [];

    if (data.honor && data.honor.grade) {
        const grade = data.honor.grade;

        const sortedKeys = Object.keys(grade).sort((a, b) => parseInt(b) - parseInt(a)); // Modify sort for descending order
        for (const key of sortedKeys) {
            for (const name of grade[key].forum_list) {
                sortedGradesArray.push({
                    'level': parseInt(key),
                    'name': name
                });
            }
        }
    }

    return (
        <Card style={{
            width: '250px',
            marginRight: '10px',
            // 悬浮显示点击
            cursor: 'pointer',
        }}
              onClick={onCardClick}
        >
            <CardContent>
                {/* 用户头像和名称 */}
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <Avatar
                        src={data.portrait ? "https://gss0.bdstatic.com/6LZ1dD3d1sgCo2Kml5_Y_D3/sys/portrait/item/" + data.portrait : undefined}
                        alt={data.show_nickname}
                    />
                    <Typography variant="subtitle1" style={{marginLeft: '10px'}}>
                        {data.show_nickname ? data.show_nickname : "未知"}
                    </Typography>
                </div>
                {data.can_followed == null ? (
                    <Typography variant="body2" style={{marginTop: '10px', color: '#FFC107'}}>
                        用户可能处于贴吧封禁状态
                    </Typography>
                ) : null
                }
                {/* 用户等级和图标 */}
                {data.mParr_props && data.mParr_props.level ? (
                    <div style={{display: 'flex', alignItems: 'center', marginTop: '10px'}}>
                        <img
                            src={data.mParr_props.level.pic_url}
                            alt="level-icon"
                            style={{width: '20px', marginRight: '10px'}}
                        />
                        <Typography variant="body1">贴吧VIP: {data.mParr_props.level.props_id}级</Typography>
                    </div>
                ) : null}
                {data.name && (
                    <Typography variant="body2" style={{marginTop: '10px'}}>
                        用户名: {data.name}
                    </Typography>
                )
                }
                {data.name_show && (
                    <Typography variant="body2" style={{marginTop: '10px'}}>
                        缓存昵称: {data.name_show}
                    </Typography>
                )
                }
                {/* 历史昵称 */}
                {data.history_nick_names && data.history_nick_names.length ? (
                    <>
                        <Divider style={{margin: '10px 0'}}/>
                        <Typography variant="body2" style={{marginTop: '10px'}}>
                            历史昵称:
                        </Typography>
                        <Grid container spacing={1}>
                            {data.history_nick_names.map((nickName, nickNameIndex) => (
                                <Grid item key={`${nickNameIndex}-${nickNameIndex}`}>
                                    <Typography variant="body2">{nickName}</Typography>
                                </Grid>
                            ))}
                        </Grid>
                    </>
                ) : null}

                {/* 贴吧年龄 */}
                {data.tb_age && (
                    <Typography variant="body2" style={{marginTop: '10px'}}>
                        贴吧年龄: {data.tb_age ? `${data.tb_age}年` : "未知"}
                    </Typography>
                )
                }


                {/* 其他信息 */}
                {data.post_num && (
                    <Typography variant="body2" style={{marginTop: '10px'}}>
                        帖子数量: {data.post_num}
                    </Typography>
                )
                }

                {data.honor && data.honor.grade ? (
                    <>
                        <Divider style={{margin: '10px 0'}}/>
                        <div style={
                            {
                                // 横向排列，自动换行
                                display: 'flex',
                                flexWrap: 'wrap',
                                marginTop: '5px',
                                gap: '5px',
                            }
                        }>
                            {sortedGradesArray.map((forum, forumIndex) => (
                                <div key={`${forumIndex}-${forumIndex}`} style={{
                                    marginBottom: '2px',
                                    padding: '5px 10px',
                                    // 淡灰色描边，圆角2px
                                    border: '1px solid #e0e0e0',
                                    // 左右排列
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <Typography variant="body2">{forum.name}</Typography>
                                    <Typography variant="body2"
                                                sx={{
                                                    //     黄色五角星背景
                                                    backgroundColor: '#FFC107',
                                                    borderRadius: '64px',
                                                    padding: '2px 5px',
                                                    color: '#fff',
                                                    fontSize: '12px',
                                                    marginLeft: '5px'
                                                }}
                                    >{forum.level}</Typography>
                                </div>
                            ))}
                        </div>

                    </>
                ) : null}
            </CardContent>
        </Card>
    );
};

export default UserInfoCard;
