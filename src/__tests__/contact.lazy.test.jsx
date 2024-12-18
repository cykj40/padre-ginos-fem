import { render, fireEvent } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import createFetchMock from "vitest-fetch-mock";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route } from "../routes/contact.lazy";

const queryClient = new QueryClient();
const fetchMocker = createFetchMock(vi);

fetchMocker.enableMocks();

test("can submit contact form", async () => {
    fetchMocker.mockResponseOnce(JSON.stringify({ status: "ok" }));
    const screen = render(
        <QueryClientProvider client={queryClient}>
            <Route.options.component />
        </QueryClientProvider>
    );
    const nameInput = screen.getByPlaceholderText("Name");
    const emailInput = screen.getByPlaceholderText("Email");
    const messageTextArea = screen.getByPlaceholderText("Message");
    

    const testData = {
        name: "Takey wakey",
        email: "takey@wakey.com",
        message: "Hi my name is Takey wakey, I'm testing the contact form! today is a great day to test the contact form!"
    };

    fireEvent.change(nameInput, { target: { value: testData.name } });
    fireEvent.change(emailInput, { target: { value: testData.email } });
    fireEvent.change(messageTextArea, { target: { value: testData.message } });

    const btn = screen.getByRole("button");
    fireEvent.click(btn);

    const h3 = await screen.findByRole("heading", { level: 3 });
    expect(h3.textContent).toBe("Message sent!");

    const requests = fetchMocker.requests();
    expect(requests).toHaveLength(1);
    expect(requests[0].url).toBe("/api/contact");
    expect(fetchMocker).toHaveBeenCalledWith("/api/contact", {
        body: JSON.stringify(testData),
        headers: {
            "Content-Type": "application/json"
        },
        method: "POST",
    });
});
