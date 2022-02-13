import axios from 'axios';

const getUserData = async (urlParams: string) => {
  try {
    const response: any = await axios.get(urlParams);
    return response && response.data;
  } catch (error) {
    throw error;
  }
}

export default getUserData;