import { getFullUrl } from './config';

export default async function getPastOrder(order) {
    const response = await fetch(getFullUrl(`/api/past-order/${order}`));
    const data = await response.json();
    return data;
}
