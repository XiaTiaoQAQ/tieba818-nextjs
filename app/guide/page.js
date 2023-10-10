import React from 'react';
import {Box, Typography} from '@mui/material';
import ReactMarkdown from "react-markdown";
import {TiebaInArticle} from "@/components/TiebaInArticle";

function GuideComponent() {
    const markdown = `
# 前言
使用Tieba.in表示您已明确了解并同意《Tieba.in 用户条约与免责条款》。
# 使用教程

系统目前支持帖子标题、帖子内容、目标昵称（甚至历史用户昵称）、目标用户名（同不二工具箱）的搜索。 \

### 如何找到目标
倘若用户名偏大众化，搜索结果可能会因为条数限制找不到目标用户，例如目标用户名为“nice  “。\\
\\
**推荐操作**：

### 根据目标用户的发帖内容找到目标
在您找不到结果时，如果您知道目标用户近期发布的帖子标题或内容，您可以：

1.直接复制帖子标题或内容。\\
2.通过模糊搜索，通常可以精确找到目标用户的发帖记录。\\
3.在搜索结果中点击用户头像或用户名，即可查询该用户的所有发帖记录。

### 根据目标用户的用户名找到目标
如果您知道对方的用户名，您可以直接在搜索框中输入对方的用户名，点击搜索即可（点私信或关于他可查看真实用户名）。\\
\\
感谢您选择并使用Tieba.in。我们始终致力于为用户提供更高效、更专业的搜索体验。如有任何建议或问题，请随时与我们联系。
    `
    return (
        // 兼容手机端居中展示
        <TiebaInArticle markdown={markdown}/>
    );
}

export default GuideComponent;
