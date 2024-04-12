import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PartialSupport from "../src/renderer/src/components/PartialSupport";

describe("PartialSupport Component", () => {
  const mockCssData = {
    data: {
      flex: {
        stats: {
          chrome: {
            89: "y",
            90: "a #1",
          },
          firefox: {
            88: "y",
            89: "a #2",
          },
        },
        notes_by_num: {
          1: "Partial support in Chrome 90.",
          2: "Partial support in Firefox 89.",
        },
      },
    },
  };
  const mockUserSelections = [{ browser: "Chrome", version: "89" }];
  const mockBrowsers = {
    Chrome: {
      versionsNotSupport: [],
      versionsPartiallySupport: [],
      versionsSupport: ["89", "90"],
      stat: "chrome",
    },
    Firefox: {
      versionsNotSupport: [],
      versionsPartiallySupport: [],
      versionsSupport: ["88", "89"],
      stat: "firefox",
    },
  };
  const mockCssInfo = [
    {
      cssProperties: ["grid-template-columns"],
      fileContent: "grid-template-columns: 1fr 1fr;",
      filePath: "/path/to/file",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Should render PartialSupport component correctly", () => {
    render(
      <PartialSupport
        cssProperty="flex"
        userSelections={mockUserSelections}
        cssData={mockCssData}
        browsers={mockBrowsers}
        cssInfo={mockCssInfo}
      />,
    );

    expect(screen.getByText(/is partially supported/)).toBeInTheDocument();
  });
});
