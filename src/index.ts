import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import CocoNumbered from "./coco-numbered.json";
// @ts-ignore
import ODPipeline from "./OD/pipeline";
// @ts-ignore
import ZeroShotPipeline from "./zero-shot-OD/pipeline";

const app = new Hono();

app.use("/api/*", cors());

app.post("/api/zero-shot-OD", async function (c) {
  const {
    images,
    candidate_labels = Object.keys(CocoNumbered),
  }: {
    images: {
      url: string;
      id: string;
    }[];
    candidate_labels: string[];
  } = await c.req.json();

  console.log(images, candidate_labels);

  const detector = await ZeroShotPipeline.getInstance();

  const results: ODResult[][] = await Promise.all(
    images.map(function (img) {
      return detector(img.url, candidate_labels);
    })
  );

  return c.json({
    results: results.map(function (res: ODResult[], i: number) {
      return {
        url: images[i].url,
        id: images[i].id,
        res: res.map((r) => {
          return { ...r, group: [] };
        }),
      };
    }),
  });
});

app.post("/api/OD", async function (c) {
  const {
    images,
  }: {
    images: {
      url: string;
      id: string;
    }[];
  } = await c.req.json();

  const detector = await ODPipeline.getInstance();

  const results: ODResult[][] = await Promise.all(
    images.map(function (img) {
      return detector(img.url, { threshold: 0.9 });
    })
  );
  // const result = await detector(urls[0], { threshold: 0.9 });
  console.log(results);
  return c.json({
    results: results
      // .map(function (res) {
      //   return res.filter((r) => r.score > 0.75);
      // })
      .map(function (res: ODResult[], i: number) {
        return {
          url: images[i].url,
          id: images[i].id,
          res: res.map((r) => {
            return { ...r, group: [] };
          }),
        };
      }),
  });
});

const port = 3003;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});

type ODResult = {
  score: number;
  label: string;
  box: Box;
};

type Box = {
  xmin: number;
  ymin: number;
  xmax: number;
  ymax: number;
};
