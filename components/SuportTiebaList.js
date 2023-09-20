import React, {useState} from 'react';
import {IconButton, Dialog, DialogTitle, DialogContent, Typography, Box, List} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const SupportedTiebaList = () => {
    const tiebaList = [
        '落俗',
        'LOL陪玩',
        '和平精英陪玩',
        '王者荣耀陪玩',
        '连',
        '连麦',
        '处对象',
        '网恋',
        '涩涩屋',
        '一览芳月',
        '湿热一瞬间到来',
        '莺媛',
        '艾欧尼亚',
        '祖安',
        '黑色玫瑰',
        '比尔吉沃特',
        '王者荣耀',
        '和平精英',
        '英雄联盟手游',
        '英雄联盟',
        'lolid',
        '处qy',
        '花麦',
        '无畏契约',
        '婚姻',
        '憨批',
        '逆水寒手游',
        'qq炫舞',
        '永劫无间',
        '永劫无间陪玩',
        'cf手游',
        '相亲',
        '美化',
        '比心app',
        '德玛西亚',
        '炫舞时代',
        '金铲铲之战',
        '逆战',
        '剑网3',
        'csgo',
        '孙笑川',
        'sm',
        '同性恋',
        '小照片',
        '公共物品mmm',
        '斯幕避难所',
        '扭曲丛林',
        '无畏契约陪玩',
        '梦幻西游',
        '地下城与勇士',
        '女朋友',
    ]
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());

    return (
        <Box>
            <Typography component="span" gutterBottom variant="body2"
                        color="textSecondary">目前支持的板块和数据范围</Typography>
            <IconButton onClick={handleClickOpen}>
                <InfoOutlinedIcon/>
            </IconButton>

            <Dialog onClose={handleClose} open={open} maxWidth={'sm'} fullWidth={true}>
                <DialogTitle>目前支持的板块列表</DialogTitle>
                {/*数据集中于2023年7月后，2023年7月前数据较为稀疏*/}
                <Typography gutterBottom variant="body2" color="textSecondary" style={{marginLeft: '20px',marginRight:'20px'}}>数据集中于2023年7月后，2023年7月前数据较为稀疏</Typography>
                <Typography gutterBottom variant="body2" color="textSecondary" style={{marginLeft: '20px',marginRight:'20px'}}>需要新增快照监控的板块请在工单反馈，年费VIP需求会被优先考虑。</Typography>
                <Typography gutterBottom variant="body2" color="textSecondary" style={{marginLeft: '20px',marginRight:'20px'}}
                >支持数据更新于：{currentTime}</Typography>
                <DialogContent style={{maxHeight: '400px', overflow: 'auto'}}>
                    <List>
                        {tiebaList.map((tieba, index) => (
                            <Typography key={index} gutterBottom>
                                {tieba}
                            </Typography>
                        ))}
                    </List>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default SupportedTiebaList;
