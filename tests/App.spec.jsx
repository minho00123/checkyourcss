import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../src/renderer/src/App";

describe("App Components", () => {
  it("Should render Header Component", () => {
    render(<App />);
    const headerElement = screen.getByTestId("header");
    expect(headerElement).toBeInTheDocument();
  });

  it("Should render Home Component", () => {
    render(<App />);
    const homeElement = screen.getByTestId("home");
    expect(homeElement).toBeInTheDocument();
  });

  it("Should render Footer Component", () => {
    render(<App />);
    const footerElement = screen.getByTestId("footer");
    expect(footerElement).toBeInTheDocument();
  });
});
