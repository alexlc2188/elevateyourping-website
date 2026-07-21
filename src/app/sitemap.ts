import { MetadataRoute } from "next";

const URL = "https://www.elevateyourping.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: URL,
      changeFrequency: "monthly",
      lastModified: new Date(),
      priority: 0.5,
    },
    {
      url: URL + "/elevate-training-tool",
      changeFrequency: "monthly",
      lastModified: new Date(),
      priority: 0.5,
    },
    {
      url: URL + "/drill-library",
      changeFrequency: "monthly",
      lastModified: new Date(),
      priority: 0.5,
    },
    {
      url: URL + "/pro-match-review",
      changeFrequency: "monthly",
      lastModified: new Date(),
      priority: 0.5,
    },
    {
      url: URL + "/auth/login",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: URL + "/blog",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: URL + "/blog/forehand-loop-technique",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: URL + "/blog/forehand-drive-technique",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: URL + "/blog/master-the-pendulum-sidespin-serve",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: URL + "/blog/forehand-chop-in-table-tennis",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
