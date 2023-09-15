import {TiebaInArticle} from "@/components/TiebaInArticle";
import React from "react";

export default function DisclaimerClausePage() {
    const markdown = `
# 用户条约与免责条款

### **第一条：用户同意与接受条款**

1.1 每位使用**tieba.in**网站的用户（以下简称"用户"）在访问和使用本网站前，应仔细阅读并完全理解本条约与免责条款（以下简称“条款”）。访问或使用本网站即表示用户已经完全接受本条款的所有内容。

1.2 **tieba.in**有权在必要时修改本条款，并在本网站上发布，无需另行通知每位用户。用户在修改后继续使用本网站则视为已接受了修改后的条款。

### **第二条：内容来源与版权声明**

2.1 本网站的数据来源于公开互联网。**tieba.in**不声称对这些内容拥有版权。

2.2 用户承诺不将本网站的任何内容用于商业目的或其他可能侵犯版权的活动。

### **第三条：侵权内容与删除请求**

3.1 若权利人发现本网站存在侵犯其合法权益的内容，可以向我们提交删除请求。我们会在收到请求后的合理时间内处理。

3.2 用户了解并同意，任何由于使用本网站产生的版权纠纷、隐私问题或其他法律争议，均由用户自行承担，**tieba.in**不承担任何责任。

### **第四条：免责声明**

4.1 本网站的内容仅供参考和娱乐，不构成任何建议或承诺。**tieba.in**对因使用或依赖本网站内容产生的任何损失或伤害不承担责任。

4.2 用户了解并同意使用本网站承担所有风险。**tieba.in**不保证本网站的内容完整性、准确性、及时性或非侵权性。

### **第五条：最终解释权**

5.1 本条款的最终解释权归**tieba.in**所有。

用户在使用本网站之前，请确保已经完全理解并同意以上条款。如不同意任何条款，请立即停止使用本网站。
    `
    return (
        // 兼容手机端居中展示
        <TiebaInArticle markdown={markdown}/>
    );
}
