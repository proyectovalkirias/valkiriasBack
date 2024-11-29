import { v2 as cloudinary, UploadApiResponse} from 'cloudinary';
import { config as dotenvConfig } from 'dotenv';
import { Injectable } from '@nestjs/common';
dotenvConfig({ path: '.env' });

export const CloudinaryConfig = {
  provide: 'CLOUDINARY',
  useFactory: () => {
    return cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_API_KEY,
      api_secret: process.env.CLOUD_API_SECRET,
    });
  },
};

@Injectable()
export class CloudinaryService {
  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return cloudinary.uploader.upload(file.path, { folder: 'products' });
  }

  async deleteImage(publicId: string): Promise<void> {
    return cloudinary.uploader.destroy(publicId);
  }
};
