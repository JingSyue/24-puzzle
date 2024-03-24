// services/gameService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export async function fetchQuestion(userId) {
  const response = await axios.get(`${API_BASE_URL}/start`, {
    params: { user_id: userId || undefined, level: 'newbie' }
  });
  return response.data;
}

export async function submitSolution(userId, solution, numbers) {
  const response = await axios.post(`${API_BASE_URL}/submit`, {
    user_id: userId,
    solution: solution,
    numbers: numbers
  });
  return response.data;
}
