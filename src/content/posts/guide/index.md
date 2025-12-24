---
title: 我的第一篇博客
published: 2025-12-24
description: "How to use this blog template."
cover: "./cover.webp"
pinned: true
tags: []
category: Guides
draft: false
---

2025 年 12 月 24 日，我开始写博客了，欢迎阅读我的第一篇博客文章！

我使用了 [Astro](https://astro.build/) 框架和 [Twilight](https://twilight.spr-aachen.com/) 主题部署。详情参考 [Twilight 文档](https://docs.twilight.spr-aachen.com/) 和 [Astro Docs](https://docs.astro.build/)。

## 框架与主题的选择

为什么选择用 astro 作为框架搭建博客呢？其实在上半年，我打算用 jekyll 来整自己的 github pages，但苦于没有网站建设经验，不懂目录架构，壳子搭玩之后感觉不好看，不想写，于是放弃了。暑假积累了些建站经验。步入 12 月，我发现周围的同学用 Wordpress、hexo、mkdocs 纷纷搭建出自己的博客，12 月下旬也没什么 ddl （作业用 AI 抄的差不多了），于是决定搭建博客。

 12 月 22 日开始整博客，一开始打算用广为人知的 hexo。在 hexo theme 上发现 [vivia](https://github.com/saicaca/hexo-theme-vivia) 主题，看起来非常美观，研究一晚上搭建出一个，放在 [Github 个人主页](https://50829.github.io)上。但这个主题已经不再维护了。原作者 saicaca 以此为基础，使用 astro 框架制作了新主题 [**Fuwari**](https://fuwari.vercel.app/)，更加美观。astro theme 商店里面还有许多精美的主题，该选哪一个呢？我顺便对主题做了些历史调查。

Astro 诞生于 2021 年，专注于静态网站的生成和部署。Hexo 诞生于 2013 年，是老牌的博客网站。Fuwari 主题诞生于 2024 年初，现在在 GitHub 上有超过 3k 的 star。其前身 vivia 诞生于 2023 年中旬，目前大约 500 star。在商店里搜索 fuwari, 可以搜到很多inspired by fuwari 的主题，比如 [Yukina](https://yukina-blog.vercel.app)、[Firefly](https://demo-firefly.netlify.app)、[Mizuki](https://mizuki.mysqil.com/)等主题。下图是它们 star-history.com 上的增长趋势：

[![Star History Chart](https://api.star-history.com/svg?repos=saicaca/fuwari,Spr-Aachen/Twilight,WhitePaper233/yukina,CuteLeaf/Firefly,matsuzaka-yuki/Mizuki,saicaca/hexo-theme-vivia&type=date&legend=top-left)](https://www.star-history.com/#saicaca/fuwari&Spr-Aachen/Twilight&WhitePaper233/yukina&CuteLeaf/Firefly&matsuzaka-yuki/Mizuki&saicaca/hexo-theme-vivia&type=date&legend=top-left)

**这些主题都很新**！很好看，并且有播放器。怎么选择呢？默默掏出了 Gemini 询问... 哈基米说，Firefly 像是一个流萤粉丝站，魔改过大量代码； Mizuki 功能全，使用 MD3 设计语言保证好看；而 Twilight 则有后端发博客的功能。当时觉得后端管理博客很新奇，就选了 Twilight 主题，但发现后端的界面一言难尽，与前端那是完全不匹配，功能也没有 Mizuki 全，有点后悔。不过先用着吧，等以后有空再改主题。

> [!NOTE]
> Twilight 后端博客管理页面实在过于糟糕，但这是一个改进的主要方向，以后还能交 PR ，难说呢！有时间研究研究

## 部署与博客的使用

23 号下午研究主题和部署。部署的流程很快，按照 AI 教程一步一步来，一小时内搞定。不过折腾 Umami 页面浏览统计和 Github Apps 花了不少时间（后端发博客需要认证）。接下来的重头戏是怎么把页面改造成我想要的样子。config.js 调了好久，背景图在 pixiv 上找了两个小时，发现所有正方形的图片和竖屏图都无法使用，得找专门的横幅桌面背景画师，最终找到 void_0 的这张作品。陆陆续续修改细节，此时已经快凌晨三点了，于是睡觉。

24 号十点起床研究博客的写作、如何填内容。也是在 vscode 里写起 markdown 了，体验和我常用的 obsidian 还很不一样！很烦人的一点是 ctrl + B 不是加粗，而是切换侧边栏······ 体验不太好。

发现这个网站可以把大部分东西给涵盖进去。终于在互联网上终于有个“基地”了！好耶！

## 博客的格式

### 元数据

文章开头需要添加 YAML 前端数据（frontmatter）：
```yaml
---
title: My First Blog Post
published: 2020-02-02
description: This is the first post of my new Astro blog.
cover: ./cover.webp 
tags: [Foo, Bar]
category: Front-end
draft: false
---
```

下面是详细的元数据表：

| Attribute     | Description |
|---------------|-------------|
| `title`       | The title of the post. |
| `published`   | The date the post was published. |
| `pinned`      | Whether this post is pinned to the top of the post list. |
| `description` | A short description of the post. Displayed on index page. |
| `image`       | The cover image path of the post. <br/>1. Start with `http://` or `https://`: Use web image <br/>2. Start with `/`: For image in `public` dir <br/>3. With none of the prefixes: Relative to the markdown file |
| `tags`        | The tags of the post. |
| `category`    | The category of the post. |
| `routeName`   | Route name for the post. The post will be accessible at `/posts/{routeName}/` |
| `licenseName` | The license name for the post content. |
| `encrypted` | Set true to encrypt this post. |
| `password` | "123456"|
| `author`      | The author of the post. |
| `sourceLink`  | The source link or reference for the post content. |
| `draft`       | If this post is still a draft, which won't be displayed. |

### 博客的存放
博客放在 `src/content/posts/` 目录下。可以新建文件夹来存放复杂博客（比如本篇）

```
src/content/posts/
├── post-1.md
└── post-2/
    ├── cover.png
    └── index.md
```

### Markdown Extended Features

附加功能包括：Github 仓库卡片、 Admonitions、GitHub syntax、Spoiler详情参考 [Extended Features](../features/)。参考以下格式：

::github{repo="50829/Mirawind"}

主题支持 Admonitions 和 callout。但只支持`note` `tip` `important` `warning` `caution`类型

Admonitions ：
:::note
Highlights information that users should take into account, even when skimming.
:::

:::note[MY CUSTOM TITLE]
This is a note with a custom title.
:::

:::tip
Optional information to help a user be more successful.
:::

:::important
Crucial information necessary for users to succeed.
:::

:::warning
Critical content demanding immediate user attention due to potential risks.
:::

:::caution
Negative potential consequences of an action.
:::

---
Github syntex and callouts ：

> [!TIP]
> [The GitHub syntax](https://github.com/orgs/community/discussions/16925) is also supported.

Spoiler：刮刮乐（大雾）
The content :spoiler[is hidden **ayyy**]!

```markdown
The content :spoiler[is hidden **ayyy**]!
```

支持数学公式：$\mathbf{v}=\mathbf{a}t+\mathbf{v_0}$
$$
x=\frac{-b\pm \sqrt{b^2-4ac}}{2}
$$

支持 mermaid 图表，不演示了。

### 视频嵌入

Just copy the embed code from YouTube or other platforms, and paste it in the markdown file as below

参照[视频嵌入](../videos/)

```markdown
---
title: Include Video in the Post
published: 2023-10-19
// ...
---

<iframe width="100%" height="468" src="https://www.youtube.com/embed/yrn7eInApnc?si=gGZeFbPcfMpJ1uV3_" title="YouTube video player" frameborder="0" allowfullscreen></iframe>

Examples:

- youtube:
<iframe width="100%" height="468" src="https://www.youtube.com/embed/yrn7eInApnc?si=gGZeFbPcfMpJ1uV3_" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

- bilibili:
<iframe width="100%" height="468" src="//player.bilibili.com/player.html?bvid=BV14QpMeSEuD&p=1&autoplay=0" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" &autoplay=0> </iframe>
```

## 其他内容
翻文件夹吧...... 写的好累...... content 里面是博客内容，data 里面是其他的东西，比如友情链接。

## 结语
这个教程怎么写的和 csdn 一样难读，哎哎哎

<big>最后祝大家新年快乐喵！ovo </big>
