// npm i @xenova/transformers
import { pipeline } from "@xenova/transformers";

class ZeroShotODPipeline {
  static task = "zero-shot-object-detection";
  static model = "Xenova/owlv2-base-patch16-ensemble";
  static instance = null;

  static async getInstance() {
    if (this.instance === null) {
      // NOTE: Uncomment this to change the cache directory
      // env.cacheDir = './.cache';

      this.instance = await pipeline(this.task, this.model);
    }

    return this.instance;
  }
}

export default ZeroShotODPipeline;
