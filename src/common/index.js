const backendDomain = import.meta.env.VITE_APP_BACKEND_URL

export const authApi = {
    login: {
        url: `${backendDomain}/api/auth/login`,
        method: 'post'
    },
    register: {
        url: `${backendDomain}/api/auth/register`,
        method: 'post'
    },
    forgotPassword: {
        url: `${backendDomain}/api/auth/forgot-password`,
        method: 'post'
    },
    newPassword: {
        url: `${backendDomain}/api/auth/new-password`,
        method: 'put'
    }
}

export const userApi = {
    getUserById: {
        url: `${backendDomain}/api/users`,
        method: 'get'
    },
    getAllUser: {
        url: `${backendDomain}/api/users`,
        method: 'get'
    },
    createUser: {
        url: `${backendDomain}/api/users`,
        method: 'post'
    },
    updateUser: {
        url: `${backendDomain}/api/users`,
        method: 'put'
    },
    deleteUser: {
        url: `${backendDomain}/api/users`,
        method: 'delete'
    }
}

export const roleApi = {
    getAllRoles: {
        url: `${backendDomain}/api/roles`,
        method: 'get'
    }
}