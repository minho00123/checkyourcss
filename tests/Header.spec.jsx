import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Header from "../src/renderer/src/components/Header";

describe("Header Components", () => {
  let originalLocation;

  beforeEach(() => {
    originalLocation = window.location;
    delete window.location;
    window.location = { reload: vi.fn() };
  });

  afterEach(() => {
    window.location = originalLocation;
  });

  it("Should render Header correctly", () => {
    render(<Header />);
    const headerElement = screen.getByTestId("header");
    expect(headerElement).toBeInTheDocument();
  });

  it("Should include 'Check Your CSS' Text", () => {
    render(<Header />);
    expect(screen.getByText("Check Your CSS")).toBeInTheDocument();
  });

  it("Should render the logo image", () => {
    render(<Header />);
    const logoImage = screen.getByAltText("cyc logo");
    expect(logoImage).toBeInTheDocument();
    expect(logoImage).toHaveAttribute(
      "src",
      expect.stringContaining("cyc-logo.png"),
    );
  });

  it("Should reload the page when the logo image is clicked", async () => {
    render(<Header />);
    const logoImage = screen.getByAltText("cyc logo");
    await userEvent.click(logoImage);
    expect(window.location.reload).toHaveBeenCalledTimes(1);
  });
});
