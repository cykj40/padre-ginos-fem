import { fetchApi } from './config';

export default async function getPastOrders(page = 1) {
    return fetchApi(`api/past-orders?page=${page}`);
}
