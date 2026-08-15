import { api } from '$lib/api';

function createAuth() {
    let user = $state<any>(null);

    function init() {
        if (typeof window === 'undefined') return;
        const saved = localStorage.getItem('user');
        if (saved) {
            try {
                user = JSON.parse(saved);
            } catch {
                user = null;
            }
        }
    }

    function setSession(data: any) {
        const accessToken = data?.accessToken ?? data?.tokens?.accessToken;
        const refreshToken = data?.refreshToken ?? data?.tokens?.refreshToken;
        if (accessToken) localStorage.setItem('accessToken', accessToken);
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
        user = data?.user ?? null;
        if (user) localStorage.setItem('user', JSON.stringify(user));
    }

    return {
        get user() {
            return user;
        },
        init,
        async login(identifier: string, password: string) {
            const data = await api.login(identifier, password);
            setSession(data);
        },
        async register(username: string, email: string, password: string) {
            const data = await api.register(username, email, password);
            setSession(data);
        },
        logout() {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            user = null;
        }
    };
}

export const auth = createAuth();