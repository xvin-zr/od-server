import { pipeline } from "@xenova/transformers";

class ODPipeline {
  static task = "object-detection";
  static model = "Xenova/detr-resnet-101";
  static instance = null;

  static async getInstance(progress_callback = null) {
    if (this.instance === null) {
      // NOTE: Uncomment this to change the cache directory
      // env.cacheDir = './.cache';

      this.instance = await pipeline(this.task, this.model, {
        progress_callback,
      });
    }

    return this.instance;
  }
}

export default ODPipeline;
