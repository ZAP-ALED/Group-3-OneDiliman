import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import DashboardPage from "../src/pages/Dashboard/DashboardPage";

describe("Should be connected to firebase", () => {
  it("fetched data from firebase should be mapped in the cards through the org bio", () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    waitFor(
      () =>
        expect(screen.getByText(/The official student publication of the Department of Computer Science, University of the Philippines Diliman/i))
          .toBeInTheDocument
    );

    waitFor(
      () =>
        expect(
          screen.getByText(
            /We are a service-oriented organization aimed towar…uter Science by working with real-world projects./i
          )
        ).toBeInTheDocument
    );
    waitFor(
      () =>
        expect(
          screen.getByText(
            /A student organization under Google Developers that aims to empower iskos & iskas through tech./i
          )
        ).toBeInTheDocument
    );
  });
});
