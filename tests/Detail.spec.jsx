import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Detail from "../src/renderer/src/components/Detail";

const mockProps = {
  cssData: {
    data: {
      "grid-template-columns": {
        stats: {
          chrome: {
            89: "y",
            90: "y",
          },
          firefox: {
            88: "y",
            89: "y",
          },
        },
      },
    },
  },
  clickedValue: "grid-template-columns",
  isNotSupportCss: true,
  browsers: {
    Chrome: {
      versionsNotSupport: [],
      versionsPartiallySupport: [],
      versionsSupport: ["89", "90"],
    },
    Firefox: {
      versionsNotSupport: [],
      versionsPartiallySupport: [],
      versionsSupport: ["88", "89"],
    },
  },
  userSelections: [{ browser: "Chrome", version: "89" }],
  setIsDetailClicked: vi.fn(),
  cssInfo: [
    {
      cssProperties: ["grid-template-columns"],
      fileContent: "grid-template-columns: 1fr 1fr;",
      filePath: "/path/to/file",
    },
  ],
};

describe("Detail Component", () => {
  it("renders the NotSupport component when isNotSupportCss is true", async () => {
    render(<Detail {...mockProps} isNotSupportCss={true} />);
    const notSupportComponent = screen.getByText(/is not supported/);
    expect(notSupportComponent).toBeInTheDocument();
  });
});
