import dayjs from "dayjs";

export function fromVipLevelToVipName(vipLevel) {
    switch (vipLevel) {
        case 1:
            return '月卡用户';
        case 2:
            return '季卡用户';
        case 3:
            return '年卡用户';
        case 0:
            return '体验卡用户';
        default:
            return '未知VIP等级';
    }
}

/**
 * 根据时间，返回 3秒前、3分钟前、3小时前、2023-07-01 12:00:00
 */
export function fromTimeToReadableTime(time) {
    const now = dayjs();
    const dayjsTime = dayjs(time);
    const diff = now.diff(dayjsTime, 'second');
    if (diff < 60) {
        return diff + '秒前';
    }
    const diffMinute = now.diff(dayjsTime, 'minute');
    if (diffMinute < 60) {
        return diffMinute + '分钟前';
    }
    const diffHour = now.diff(dayjsTime, 'hour');
    if (diffHour < 24) {
        return diffHour + '小时前';
    }
    return dayjsTime.format('YYYY-MM-DD HH:mm:ss');
}
