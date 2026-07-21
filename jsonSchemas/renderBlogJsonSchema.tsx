import { JSXElementConstructor, ReactElement } from 'react'

type PostRender = {
    meta: {
        title: string
        date: string
        datetime: string
        description: string
        href: string
    }
    slug: string
    content: ReactElement<any, string | JSXElementConstructor<any>>
}

// TODO: post.content probably does work. not seen as a string

export function renderBlogSchema(post: PostRender) {
    return JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.meta.title,
        // image: `https://www.crossyshop.com${blog.meta.featuredImageSrc}`,
        // editor: "Wei.t",
        genre: 'search engine optimization',
        keywords: 'table tennis, pingpong, tennis de table',
        wordcount: '700',
        publisher: 'Elevate Your Play',
        url: `https://www.elevateyourping.com/blog/${post.slug}`,
        datePublished: post.meta.date,
        dateCreated: post.meta.date,

        description: post.meta.description,
        articleBody: post.content,
        author: {
            '@type': 'Person',
            name: 'ElevateYourPing admin.',
        },
    })
}
