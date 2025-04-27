import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import PizzaOfTheDay from "../PizzaOfTheDay";
import Header from "../Header";
import { CartProvider } from "../../app/contexts/CartContext";

export const Route = createRootRoute({
    component: () => {
        return (
            <>
                <CartProvider>
                    <div>
                        <Header />
                        <Outlet />
                        <PizzaOfTheDay />
                    </div>
                </CartProvider>
                <TanStackRouterDevtools />
                <ReactQueryDevtools />
            </>
        )
    }
});
