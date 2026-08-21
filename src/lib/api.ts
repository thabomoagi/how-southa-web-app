import { PUBLIC_API_BASE_URL } from '$env/static/public';

const BASE = PUBLIC_API_BASE_URL;
const COLD_START_TIMEOUT = 60000;

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), COLD_START_TIMEOUT);

    try {
        const res = await fetch(`${BASE}${endpoint}`, {
            ...options,
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
                ...options.headers
            }
        });

        clearTimeout(timeoutId);

        const json = await res.json();

        if (!json.success) {
            throw new Error(json.message || 'Request failed');
        }

        return json.data;
    } catch (error) {
        clearTimeout(timeoutId);

        if (error instanceof DOMException && error.name === 'AbortError') {
            throw new Error('Server is waking up. Please wait a moment and try again.');
        }

        throw error;
    }
}

export const api = {
    login: (identifier: string, password: string) =>
        request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ identifier, password })
        }),

    register: (username: string, email: string, password: string) =>
        request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username, email, password })
        }),

    forgotPassword: (identifier: string) =>
        request('/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ identifier })
        }),

    resetPassword: (token: string, newPassword: string) =>
        request('/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify({ token, newPassword })
        }),

    changePassword: (currentPassword: string, newPassword: string) =>
        request('/users/me/password', {
            method: 'PATCH',
            body: JSON.stringify({ currentPassword, newPassword })
        }),

    getStats: () => request('/users/me/stats'),

    startThirtySeconds: (playerNames: string[], roundsPerPlayer: number) =>
        request('/thirty-seconds/games/start', {
            method: 'POST',
            body: JSON.stringify({
                mode: 'SOLO',
                playerNames,
                roundsPerPlayer
            })
        }),

    scoreRound: (gameId: string, roundId: string, score: number) =>
        request(`/thirty-seconds/games/${gameId}/rounds/score`, {
            method: 'POST',
            body: JSON.stringify({ roundId, score })
        }),

    completeGame: (gameId: string) =>
        request(`/thirty-seconds/games/${gameId}/complete`, {
            method: 'POST'
        }),

    startQna: (difficulty: string) =>
        request('/qna/attempts/start', {
            method: 'POST',
            body: JSON.stringify({ difficulty })
        }),

    submitQna: (
        attemptId: string,
        answers: Array<{
            questionId: string;
            selectedOptionId: string;
            timeTakenMs: number;
        }>
    ) =>
        request(`/qna/attempts/${attemptId}/submit`, {
            method: 'POST',
            body: JSON.stringify({ answers })
        }),

    getLeaderboard: (period: string = 'ALL', limit: number = 20) =>
        request<{
            period: string;
            entries: Array<{
                rank: number;
                userId: string;
                username: string;
                profilePictureUrl: string | null;
                score: number;
            }>;
        }>(`/leaderboard/qna?period=${period}&limit=${limit}`),

    logout: (refreshToken: string) =>
        request('/auth/logout', {
            method: 'POST',
            body: JSON.stringify({ refreshToken })
        })
};