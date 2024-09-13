export const tokenExist = () => {
    const token = localStorage.getItem('token');

    return !!token;
}