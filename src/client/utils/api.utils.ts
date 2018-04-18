export const handleError = async (res: Response) => {
    if(res.status >= 200 && res.status < 300 && res.ok) {
        return res;
    } else {
        const body = await res.json();
        throw new Error(String(body.errors.message) || res.statusText);
    }
}