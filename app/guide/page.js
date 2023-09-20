import React from 'react';
import {Box, Typography} from '@mui/material';
import ReactMarkdown from "react-markdown";
import {TiebaInArticle} from "@/components/TiebaInArticle";

function GuideComponent() {
    const markdown = `
# 前言
使用Tieba.in表示您已明确了解并同意《Tieba.in 用户条约与免责条款》。
# 使用教程
## 如何精搜目标用户
### 直接使用ID查询
Tieba.in精搜用户所使用的Id与“不二贴吧工具箱”等所使用的用户名不同，在贴吧网页端点击目标用户名主页，直接复制主页地址到搜索栏，tieba.in会自动解析id，例如：
\`\`\`xml
https://tieba.baidu.com/home/main?id=tb.1.d33085fa.g9TjPBtrsaAFVzLKKZvxBw&fr=index
\`\`\`
\\
会自动提取其中id为tb.1.d33085fa.g9TjPBtrsaAFVzLKKZvxBw进行搜索。
### 通过模糊搜索找到目标
模糊搜索因为性能限制，目前最多展示前100条。不推荐使用昵称直接模糊搜索，因为快照创建限制，部分超长用户名在系统内会显示例如：“樱岛麻….“。\\
\\
此外倘若用户名偏大众化，搜索结果可能会因为条数限制找不到目标用户，例如目标用户名为“nice  “。\\
\\
**推荐操作**：

如果您知道目标用户近期发布的帖子标题或内容，您可以：

1.直接复制帖子标题或内容。\\
2.在Tieba.in搜索栏中粘贴。\\
3.通过模糊搜索，通常可以精确找到目标用户的发帖记录。\\
4.在搜索结果中点击用户头像或用户名，即可进入精确搜索模式。
\\
\\
感谢您选择并使用Tieba.in。我们始终致力于为用户提供更高效、更专业的搜索体验。如有任何建议或问题，请随时与我们联系。
    `
    return (
        // 兼容手机端居中展示
        <TiebaInArticle markdown={markdown}/>
    );
}

export default GuideComponent;
