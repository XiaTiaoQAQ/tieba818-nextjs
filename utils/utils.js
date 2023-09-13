export function fromVipLevelToVipName(vipLevel) {
    switch (vipLevel) {
        case 1:
            return '月卡用户';
        case 2:
            return '季卡用户';
        case 3:
            return '年卡用户';
        case 10:
            return '体验卡用户';
        default:
            return '未知VIP等级';
    }
}
