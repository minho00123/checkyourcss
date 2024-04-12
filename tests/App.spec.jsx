import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../src/renderer/src/App";

describe("App 컴포넌트", () => {
  it("Header 컴포넌트가 렌더링되어야 함", () => {
    render(<App />);
    const headerElement = screen.getByTestId("header");
    expect(headerElement).toBeInTheDocument();
  });

  it("Home 컴포넌트가 렌더링되어야 함", () => {
    render(<App />);
    const homeElement = screen.getByTestId("home");
    expect(homeElement).toBeInTheDocument();
  });

  it("Footer 컴포넌트가 렌더링되어야 함", () => {
    render(<App />);
    const footerElement = screen.getByTestId("footer");
    expect(footerElement).toBeInTheDocument();
  });
});
