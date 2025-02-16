import { getFullUrl } from './config';

export default async function postContact({ name, email, message }) {
    const response = await fetch(getFullUrl('/api/contact'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name,
            email,
            message,
        }),
    });
    const data = await response.json();
    return data;
}
