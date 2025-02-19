import { fetchApi } from './config';

export default async function postContact({ name, email, message }) {
    return fetchApi('api/contact', {
        method: 'POST',
        body: JSON.stringify({
            name,
            email,
            message,
        }),
    });
}
