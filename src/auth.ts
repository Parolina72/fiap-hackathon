export type UserRole = 'common' | 'manager'

export type CurrentUser = {
	email: string
	role: UserRole
}

export function getCurrentUser(): CurrentUser | null {
	try {
		const savedUser = JSON.parse(localStorage.getItem('currentUser') ?? 'null')
		if (savedUser && typeof savedUser.email === 'string' && ['common', 'manager'].includes(savedUser.role)) {
			return savedUser as CurrentUser
		}
	} catch {
		return null
	}

	return null
}