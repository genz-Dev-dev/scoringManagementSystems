import { TokenStoragesService } from "src/app/core/services/token-storage/token-storages.service";
const tokenStorage = new TokenStoragesService();
export const environments = {
  api_url: 'http://localhost:8080/api/v1',
  // api_url: 'http://172.20.10.3:8080/api/v1',
  // api_url: 'http://192.168.100.79:8080/api/v1',
  token: tokenStorage.getToken(),
  // image_url: 'https://192.168.1',
  // image_url: 'https://res.cloudinary.com/dhbko4pck/image/upload/',
  image_url: 'http://localhost:8080/api/v1/home/tola/Documents/springProjects/scoring_management_system/BoukryUniversity',
};
