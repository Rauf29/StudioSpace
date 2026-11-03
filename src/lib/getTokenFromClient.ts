import { authClient } from '@/lib/auth-client';

export async function getTokenFromClient(): Promise<string | null> {
	try {
		const { data, error } = await authClient.token();
		if (error || !data?.token) {
			return null;
		}
		return data.token;
	} catch (err) {
		console.error('Failed to get token from client:', err);
		return null;
	}
}