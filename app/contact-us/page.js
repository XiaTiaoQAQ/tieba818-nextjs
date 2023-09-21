import {TiebaInArticle} from "@/components/TiebaInArticle";

export default function ContactUsPage() {
    const markdown = `
# TiebaIn Inc. 免责与侵权联系声明
## 免责声明

此文档由 TiebaIn Inc. 提供。我们的目标是确保所提供的信息既准确又完整。然而，TiebaIn Inc. 不保证此处提供的信息的准确性、完整性或及时性。所有内容均按“原样”提供，不做任何明示或暗示的保证。

使用此内容是您自己的决定。在法律允许的最大范围内，TiebaIn Inc. 对于因使用或无法使用此内容而造成的任何直接、间接、特殊、附带、或因此产生的损害均不承担任何责任。

## 侵权联系

我们重视知识产权，尊重所有内容创作者和版权所有者。我们所有的数据均来自公开的互联网资料。如果您认为我们所发布的任何内容侵犯了您的知识产权，或者您拥有版权的作品在我们的平台上被未经授权地发布或分享，请立即与我们联系。

为了更有效地处理您的请求，请在您的通知中包括以下信息：

- 您所声称侵权的资料或内容的确切描述和位置。
- 描述您声称已被侵权的受版权保护的工作或材料。
- 您的联系信息，如地址、电话号码和电子邮件地址。
- 一个声明，表明您相信上述信息是正确的，并且您是所声称的侵权内容的版权所有者或已被授权代表该版权所有者。

请将上述信息发送到以下邮箱地址：

[tieba23.in@gmail.com](mailto:tieba23.in@gmail.com)

请注意，根据《数字千年版权法》（DMCA），对于未经实质审查而提交的虚假的侵权通知，可能会对提交者产生法律责任。

----

**CopyRight © 2023 TiebaIn Inc. All Rights Reserved.**
    `
    return (
        <TiebaInArticle markdown={markdown}/>
    );
}
