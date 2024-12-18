import { render } from "vitest-browser-react";
import { expect, test } from "vitest";
import Pizza from "../Pizza";

test("alt text renders on image", async () => {
    const name = "My favorite pizza";
    const src = "https://picsum.photos/200";
    const screen = render(
        <Pizza name={name} description="Super Cool pizza" image={src} />
    );
    const image = screen.getByRole("img");
    expect(image.src).toBe(src);
    expect(image.alt).toBe(name);
});

test("to have default image if none is provided", async () => {
    const screen = render(
        <Pizza name="My Favorite Pizza" description="Super Cool pizza" />
    );
    const image = screen.getByRole("img");
    expect(image.src).not.toBe("");
});
