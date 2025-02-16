import { getFullUrl } from './config';

export default async function getPastOrders(page = 1) {
    const response = await fetch(getFullUrl(`/api/past-orders?page=${page}`));
    const data = await response.json();
    return data;
}
