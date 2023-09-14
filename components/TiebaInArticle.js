import {Box} from "@mui/material";
import ReactMarkdown from "react-markdown";
import React from "react";

export function TiebaInArticle({markdown}) {
    return (
        <Box sx={{display: 'flex', justifyContent: 'center'}}>
            <Box sx={{width: '100%', maxWidth: 800,
                padding: '1rem',
                // 行间距
                '& p': {
                    marginBottom: '0.8rem',
                },
                // 标题
                '& h1': {
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    marginBottom: '0.8rem',
                },
                '& h2': {
                    fontSize: '1.3rem',
                    fontWeight: 'bold',
                    marginBottom: '0.8rem',
                },
                '& h3': {
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    marginBottom: '0.8rem',
                },
                // code 块
                '& pre': {
                    backgroundColor: '#f5f5f5',
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    overflow: 'auto',
                },
                // 行内代码
                '& code': {
                    backgroundColor: '#f5f5f5',
                    padding: '0.2rem',
                    borderRadius: '0.2rem',
                },
                // li
                '& li': {
                    marginBottom: '0.5rem',
                    marginLeft: '1rem',
                },
            }}>
                <ReactMarkdown>
                    {markdown}
                </ReactMarkdown>
            </Box>
        </Box>
    )
}
