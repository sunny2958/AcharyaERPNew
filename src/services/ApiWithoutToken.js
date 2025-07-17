import Axios from "axios";

// Local
// const apiUrl = `http://192.168.0.151:8080`;

// Staging
// const apiUrl = `https://www.stageapi-acharyainstitutes.in/Acharya_University`;

// Kubernetes
// const apiUrl = `https://api-dev-acharyainstitutes.com`;

// Production
 const apiUrl = `https://acerp.acharyaerptech.in`;

const axiosNoToken = Axios.create({
  baseURL: apiUrl,
});

export default axiosNoToken;
