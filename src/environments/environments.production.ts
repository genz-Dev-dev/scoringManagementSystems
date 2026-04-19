import { TokenStoragesService } from '../app/api/tokens/token-storages.service';
const tokenStorage = new TokenStoragesService();
export const environments = {
  production: true,
  showSkeleton: false,
  api_url: 'https://api.yourdomain.com',
  // api_url: 'http://localhost:8080/api/v1',
  token: tokenStorage.getToken(),
  image_url: 'https://res.cloudinary.com/dhbko4pck/image/upload/',
  // image_url: 'http://localhost:8080/api/v1/files/images/',
};