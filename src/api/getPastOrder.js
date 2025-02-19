import { fetchApi } from './config';

export default async function getPastOrder(order) {
    return fetchApi(`api/past-order/${order}`);
}
