import { ValueObject } from 'src/core/primitives/value-object';

export interface ModelImagesProps {
  productModelId: number;
  filePath: string;
}

export class ModelImages extends ValueObject<ModelImagesProps> {
  get filePath() {
    return this.filePath;
  }

  get productModelId() {
    return this.productModelId;
  }

  static create(props: ModelImagesProps): ModelImages {
    return new ModelImages(props);
  }
}
