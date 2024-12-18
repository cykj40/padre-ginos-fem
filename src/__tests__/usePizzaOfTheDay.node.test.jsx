import { expect, test, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import createFetchMock from "vitest-fetch-mock";
import { usePizzaOfTheDay } from "../usePizzaOfTheDay";

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

const testPizza = {
    id: 1,
    name: "Test Pizza",
    description: "This is a test pizza",
    image: "/public/pizzas/1.webp",
    sizes: {
        S: 12.99,
        M: 14.99,
        L: 16.99
    }
};

test("can fetch pizza of the day", async () => {
    fetchMocker.mockResponseOnce(JSON.stringify(testPizza));
    const { result } = renderHook(() => usePizzaOfTheDay());
    
    expect(result.current).toBe(null); // Initial state
    
    await waitFor(() => {
        expect(result.current).toEqual(testPizza);
    });
    
    expect(fetchMocker).toHaveBeenCalledWith("/api/pizza-of-the-day");
});







